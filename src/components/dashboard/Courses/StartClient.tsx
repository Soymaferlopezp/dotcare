"use client";
import { useState } from "react";
import type { Course, Module } from "@/lib/types";

/** Tipos locales para el endpoint de progreso */
type ProgressTickInput = { courseSlug: string; moduleId: string; lessonId: string };
type ProgressTickResult = { ok: true; streakDays: number; progressPct: number };

/** ----- IndexTree (interno) ----- */
function IndexTree({
  modules,
  active,
  onSelect,
}: {
  modules: Module[];
  active: { moduleId: string; lessonId: string } | null;
  onSelect: (mId: string, lId: string) => void;
}) {
  return (
    <nav className="space-y-3">
      {modules.map((m, i) => (
        <div key={m.id} className="rounded-xl border border-muted">
          <div className="px-3 py-2 font-semibold bg-muted/40 rounded-t-xl">
            M{i + 1}. {m.title}
          </div>
          <ul className="p-2 space-y-1">
            {m.lessons.map((l, j) => {
              const isActive = active?.moduleId === m.id && active?.lessonId === l.id;
              return (
                <li key={l.id}>
                  <button
                    onClick={() => onSelect(m.id, l.id)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg text-sm ${
                      isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                    }`}
                  >
                    S{j + 1}. {l.title}
                    <span className="ml-2 text-xs text-muted-foreground">• {l.minutes} min</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/** ----- PlayerLayout (interno) ----- */
function PlayerLayout({
  course,
  onComplete,
  progressPct = 0,
}: {
  course: Course;
  onComplete: (ctx: { moduleId: string; lessonId: string }) => Promise<void>;
  progressPct?: number;
}) {
  const [active, setActive] = useState(() => {
    const m = course.modules[0];
    const l = m?.lessons?.[0];
    return m && l ? { moduleId: m.id, lessonId: l.id } : null;
  });
  const [completing, setCompleting] = useState(false);
  const [progress, setProgress] = useState(progressPct);

  const activeLesson = (() => {
    if (!active) return null;
    const m = course.modules.find((x) => x.id === active.moduleId);
    const l = m?.lessons.find((x) => x.id === active.lessonId);
    return { m, l };
  })();

  // Mantener sincronizado el estado interno con prop externa
  if (progress !== progressPct) setProgress(progressPct);

  async function markComplete() {
    if (!active) return;
    setCompleting(true);
    try {
      await onComplete({ moduleId: active.moduleId, lessonId: active.lessonId });
    } finally {
      setCompleting(false);
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[320px_1fr] gap-6">
      <aside>
        <IndexTree
          modules={course.modules}
          active={active}
          onSelect={(mId, lId) => setActive({ moduleId: mId, lessonId: lId })}
        />
      </aside>

      <section className="space-y-4">
        <header className="rounded-2xl border border-muted p-4 bg-card">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold leading-tight">{course.title}</h2>
            <div className="text-sm text-muted-foreground">
              Progreso: <span className="font-medium">{Math.round(progress)}%</span>
            </div>
          </div>
        </header>

        <div className="rounded-2xl border border-muted overflow-hidden bg-black/60 aspect-video grid place-items-center">
          <div className="text-center text-white/80 p-6">
            <div className="text-5xl mb-2">🎬</div>
            <p className="text-sm">Player placeholder — integraremos video/imagen aquí.</p>
          </div>
        </div>

        <article className="rounded-2xl border border-muted p-4 bg-card">
          <h3 className="font-semibold mb-1">
            {activeLesson?.l?.title || "Selecciona una lección"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {activeLesson?.m ? `Módulo: ${activeLesson.m.title}` : "Selecciona en el índice de la izquierda."}
          </p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={markComplete}
              disabled={!active || completing}
              className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-60"
            >
              {completing ? "Marcando…" : "Marcar como completado"}
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

/** ----- StartClient (export único) ----- */
export default function StartClient({ course }: { course: Course }) {
  const [progressPct, setProgressPct] = useState(course.progressPct ?? 0);

  async function onComplete({ moduleId, lessonId }: { moduleId: string; lessonId: string }) {
    const payload: ProgressTickInput = { courseSlug: course.slug, moduleId, lessonId };
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const j: ProgressTickResult = await res.json();
    if (j?.ok) {
      setProgressPct(j.progressPct);
    }
  }

  return <PlayerLayout course={course} onComplete={onComplete} progressPct={progressPct} />;
}
