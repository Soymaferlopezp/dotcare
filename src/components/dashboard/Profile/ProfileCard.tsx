"use client";
import type { UserProfile } from "@/lib/types";
import { AVATARS } from "@/lib/demoData";

export default function ProfileCard({ p }: { p: UserProfile }) {
  const tagToken =
    p.tag === "ADMIN" ? "var(--violet)" :
    p.tag === "NERD" ? "var(--cyan)" :
    p.tag === "DOTCARELOVER" ? "var(--emerald)" :
    "var(--magenta)";

  const avatar = p.avatar || AVATARS.default;
  const hasBio = !!p.bio && p.bio.trim().length > 0; // 👈 solo mostramos si el user la cambió

  return (
    <div
      className="rounded-2xl p-6"
      style={{ background: "var(--panel)", color: "var(--text)", border: `1px solid var(--border)` }}
    >
      <div className="flex items-start gap-5">
        <img
          src={avatar}
          alt={p.alias}
          className="w-16 h-16 rounded-full object-cover"
          onError={(e:any)=>{ e.currentTarget.src = AVATARS.default; }}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-lg font-semibold m-0">{p.alias}</h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `color-mix(in oklab, ${tagToken} 22%, transparent)` }}
            >
              {p.tag}
            </span>
          </div>

          {/* Bio solo si existe y no es placeholder */}
          {hasBio && <div className="text-sm opacity-80 mt-2">{p.bio}</div>}


        </div>
      </div>
    </div>
  );
}
