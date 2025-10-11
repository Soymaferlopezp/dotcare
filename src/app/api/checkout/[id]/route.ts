import { NextResponse, NextRequest } from "next/server";

/**
 * GET /api/checkout/[id]
 * Lee una session desde Supabase vía REST si hay envs;
 * si no, devuelve un stub que no rompe el build.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;

  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;

  // Si en build/runtime faltan envs, devolvemos un stub seguro (no lanzamos).
  if (!url || !/^https?:\/\//i.test(url) || !anon) {
    return NextResponse.json({
      ok: true,
      data: { id, status: "created", plan: "monthly", discount_bps: 0, final_price_cents: 0 },
      note: "supabase_env_missing_stub",
    });
  }

  // Consulta real a Supabase REST
  const api = `${url}/rest/v1/checkout_sessions?id=eq.${encodeURIComponent(id)}&select=*`;
  const res = await fetch(api, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "db_error", detail: text }, { status: 500 });
  }

  const rows = (await res.json()) as unknown[];
  const row = Array.isArray(rows) ? rows[0] : null;

  return NextResponse.json({
    ok: true,
    data: row ?? { id, status: "created", plan: "monthly", discount_bps: 0, final_price_cents: 0 },
  });
}
