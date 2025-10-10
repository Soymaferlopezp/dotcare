"use client";
import { useEffect, useState } from "react";
import type { Course } from "@/lib/types";
import CoursePreview from "./Preview";
import Link from "next/link";

export default function CoursePreviewClient({ slug }: { slug: string }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErr(null);
    fetch(`/api/courses/${slug}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? "Error");
        return r.json();
      })
      .then((j) => setCourse(j.data))
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="rounded-xl border border-muted p-6 text-sm text-muted-foreground">Cargando…</div>;
  if (err || !course)
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-muted p-6 text-sm text-red-500">
          {err ?? "Curso no encontrado"}
        </div>
        <Link href="/premium/cursos" className="underline text-sm">← Volver al listado</Link>
      </div>
    );

  return <CoursePreview course={course} />;
}
