"use client";
import { useEffect, useState } from "react";
import CoursesList from "@/components/dashboard/Courses/List";

export default function CoursesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((j) => setItems(j.data ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Cursos & Guías</h1>

      {loading && (
        <div className="rounded-xl border border-muted p-6 text-sm text-muted-foreground">Cargando…</div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-muted p-8 text-center text-sm text-muted-foreground">
          Aún no hay cursos publicados.
        </div>
      )}

      {!loading && items.length > 0 && <CoursesList items={items} />}
    </div>
  );
}
