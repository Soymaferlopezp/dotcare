"use client";
import { useState } from "react";
import Link from "next/link";
import ProgressBar from "./ProgressBar";
import type { Course } from "@/lib/types";
import { FEED_SUMMARY } from "@/lib/demoData";

export default function CoursePreview({ course }: { course: Course }) {
  const [open, setOpen] = useState(true);
  const addr = FEED_SUMMARY.addressShort;

  const modulesCount = course.modules.length;
  const totalMin = course.minutesTotal;
  const progress = course.progressPct ?? 0;

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-muted p-4 bg-card">
        <h1 className="text-xl font-semibold">{course.title}</h1>
        {course.tagline && <p className="text-sm text-muted-foreground mt-1">{course.tagline}</p>}
        <p className="text-sm mt-2">GM, <span className="font-mono">{addr}</span> 👋</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href={`/premium/cursos/${course.slug}/start`}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90"
          >
            Start | LFG
          </Link>
          <div className="text-sm text-muted-foreground">
            {modulesCount} módulos • {totalMin} min
          </div>
        </div>
      </header>

      <section className="rounded-2xl border border-muted p-4 bg-card">
        <h3 className="font-semibold">Progreso</h3>
        <div className="mt-2 flex items-center gap-2">
          <ProgressBar value={progress} />
          <span className="text-xs w-10 text-right">{Math.round(progress)}%</span>
        </div>
      </section>

      <section className="rounded-2xl border border-muted p-4 bg-card">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Contenido</h3>
          <button
            onClick={() => setOpen((v) => !v)}
            className="text-sm underline"
            aria-expanded={open}
          >
            {open ? "Collapse" : "Expand"}
          </button>
        </div>

        {open && (
          <ol className="mt-3 space-y-4">
            {course.modules.map((m, i) => (
              <li key={m.id} className="rounded-xl border border-muted p-3">
                <div className="font-medium">M{i + 1}. {m.title}</div>
                <ul className="mt-2 list-disc pl-5 text-sm space-y-1">
                  {m.lessons.map((l, j) => (
                    <li key={l.id} className="flex items-center justify-between">
                      <span>S{j + 1}. {l.title}</span>
                      <span className="text-xs text-muted-foreground">{l.minutes} min</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
