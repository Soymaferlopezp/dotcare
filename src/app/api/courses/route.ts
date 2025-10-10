import { NextResponse } from "next/server";
import { COURSES } from "@/lib/demoData";

export async function GET() {
  const list = COURSES.map(c => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    tagline: c.tagline,
    minutesTotal: c.minutesTotal,
    progressPct: c.progressPct ?? 0,
    modulesCount: c.modules.length,
  }));
  return NextResponse.json({ ok: true, data: list });
}
