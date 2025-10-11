import { NextRequest, NextResponse } from "next/server";
import { STATE, COURSES } from "@/lib/demoData";

/**
 * Tipos locales (no dependemos de '@/lib/types')
 */
type ProgressTickInput = {
  courseSlug: string;
  moduleId: string;
  lessonId: string;
};

type ProgressTickResult = {
  ok: true;
  streakDays: number;
  progressPct: number;
};

// Estado local del endpoint (vive mientras el proceso esté en memoria)
const COMPLETED = new Set<string>(); // keys: `${courseSlug}:${moduleId}:${lessonId}`

export async function POST(req: NextRequest) {
  let body: ProgressTickInput | null = null;
  try {
    body = (await req.json()) as ProgressTickInput;
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (!body?.courseSlug || !body?.moduleId || !body?.lessonId) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    const course = COURSES.find((c) => c.slug === body!.courseSlug);
    if (!course) {
      return NextResponse.json({ ok: false, error: "course_not_found" }, { status: 404 });
    }

    // Marca completado en el set local
    const key = `${body.courseSlug}:${body.moduleId}:${body.lessonId}`;
    COMPLETED.add(key);

    // Recalcula progreso del curso
    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const completedForCourse = Array.from(COMPLETED).filter(
      (k: string) => k.startsWith(`${body!.courseSlug}:`)
    ).length;

    const progressPct =
      totalLessons > 0 ? Math.min(100, Math.round((completedForCourse / totalLessons) * 100)) : 0;

    // Actualiza mock global para que otras vistas lo lean
    STATE.courseProgressPct[body.courseSlug] = progressPct;
    STATE.streakDays = Math.max(1, (STATE.streakDays || 0) + 1);

    const result: ProgressTickResult = {
      ok: true,
      streakDays: STATE.streakDays,
      progressPct,
    };
    return NextResponse.json(result);
  } catch (e) {
    console.error("[/api/progress] error", e);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}
