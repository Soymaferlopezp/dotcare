import { NextResponse } from "next/server";

type CodeInfo = { official: string; discount_bps: number; variant: 0 | 1 | 2 };

const CODE_TABLE: Record<string, CodeInfo> = {
  "NERDCONF-2025": { official: "NERDCONF-2025", discount_bps: 500, variant: 2 },
  "DOTCARELOVER":  { official: "DOTCARELOVER",  discount_bps: 1000, variant: 1 },
  // aliases aceptados:
  "NERDCONF-25":   { official: "NERDCONF-2025", discount_bps: 500, variant: 2 },
  "DOTLOVER":      { official: "DOTCARELOVER",  discount_bps: 1000, variant: 1 },
};

function norm(s: string) { return (s || "").toUpperCase().trim(); }

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const TABLE = "checkout_sessions";

/** Intenta upsert usando la clave dada ("session_id" o "id"). */
async function tryUpsert(key: "session_id" | "id", sessionId: string, code: CodeInfo) {
  const url = `${SUPABASE_URL}/rest/v1/${TABLE}`;
  const now = new Date().toISOString();
  const payload: Record<string, any> = {
    [key]: sessionId,
    code_applied: code.official,
    discount_bps: code.discount_bps,
    variant: code.variant,
    updated_at: now,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      // merge-duplicates requiere una UNIQUE/PK en la columna clave
      Prefer: "return=minimal,resolution=merge-duplicates",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`${res.status} ${txt}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const sessionId = String(body?.sessionId || "");
    const codeRaw   = String(body?.code || "");

    if (!sessionId) return NextResponse.json({ error: "sessionId requerido" }, { status: 400 });
    if (!codeRaw)   return NextResponse.json({ error: "code requerido" }, { status: 400 });

    const match = CODE_TABLE[norm(codeRaw)];
    if (!match) return NextResponse.json({ error: "Código inválido o inactivo." }, { status: 400 });

    // Persistencia tolerante al esquema:
    // 1) probamos con session_id
    try {
      await tryUpsert("session_id", sessionId, match);
    } catch (e) {
      // 2) si falla, probamos con id (para esquemas que usan "id" como clave)
      try {
        await tryUpsert("id", sessionId, match);
      } catch (e2) {
        // Si también falla, devolvemos 200 igualmente (no rompemos UX) pero logeamos
        console.error("Supabase upsert falló en ambas claves:", String(e2));
      }
    }

    return NextResponse.json({
      sessionId,
      discount_bps: match.discount_bps,
      variant: match.variant,
      code: match.official,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
