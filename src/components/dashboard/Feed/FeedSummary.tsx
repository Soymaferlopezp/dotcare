"use client";
import { useEffect, useState } from "react";
import type { FeedSummaryData, UserProfile } from "@/lib/types";
import { FEED_SUMMARY, BADGES, COURSES_PROGRESS, AVATARS, PROFILE_STATE } from "@/lib/demoData";
import { getProfileKey } from "@/lib/profileKey";

export default function FeedSummary() {
  const [p, setP] = useState<UserProfile>(PROFILE_STATE);
  const [loading, setLoading] = useState(true);

  // Un solo fetch: siempre enviamos la key (anon:<uuid> o 0x…)
  useEffect(() => {
    const key = getProfileKey();
    fetch(`/api/profile?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((j) => (j?.ok && j.data ? setP(j.data) : setP(PROFILE_STATE)))
      .catch(() => setP(PROFILE_STATE))
      .finally(() => setLoading(false));
  }, []);

  const tagToken =
    p.tag === "ADMIN" ? "var(--violet)" :
    p.tag === "NERD" ? "var(--cyan)" :
    p.tag === "DOTCARELOVER" ? "var(--emerald)" :
    "var(--magenta)";

  const avatar = p.avatar || AVATARS.default;

  const data: FeedSummaryData = {
    user: {
      id: "mary",
      name: p.alias,
      role: p.tag,
      admin: p.tag === "ADMIN",
      avatar,
    },
    addressShort: p.addressShort || "guest",
    badges: BADGES,
    streakDays: FEED_SUMMARY.streakDays,
    coursesInProgress: COURSES_PROGRESS,
  };

  return (
    <div className="space-y-4">
      {/* --- Perfil / Bienvenida --- */}
      <div className="rounded-2xl p-4" style={{ background: "var(--panel)", border: `1px solid var(--border)` }}>
        <div className="flex items-start gap-4">
          <img
            src={data.user.avatar || AVATARS.default}
            alt={data.user.name}
            className="w-14 h-14 rounded-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.currentTarget as HTMLImageElement).src = AVATARS.default;
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-semibold m-0">GM, {data.user.name}</h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: `color-mix(in oklab, ${tagToken} 22%, transparent)` }}
              >
                {p.tag}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* --- Badges --- */}
      <div className="rounded-2xl p-4" style={{ background: "var(--panel)", border: `1px solid var(--border)` }}>
        <h3 className="font-semibold mb-3">Badges</h3>
        <div className="flex flex-wrap gap-2">
          {data.badges.map((b) => (
            <span
              key={b.id}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `color-mix(in oklab, var(--emerald) 20%, transparent)` }}
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>

      {/* --- Cursos en progreso --- */}
      <div className="rounded-2xl p-4" style={{ background: "var(--panel)", border: `1px solid var(--border)` }}>
        <h3 className="font-semibold mb-3">Cursos en progreso</h3>
        {loading ? (
          <div className="text-sm opacity-70">Cargando…</div>
        ) : (
          <div className="space-y-2">
            {data.coursesInProgress.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg"
                style={{ background: "color-mix(in oklab, var(--emerald) 8%, transparent)" }}
              >
                <div className="text-sm">{c.title}</div>
                <div className="text-xs opacity-70">
                  {c.progress}% • {c.minutes} min
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Racha --- */}
      <div className="rounded-2xl p-4" style={{ background: "var(--panel)", border: `1px solid var(--border)` }}>
        <h3 className="font-semibold">Racha</h3>
        <p className="text-sm opacity-80">🔥 {data.streakDays} días seguidos</p>
      </div>
    </div>
  );
}
