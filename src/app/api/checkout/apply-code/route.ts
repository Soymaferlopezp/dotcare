import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { zApplyCodeBody } from "@/lib/validators";
import { applyDiscountBps, centsForPlan, formatCentsUSD } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parse = zApplyCodeBody.safeParse({
      ...json,
      code: typeof json?.code === "string" ? json.code.toUpperCase() : json?.code,
    });
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid body", issues: parse.error.issues }, { status: 400 });
    }

    const { sessionId, code } = parse.data;

    const { data: session, error: sErr } = await supabase
      .from("checkout_sessions")
      .select("id, plan, base_price_cents, status")
      .eq("id", sessionId)
      .single();

    if (sErr || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (["confirmed_offchain", "ready_for_chain", "onchain_success", "active"].includes(session.status)) {
      return NextResponse.json({ error: "Session already confirmed/locked" }, { status: 409 });
    }

    const { data: coupon, error: cErr } = await supabase
      .from("coupons")
      .select("id, discount_bps, active, max_uses, used, expires_at")
      .eq("code", code)
      .limit(1)
      .maybeSingle();

    if (cErr || !coupon) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const now = new Date();
    const expired = coupon.expires_at ? new Date(coupon.expires_at) <= now : false;
    const exhausted = coupon.used >= coupon.max_uses;
    const inactive = !coupon.active;
    const badBps = coupon.discount_bps < 0 || coupon.discount_bps > 5000;

    if (inactive || expired || exhausted || badBps) {
      return NextResponse.json({ error: "Code not eligible" }, { status: 400 });
    }

    const base =
      typeof session.base_price_cents === "number"
        ? session.base_price_cents
        : centsForPlan(session.plan as "monthly" | "yearly");

    const final = applyDiscountBps(base, coupon.discount_bps);

    const { error: uErr } = await supabase
      .from("checkout_sessions")
      .update({
        discount_bps: coupon.discount_bps,
        final_price_cents: final,
        code,
        status: "code_applied",
      })
      .eq("id", sessionId);

    if (uErr) {
      return NextResponse.json({ error: "Update failed", details: uErr.message }, { status: 500 });
    }

    return NextResponse.json({
      sessionId,
      base_price_cents: base,
      discount_bps: coupon.discount_bps,
      final_price_cents: final,
      final_price_label: formatCentsUSD(final),
      status: "code_applied",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: "Unexpected", details: message }, { status: 500 });
  }
}
