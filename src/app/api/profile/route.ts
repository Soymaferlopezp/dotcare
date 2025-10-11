// src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { AVATARS } from "@/lib/demoData";

/** ---------- Helpers de entorno (SIN supabase.ts) ---------- */
const URL_SB = process.env.SUPABASE_URL;
const KEY_SB = process.env.SUPABASE_ANON_KEY;

const okEnv = () => !!(URL_SB && KEY_SB && /^https?:\/\//i.test(URL_SB));
const sbHeaders = () => ({
  apikey: KEY_SB as string,
  Authorization: `Bearer ${KEY_SB}`,
  "Content-Type": "application/json",
});

/** ---------- Helpers perfil ---------- */
const keyFrom = (req: NextRequest) => {
  const w = req.headers.get("x-wallet-address");
  if (w && w.startsWith("0x")) return w.toLowerCase();
  const kH = req.headers.get("x-profile-key");
  const url = new URL(req.url);
  const kQ = url.searchParams.get("key");
  const k = kH || kQ;
  if (k && !k.startsWith("0x")) return k; // "anon:<uuid>"
  return "anon:public";
};

const short = (addr?: string | null) =>
  !addr || addr === "—" || addr.startsWith?.("anon:") ? "guest" : addr.slice(0, 4) + "…" + addr.slice(-4);

type DBRow = {
  id?: string;
  wallet_address?: string | null;
  alias?: string | null;
  bio?: string | null;
  x_url?: string | null;
  tag?: "ADMIN" | "NERD" | "DOTCARELOVER" | "DOTCARE" | null;
  avatar_url?: string | null;
};

const toProfile = (row: DBRow) => {
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
};

/** ---------- GET ---------- */
export async function GET(req: NextRequest) {
  const key = keyFrom(req);

  if (!okEnv()) {
    // Stub seguro (no rompe build)
    return NextResponse.json({
      ok: true,
      note: "supabase_env_missing_stub",
      data: toProfile({
        id: "stub",
        wallet_address: key,
        alias: "Builder",
        bio: "",
        x_url: "",
        tag: "DOTCARE",
        avatar_url: AVATARS.default,
      }),
    });
  }

  // Buscar por REST
  const selectUrl = `${URL_SB}/rest/v1/profiles?wallet_address=eq.${encodeURIComponent(key)}&select=*&limit=1`;
  const sel = await fetch(selectUrl, { headers: sbHeaders(), cache: "no-store" });
  if (!sel.ok) {
    const detail = await sel.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "db_select_error", detail }, { status: 500 });
  }
  const rows = (await sel.json()) as unknown[];
  const row = Array.isArray(rows) ? (rows[0] as DBRow | undefined) : undefined;

  if (row) return NextResponse.json({ ok: true, data: toProfile(row) });

  // Insert base si no existe
  const base: DBRow = {
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
    body: JSON.stringify(base),
  });
  if (!ins.ok) {
    const detail = await ins.text().catch(() => "");
    return NextResponse.json({ ok: false, error: "db_insert_error", detail }, { status: 500 });
  }
  const created = (await ins.json()) as unknown[];
  const createdRow = Array.isArray(created) ? (created[0] as DBRow | undefined) : undefined;

  return NextResponse.json({ ok: true, data: toProfile(createdRow ?? base) });
}

/** ---------- POST ---------- */
export async function POST(req: NextRequest) {
  const key = keyFrom(req);
  const body = (await req.json().catch(() => ({}))) as Partial<{
    alias: string;
    bio: string;
    xUrl: string;
    avatar: string;
  }>;

  if (!okEnv()) {
    // Stub de guardado
    return NextResponse.json({
      ok: true,
      note: "supabase_env_missing_stub",
      data: toProfile({
        wallet_address: key,
        alias: body.alias?.trim() || "Builder",
        bio: body.bio || "",
        x_url: body.xUrl || "",
        tag: "DOTCARE",
        avatar_url: body.avatar || AVATARS.default,
      }),
    });
  }

  const patch: DBRow = { wallet_address: key };
  if (typeof body.alias === "string") patch.alias = body.alias.trim();
  if (typeof body.bio === "string") patch.bio = body.bio;
  if (typeof body.xUrl === "string") patch.x_url = body.xUrl;
  if (typeof body.avatar === "string") patch.avatar_url = body.avatar;

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
  if (row) return NextResponse.json({ ok: true, data: toProfile(row) });

  // fallback select
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
