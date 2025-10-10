import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/lib/types";
import { AVATARS } from "@/lib/demoData";

function keyFrom(req: NextRequest): string {
  // 1) wallet real
  const w = req.headers.get("x-wallet-address");
  if (w && w.startsWith("0x")) return w.toLowerCase();
  // 2) clave anónima estable enviada por el cliente
  const kH = req.headers.get("x-profile-key");
  const url = new URL(req.url);
  const kQ = url.searchParams.get("key");
  const k = kH || kQ;
  if (k && !k.startsWith("0x")) return k; // debe venir como "anon:<uuid>"
  // 3) fallback (evita nulls/duplicados)
  return "anon:public";
}

function short(addr?: string | null) {
  if (!addr) return "guest";
  if (addr.startsWith("anon:")) return "guest";
  if (addr === "—") return "guest";
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

function mapRowToProfile(row: any): UserProfile {
  return {
    id: row.id,
    address: row.wallet_address ?? "—",
    addressShort: short(row.wallet_address),
    alias: row.alias ?? "Builder",
    bio: row.bio ?? "",
    avatar: row.avatar_url ?? AVATARS.default,
    tag: row.tag ?? "DOTCARE",
    xUrl: row.x_url ?? "",
  };
}

export async function GET(req: NextRequest) {
  const key = keyFrom(req); // "anon:<uuid>" o "0x..."
  try {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", key)
      .single();

    if (data) return NextResponse.json({ ok: true, data: mapRowToProfile(data) });

    // crear base si no existe
    const base = {
      wallet_address: key,
      alias: "Builder",
      bio: "",
      x_url: "",
      tag: "DOTCARE",
      avatar_url: AVATARS.default,
    };
    const ins = await supabase.from("profiles").insert(base).select("*").single();
    if (ins.error) throw ins.error;
    return NextResponse.json({ ok: true, data: mapRowToProfile(ins.data) });
  } catch (e) {
    console.error("[GET /api/profile]", e);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const key = keyFrom(req);
  const body = (await req.json().catch(() => ({}))) as Partial<UserProfile>;
  const patch: any = {};
  if (typeof body.alias === "string") patch.alias = body.alias;
  if (typeof body.bio === "string") patch.bio = body.bio;
  if (typeof body.xUrl === "string") patch.x_url = body.xUrl;
  if (typeof body.avatar === "string") patch.avatar_url = body.avatar;

  try {
    // upsert sin .eq() encadenado
    const up = await supabase
      .from("profiles")
      .upsert({ wallet_address: key, ...patch }, { onConflict: "wallet_address", ignoreDuplicates: false });
    if (up.error) throw up.error;

    const sel = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", key)
      .single();
    if (sel.error) throw sel.error;

    return NextResponse.json({ ok: true, data: mapRowToProfile(sel.data) });
  } catch (e) {
    console.error("[POST /api/profile]", e);
    return NextResponse.json({ ok: false, error: "db_upsert_or_select_error" }, { status: 500 });
  }
}
