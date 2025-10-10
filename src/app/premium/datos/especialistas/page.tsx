"use client";
import { useState, useEffect, useRef } from "react";
import { SPECIALISTS } from "@/lib/demoData";

type Specialist = (typeof SPECIALISTS)[number];

function SimpleModal({
  open,
  title,
  cta,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  cta?: { label: string; href: string } | null;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const last = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    last.current = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const el = dialogRef.current;
        const list = el?.querySelectorAll<HTMLElement>(
          "a,button,textarea,input,select,[tabindex]:not([tabindex='-1'])"
        );
        if (!el || !list || list.length === 0) return;
        const first = list[0];
        const lastEl = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      last.current?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-[101] w-full max-w-2xl rounded-2xl border border-muted bg-card p-5 shadow-xl outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm hover:bg-muted" aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="mt-3 text-sm leading-relaxed">{children}</div>
        {cta && (
          <div className="mt-5 flex justify-end">
            <a href={cta.href} className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
              {cta.label}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SpecialistsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const current: Specialist | null = SPECIALISTS.find((s) => s.id === openId) ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Especialistas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {SPECIALISTS.map((s: Specialist) => (
          <button
            key={s.id}
            onClick={() => setOpenId(s.id)}
            className="text-left rounded-2xl border border-muted hover:bg-muted/40 transition overflow-hidden"
          >
            <div className="relative w-full h-40 bg-muted grid place-items-center">
              <img
                src={s.image}
                alt=""
                className="w-full h-40 object-cover"
                onError={(e) => {
                  (e as React.SyntheticEvent<HTMLImageElement>).currentTarget.style.display = "none";
                }}
              />
              <span className="absolute text-4xl" aria-hidden>
                👩‍⚕️
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold">{s.name}</h3>
              <p className="text-xs text-muted-foreground">{s.specialty}</p>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.excerpt}</p>
            </div>
          </button>
        ))}
      </div>

      <SimpleModal
        open={!!current}
        title={current ? `${current.name} — ${current.specialty}` : ""}
        cta={current?.contact ?? null}
        onClose={() => setOpenId(null)}
      >
        <p className="whitespace-pre-wrap">{current?.body}</p>
      </SimpleModal>
    </div>
  );
}
