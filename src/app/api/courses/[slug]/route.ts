import { NextRequest, NextResponse } from "next/server";
import { COURSES } from "@/lib/demoData";
import type { Course } from "@/lib/types";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const course = COURSES.find((c: Course) => c.slug === slug);
  if (!course) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true, data: course });
}
