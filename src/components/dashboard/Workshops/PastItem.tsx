"use client";
import Link from "next/link";
import { Workshop } from "@/lib/types";

function dayMon(iso: string) {
  const d = new Date(iso);
  const day = d.getUTCDate();
  const month = d.toLocaleString("en-US", { month: "short", timeZone: "UTC" }).toLowerCase();
  return { day, month };
}

function line(iso: string, mode: string) {
  const d = new Date(iso);
  const weekday = d.toLocaleString("es-ES", { weekday: "short", timeZone: "UTC" });
  const time = d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false });
  return `${weekday} · ${time} UTC · ${mode}`;
}

export default function PastItem({ w }: { w: Workshop }) {
  const { day, month } = dayMon(w.startsAtISO);
  return (
    <li className="flex items-center gap-3 py-3 border-b border-muted/60">
      <div className="w-12 h-12 rounded-lg border border-muted flex flex-col items-center justify-center">
        <span className="text-base font-bold leading-none">{day}</span>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{month}</span>
      </div>
      <div className="flex-1">
        <Link href={w.recordingUrl ?? "#"} className="font-medium hover:underline">
          {w.title}
        </Link>
        <div className="text-xs text-muted-foreground">
          📅 {line(w.startsAtISO, w.mode)} · 📹 Live Stream
        </div>
      </div>
    </li>
  );
}
