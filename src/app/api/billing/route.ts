import { NextResponse } from "next/server";
import { SUBSCRIPTION, INVOICES } from "@/lib/demoData";

export async function GET() {
  return NextResponse.json({ ok: true, subscription: SUBSCRIPTION, history: INVOICES });
}
