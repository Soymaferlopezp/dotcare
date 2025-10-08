import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { zCreateSessionBody, zPlan } from "@/lib/validators";
import { centsForPlan } from "@/lib/pricing";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parse = zCreateSessionBody.safeParse(json);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid body", issues: parse.error.issues }, { status: 400 });
    }

    const { plan } = parse.data;
    if (!zPlan.safeParse(plan).success) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const base = centsForPlan(plan);
    const { data, error } = await supabase
      .from("checkout_sessions")
      .insert({
        plan,
        base_price_cents: base,
        discount_bps: 0,
        final_price_cents: base,
        status: "created",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: "DB insert failed", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ sessionId: data!.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Unexpected", details: e?.message }, { status: 500 });
  }
}
