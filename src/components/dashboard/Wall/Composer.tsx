"use client";
import { useState } from "react";
import { USERS } from "@/lib/demoData";
import type { PostScope } from "@/lib/types";

type Props = {
  scope: Extract<PostScope, "soporte" | "feedback">;
  defaultAuthorId?: "zula" | "mary" | "mafer";
};

export default function Composer({ scope, defaultAuthorId = "mary" }: Props) {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState<"zula" | "mary" | "mafer">(defaultAuthorId);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    if (!text.trim()) {
      setErr("Escribe un mensaje.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope, authorId, text, title }),
      });
      const j = await res.json();
      if (!j.ok) throw new Error(j.error || "Error");
      // Reset y notificación liviana
      setText("");
      setTitle("");
      window.dispatchEvent(new CustomEvent("posts:refresh", { detail: { scope } }));
    } catch (e: any) {
      setErr(e.message || "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-muted p-4 bg-card">
      <h4 className="font-semibold mb-3">Nuevo post</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          className="md:col-span-3 rounded-md border border-muted bg-background px-3 py-2 text-sm"
          placeholder="Título (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          className="rounded-md border border-muted bg-background px-3 py-2 text-sm"
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value as any)}
          aria-label="Autor"
        >
          <option value="mary">Mary (CEO)</option>
          <option value="zula">Zula (CFO)</option>
          <option value="mafer">Mafer (CTO)</option>
        </select>
      </div>
      <textarea
        className="mt-3 w-full min-h-[96px] rounded-md border border-muted bg-background px-3 py-2 text-sm"
        placeholder={scope === "soporte" ? "Describe tu caso o incidencia…" : "Deja tu feedback…"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {err && <p className="mt-2 text-xs text-red-500">{err}</p>}
      <div className="mt-3 flex justify-end">
        <button
          onClick={submit}
          disabled={loading}
          className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Publicando…" : "Publicar"}
        </button>
      </div>
    </div>
  );
}
