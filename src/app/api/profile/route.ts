import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/lib/types";
import { AVATARS } from "@/lib/demoData";

// Tipo de fila en la tabla `profiles`
type DBProfileRow = {
  id: string;
  wallet_address: string | null;
  alias: string | null;
  bio: string | null;
  x_url: string | null;
  tag: "ADMIN" | "NERD" | "DOTCARELOVER" | "DOTCARE" | null;
  avatar_url: string | null;
};

function keyFrom(req: NextRequest): string {
  const w = req.headers.get("x-wallet-address");
  if (w && w.startsWith("0x")) return w.toLowerCase();

  const kH = req.headers.get("x-profile-key");
  const url = new URL(req.url);
  const kQ = url.searchParams.get("key");
  const k = kH || kQ;
  if (k && !k.startsWith("0x")) return k; // p.ej. "anon:<uuid>"

  return "anon:public";
}

function short(addr?: string | null) {
  if (!addr || addr === "—" || addr.startsWith?.("anon:")) return "guest";
  return addr.slice(0, 4) + "…" + addr.slice(-4);
}

function mapRowToProfile(row: DBProfileRow): UserProfile {
  return {
    id: row.id,
    address: row.wallet_address ?? "—",
    addressShort: short(row.wallet_address ?? undefined),
    alias: row.alias ?? "Builder",
    bio: row.bio ?? "",
    avatar: row.avatar_url ?? AVATARS.default,
    tag: row.tag ?? "DOTCARE",
    xUrl: row.x_url ?? "",
  };
}

export async function GET(req: NextRequest) {
  const key = keyFrom(req);

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("wallet_address", key)
      .single();

    if (error && (error as any).code !== "PGRST116") {
      // PGRST116 = multiple/no rows; lo manejamos abajo
      throw error;
    }

    if (data) {
      return NextResponse.json({ ok: true, data: mapRowToProfile(data as unknown as DBProfileRow) });
    }

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

    return NextResponse.json({
      ok: true,
      data: mapRowToProfile(ins.data as unknown as DBProfileRow),
    });
  } catch (e) {
    console.error("[GET /api/profile]", e);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const key = keyFrom(req);
  const body = (await req.json().catch(() => ({}))) as Partial<UserProfile>;

  const patch: Partial<DBProfileRow> = {};
  if (typeof body.alias === "string") patch.alias = body.alias;
  if (typeof body.bio === "string") patch.bio = body.bio;
  if (typeof body.xUrl === "string") patch.x_url = body.xUrl;
  if (typeof body.avatar === "string") patch.avatar_url = body.avatar;

  try {
    // upsert sin genéricos ni .eq() encadenado
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

    return NextResponse.json({
      ok: true,
      data: mapRowToProfile(sel.data as unknown as DBProfileRow),
    });
  } catch (e) {
    console.error("[POST /api/profile]", e);
    return NextResponse.json({ ok: false, error: "db_upsert_or_select_error" }, { status: 500 });
  }
}
