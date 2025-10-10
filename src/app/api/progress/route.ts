import { NextRequest, NextResponse } from "next/server";
import { STATE, COURSES } from "@/lib/demoData";
import type { ProgressTickInput, ProgressTickResult } from "@/lib/types";

/**
 * Mock: marca una lección como completada y aumenta:
 * - streakDays (+1, tope 365) si completed=true
 * - progressPct del curso (suma proporcional por # lessons totales)
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as Partial<ProgressTickInput>;
  const { courseSlug, moduleId, lessonId, completed } = body;

  // Validación estricta para evitar indexar con undefined
  if (typeof courseSlug !== "string" || !courseSlug.trim()) {
    return NextResponse.json({ ok: false, error: "missing_course_slug" }, { status: 400 });
  }
  const slug = courseSlug.trim();

  const course = COURSES.find((c) => c.slug === slug);
  if (!course) {
    return NextResponse.json({ ok: false, error: "course_not_found" }, { status: 404 });
  }

  // progreso proporcional a #lessons del curso
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const step = totalLessons > 0 ? 100 / totalLessons : 0;

  // Simulación: sólo suma si completed=true (no persistimos per-lesson en este mock)
  if (completed) {
    const current = STATE.courseProgressPct[slug] ?? 0;
    STATE.courseProgressPct[slug] = Math.min(100, current + step);
    STATE.streakDays = Math.min(365, STATE.streakDays + 1);
  }

  const payload: ProgressTickResult = {
    ok: true,
    streakDays: STATE.streakDays,
    courseSlug: slug,
    progressPct: STATE.courseProgressPct[slug],
  };
  return NextResponse.json(payload);
}
