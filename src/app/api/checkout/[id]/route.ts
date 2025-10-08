import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Params) {
  try {
    const { id } = await ctx.params; // <- importante en Next 15

    const { data, error } = await supabase
      .from("checkout_sessions")
      .select(
        "id, plan, base_price_cents, discount_bps, final_price_cents, code, status, paid_offchain, created_at, expires_at"
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: "Unexpected", details: e?.message }, { status: 500 });
  }
}
