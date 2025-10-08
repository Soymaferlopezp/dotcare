import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { zConfirmOffchainBody } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parse = zConfirmOffchainBody.safeParse(json);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid body", issues: parse.error.issues }, { status: 400 });
    }

    const { sessionId } = parse.data;

    // Verificar que exista y que no esté ya confirmada
    const { data: session, error: sErr } = await supabase
      .from("checkout_sessions")
      .select("id, status, paid_offchain")
      .eq("id", sessionId)
      .single();

    if (sErr || !session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (["ready_for_chain", "onchain_success", "active"].includes(session.status) || session.paid_offchain) {
      return NextResponse.json({ error: "Session already confirmed" }, { status: 409 });
    }

    const { error: uErr } = await supabase
      .from("checkout_sessions")
      .update({
        paid_offchain: true,
        status: "ready_for_chain",
      })
      .eq("id", sessionId);

    if (uErr) {
      return NextResponse.json({ error: "Update failed", details: uErr.message }, { status: 500 });
    }

    return NextResponse.json({ sessionId, status: "ready_for_chain", paid_offchain: true });
  } catch (e: any) {
    return NextResponse.json({ error: "Unexpected", details: e?.message }, { status: 500 });
  }
}
