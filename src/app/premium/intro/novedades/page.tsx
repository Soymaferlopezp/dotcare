"use client";
import { useEffect, useState } from "react";
import PostCard from "@/components/dashboard/Wall/Post";

function usePosts(scope: string) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = () => {
    setLoading(true);
    fetch(`/api/posts?scope=${scope}`)
      .then((r) => r.json())
      .then((j) => setItems(j.data ?? []))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load();
    const handler = (e: any) => { if (e?.detail?.scope === scope) load(); };
    window.addEventListener("posts:refresh", handler as any);
    return () => window.removeEventListener("posts:refresh", handler as any);
  }, [scope]);
  return { items, loading };
}

export default function NovedadesPage() {
  const { items, loading } = usePosts("novedades");
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Novedades</h1>
      {loading && <div className="rounded-xl border border-muted p-6 text-sm text-muted-foreground">Cargando…</div>}
      {!loading && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-muted p-8 text-center text-sm text-muted-foreground">
          Todavía no hay novedades.
        </div>
      )}
      {items.map((p) => <PostCard key={p.id} post={p} />)}
    </div>
  );
}
