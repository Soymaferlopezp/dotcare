import { NextRequest, NextResponse } from "next/server";

type Plan = "monthly" | "yearly";

const isUUID = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

const URL_SB = process.env.SUPABASE_URL;
const KEY_SB = process.env.SUPABASE_ANON_KEY;
const TABLE = "checkout_sessions";

function okEnv() {
  return !!(URL_SB && KEY_SB && /^https?:\/\//i.test(URL_SB));
}
function headers() {
  return {
    apikey: KEY_SB as string,
    Authorization: `Bearer ${KEY_SB}`,
    "Content-Type": "application/json",
  };
}

/**
 * POST /api/checkout/confirm-offchain
 * Body esperado (flexible):
 * { id?: string; sessionId?: string; plan?: "monthly"|"yearly"; final_price_cents?: number }
 */
export async function POST(req: NextRequest) {
  const now = new Date().toISOString();
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    sessionId?: string;
    plan?: Plan;
    final_price_cents?: number;
  };

  const id = String(body.id || body.sessionId || "");
  const plan: Plan = body.plan === "yearly" ? "yearly" : "monthly";
  const final_price_cents = Number.isFinite(body.final_price_cents)
    ? Number(body.final_price_cents)
    : 0;

  // Sin envs válidas -> responder stub (no romper build ni UX)
  if (!okEnv()) {
    return NextResponse.json({
      ok: true,
      note: "supabase_env_missing_stub",
      data: {
        id: id || "stub",
        status: "confirmed_offchain",
        plan,
        final_price_cents,
        paid_offchain: true,
        updated_at: now,
      },
    });
  }

  // Si tenemos id UUID, intentamos PATCH por id
  if (id && isUUID(id)) {
    const url = `${URL_SB}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`;
    const res = await fetch(url, {
      method: "PATCH",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify({
        status: "confirmed_offchain",
        paid_offchain: true,
        plan,
        final_price_cents,
        updated_at: now,
      }),
    });

    if (res.ok || res.status === 204) {
      return NextResponse.json({
        ok: true,
        data: {
          id,
          status: "confirmed_offchain",
          plan,
          final_price_cents,
          paid_offchain: true,
          updated_at: now,
        },
      });
    }

    // Si el PATCH no encontró fila, intentamos INSERT mínimo válido
    const insUrl = `${URL_SB}/rest/v1/${TABLE}`;
    const ins = await fetch(insUrl, {
      method: "POST",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify({
        // no forzamos id; Postgres genera UUID
        plan,
        base_price_cents: final_price_cents, // placeholder (ajusta si tienes base real)
        discount_bps: 0,
        final_price_cents,
        status: "confirmed_offchain",
        paid_offchain: true,
        updated_at: now,
      }),
    });

    if (ins.ok) {
      return NextResponse.json({
        ok: true,
        data: {
          id,
          status: "confirmed_offchain",
          plan,
          final_price_cents,
          paid_offchain: true,
          updated_at: now,
          note: "inserted_minimal",
        },
      });
    }

    const txt = await ins.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: "insert_failed", detail: txt },
      { status: 500 }
    );
  }

  // Si no hay id UUID, hacemos solo un INSERT mínimo (sesión nueva)
  const insUrl = `${URL_SB}/rest/v1/${TABLE}`;
  const ins = await fetch(insUrl, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify({
      plan,
      base_price_cents: final_price_cents,
      discount_bps: 0,
      final_price_cents,
      status: "confirmed_offchain",
      paid_offchain: true,
      updated_at: now,
    }),
  });

  if (!ins.ok) {
    const txt = await ins.text().catch(() => "");
    return NextResponse.json(
      { ok: false, error: "insert_failed", detail: txt },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: {
      id: "generated",
      status: "confirmed_offchain",
      plan,
      final_price_cents,
      paid_offchain: true,
      updated_at: now,
    },
  });
}
