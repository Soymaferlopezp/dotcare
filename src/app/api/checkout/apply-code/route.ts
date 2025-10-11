import { NextResponse } from "next/server";

type CodeInfo = { official: string; discount_bps: number; variant: 0 | 1 | 2 };
type Plan = "monthly" | "yearly";

const CODE_TABLE: Record<string, CodeInfo> = {
  "NERDCONF-2025": { official: "NERDCONF-2025", discount_bps: 500, variant: 2 },
  "DOTCARELOVER":  { official: "DOTCARELOVER",  discount_bps: 1000, variant: 1 },
  // aliases aceptados
  "NERDCONF-25":   { official: "NERDCONF-2025", discount_bps: 500, variant: 2 },
  "DOTLOVER":      { official: "DOTCARELOVER",  discount_bps: 1000, variant: 1 },
};

function norm(s: string) { return (s || "").toUpperCase().trim(); }
const isUUID = (s: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(s);

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const TABLE = "checkout_sessions";
const WEBHOOKS = "webhooks";

function headers() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

/** PATCH por id si existe (id UUID). */
async function patchById(id: string, patch: Record<string, string | number | boolean>) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}?id=eq.${encodeURIComponent(id)}`;
  return fetch(url, {
    method: "PATCH",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(patch),
    cache: "no-store",
  });
}

/** INSERT de una sesión mínima válida según tu h2_schema.sql (sin forzar id). */
async function insertMinimal(plan: Plan, code: CodeInfo) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;
  const now = new Date().toISOString();
  const payload = {
    plan,                            // NOT NULL (enum-like en tu check)
    base_price_cents: 0,             // NOT NULL
    discount_bps: code.discount_bps, // 0..5000
    final_price_cents: 0,            // NOT NULL (se recalcula luego en tu flujo)
    code: code.official,             // existe en tu esquema
    status: "code_applied",          // compatible con tu check
    updated_at: now,                 // existe en tu esquema
  } as Record<string, string | number>;

  return fetch(url, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify(payload),
  });
}

/** Log tolerante en webhooks si no podemos tocar checkout_sessions. */
async function logWebhook(kind: string, payload: unknown) {
  const url = `${SUPABASE_URL}/rest/v1/${WEBHOOKS}`;
  await fetch(url, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=minimal" },
    body: JSON.stringify({ kind, payload_json: payload }),
  });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      sessionId?: string;
      code?: string;
      plan?: Plan;
    };

    const sessionId = String(body?.sessionId || "");
    const plan: Plan = body?.plan === "yearly" ? "yearly" : "monthly";
    const raw = String(body?.code || "");
    const match = CODE_TABLE[norm(raw)];

    if (!raw)         return NextResponse.json({ error: "code requerido" }, { status: 400 });
    if (!match)       return NextResponse.json({ error: "Código inválido o inactivo." }, { status: 400 });

    // Intento 1: si el sessionId es UUID, intentamos PATCH por id
    if (sessionId && isUUID(sessionId)) {
      const res = await patchById(sessionId, {
        code: match.official,
        discount_bps: match.discount_bps,
        status: "code_applied",
        plan,
        updated_at: new Date().toISOString(),
      });

      if (res.ok || res.status === 204) {
        return NextResponse.json({
          sessionId,
          discount_bps: match.discount_bps,
          variant: match.variant,
          code: match.official,
          plan,
        });
      }
      // Si falla el PATCH (fila no existe), continuamos a Insert
      await logWebhook("apply_code_patch_miss", { sessionId, code: match.official, plan });
    }

    // Intento 2: insert minimal (sin id, deja que Postgres genere UUID)
    const ins = await insertMinimal(plan, match);
    if (!ins.ok) {
      const txt = await ins.text();
      // Como último recurso, log y devolvemos éxito “optimista” para no romper UX
      await logWebhook("apply_code_insert_failed", { sessionId, code: match.official, plan, error: txt });
      return NextResponse.json({
        sessionId,
        discount_bps: match.discount_bps,
        variant: match.variant,
        code: match.official,
        plan,
        note: "logged_insert_failure",
      });
    }

    // OK insert
    return NextResponse.json({
      sessionId,
      discount_bps: match.discount_bps,
      variant: match.variant,
      code: match.official,
      plan,
    });
  } catch (e) {
    // Fallback extremo: no romper UX, registrar y responder 200 con datos del código
    const msg = e instanceof Error ? e.message : String(e);
    await logWebhook("apply_code_uncaught", { error: msg });
    return NextResponse.json({ ok: true, note: "apply_code_logged" });
  }
}
