"use client";
export default function ProgressBar({ value }: { value: number }) {
  const v = Math.min(Math.max(value ?? 0, 0), 100);
  return (
    <div className="w-full h-2 rounded-full bg-muted">
      <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${v}%` }} />
    </div>
  );
}
