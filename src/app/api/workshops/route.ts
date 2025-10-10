import { NextRequest, NextResponse } from "next/server";
import { WORKSHOPS_UPCOMING, WORKSHOPS_PAST } from "@/lib/demoData";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filter = (searchParams.get("filter") || "upcoming").toLowerCase();

  if (filter === "past") {
    return NextResponse.json({ ok: true, data: WORKSHOPS_PAST });
  }
  if (filter === "upcoming") {
    return NextResponse.json({ ok: true, data: WORKSHOPS_UPCOMING });
  }
  return NextResponse.json(
    { ok: true, data: [...WORKSHOPS_UPCOMING, ...WORKSHOPS_PAST] },
    { status: 200 }
  );
}
