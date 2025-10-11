// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AVATARS } from "@/lib/demoData";

/** -------------------- Helpers de entorno (sin supabase.ts) -------------------- */
const URL_SB = process.env.SUPABASE_URL;
const KEY_SB = process.env.SUPABASE_ANON_KEY;

function okEnv() {
  return !!(URL_SB && KEY_SB && /^https?:\/\//i.test(URL_SB));
}
function sbHeaders() {
  return {
    apikey: KEY_SB as string,
    Authorization: `Bearer ${KEY_SB}`,
    "Content-Type": "application/json",
  };
}

/** -------------------- Helpers de request/perfil -------------------- */
function keyFrom(req: NextRequest): string {
  // 1) Wallet real por header (cuando activemos gating)
  const w = req.headers.get("x-wallet-address");
  if (w && w.startsWith("0x")) return w.toLowerCase();

  // 2) clave anónima estable enviada por el cliente (header o query)
  const kH = req.headers.get("x-profile-key");
  const url = new URL(req.url);
  const kQ = url.searchParams.get("key");
  const k = kH || kQ;
  if (k && !k.startsWith("0x")) return k; // ej: "anon:<uuid>"

  // 3) fallback
  return "anon:public";
}

function short(addr?: string | null) {
  if (!addr || addr === "—" || (addr.startsWith && addr.startsWith("anon:"))) return "guest";
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

type DBRow = {
  id?: string;
  wallet_address?: string | null;
  alias?: string | null;
  bio?: string | null;
  x_url?: string | null;
  tag?: "ADMIN" | "NERD" | "DOTCARELOVER" | "DOTCARE" | null;
  avatar_url?: string | null;
};

function toProfile(row: DBRow) {
  const address = row.wallet_address ?? "—";
  return {
    id: row.id || "no-id",
    address,
    addressShort: short(address),
    alias: row.alias ?? "Builder",
    bio: row.bio ?? "",
    avatar: row.avatar_url ?? AVATARS.default,
    tag: row.tag ?? "DOTCARE",
    xUrl: row.x_url ?? "",
  };
}

/** -------------------- GET /api/profile -------------------- */
export async function GET(req: NextRequest) {
  const key = keyFrom(req);

  // Sin envs válidas → devolvemos perfil base (no rompemos build)
  if (!okEnv()) {
    return NextResponse.json({
      ok: true,
      data: toProfile({
        id: "stub",
        wallet_address: key,
        alias: "Builder",
        bio: "",
        x_url: "",
        tag: "DOTCARE",
        avatar_url: AVATARS.default,
      }),
      note: "supabase_env_missing_stub",
    });
  }

  // 1) Buscar perfil por wallet_address
  const selectUrl = `${URL_SB}/rest/v1/profiles?wallet_address=eq.${encodeURIComponent(key)}&select=*&limit=1`;
  const sel = await fetch(selectUrl, { headers: sbHeaders(), cache: "no-store" });
  if (!sel.ok) {
    const detail = await sel.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "db_select_error", detail }, { status: 500 });
  }
  const rows = (await sel.json()) as unknown[];
  const row = Array.isArray(rows) ? (rows[0] as DBRow | undefined) : undefined;

  if (row) {
    return NextResponse.json({ ok: true, data: toProfile(row) });
  }

  // 2) No existe → insert base
  const nowBase: DBRow = {
    wallet_address: key,
    alias: "Builder",
    bio: "",
    x_url: "",
    tag: "DOTCARE",
    avatar_url: AVATARS.default,
  };
  const ins = await fetch(`${URL_SB}/rest/v1/profiles`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(nowBase),
  });
  if (!ins.ok) {
    const detail = await ins.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "db_insert_error", detail }, { status: 500 });
  }
  const created = (await ins.json()) as unknown[];
  const createdRow = Array.isArray(created) ? (created[0] as DBRow | undefined) : undefined;

  return NextResponse.json({ ok: true, data: toProfile(createdRow ?? nowBase) });
}

/** -------------------- POST /api/profile -------------------- */
export async function POST(req: NextRequest) {
  const key = keyFrom(req);

  // Recogemos posibles parches (solo campos editables desde UI)
  const body = (await req.json().catch(() => ({}))) as Partial<{
    alias: string;
    bio: string;
    xUrl: string;
    avatar: string;
  }>;

  // Sin envs válidas -> responder como si hubiéramos guardado (stub).
  if (!okEnv()) {
    const merged: DBRow = {
      wallet_address: key,
      alias: typeof body.alias === "string" && body.alias.trim() ? body.alias.trim() : "Builder",
      bio: typeof body.bio === "string" ? body.bio : "",
      x_url: typeof body.xUrl === "string" ? body.xUrl : "",
      tag: "DOTCARE",
      avatar_url: typeof body.avatar === "string" && body.avatar ? body.avatar : AVATARS.default,
    };
    return NextResponse.json({ ok: true, data: toProfile(merged), note: "supabase_env_missing_stub" });
  }

  // Construimos payload de upsert
  const patch: DBRow = { wallet_address: key };
  if (typeof body.alias === "string") patch.alias = body.alias.trim();
  if (typeof body.bio === "string") patch.bio = body.bio;
  if (typeof body.xUrl === "string") patch.x_url = body.xUrl;
  if (typeof body.avatar === "string") patch.avatar_url = body.avatar;

  // Upsert por wallet_address (on_conflict)
  const up = await fetch(`${URL_SB}/rest/v1/profiles?on_conflict=wallet_address`, {
    method: "POST",
    headers: { ...sbHeaders(), Prefer: "return=representation,resolution=merge-duplicates" },
    body: JSON.stringify(patch),
  });

  if (!up.ok) {
    const detail = await up.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "db_upsert_error", detail }, { status: 500 });
  }

  const rows = (await up.json()) as unknown[];
  const row = Array.isArray(rows) ? (rows[0] as DBRow | undefined) : undefined;

  // Si por cualquier razón no vino representation, hacemos un select
  if (!row) {
    const sel = await fetch(
      `${URL_SB}/rest/v1/profiles?wallet_address=eq.${encodeURIComponent(key)}&select=*&limit=1`,
      { headers: sbHeaders(), cache: "no-store" }
    );
    if (!sel.ok) {
      const detail = await sel.text().catch(() => "");
      return NextResponse.json({ ok: false, error: "db_select_after_upsert_error", detail }, { status: 500 });
    }
    const again = (await sel.json()) as unknown[];
    const againRow = Array.isArray(again) ? (again[0] as DBRow | undefined) : undefined;
    return NextResponse.json({ ok: true, data: toProfile(againRow ?? { wallet_address: key }) });
  }

  return NextResponse.json({ ok: true, data: toProfile(row) });
}
