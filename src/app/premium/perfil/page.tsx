"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";
import ProfileCard from "@/components/dashboard/Profile/ProfileCard";
import EditForm from "@/components/dashboard/Profile/EditForm";
import Billing from "@/components/dashboard/Profile/Billing";
import { getProfileKey } from "@/lib/profileKey";
import { PROFILE_STATE } from "@/lib/demoData";

export default function PerfilPage() {
  const [tab, setTab] = useState<"perfil" | "editar" | "billing">("perfil");
  const [p, setP] = useState<UserProfile>(PROFILE_STATE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const key = getProfileKey();
    fetch(`/api/profile?key=${encodeURIComponent(key)}`)
      .then((r) => r.json())
      .then((j) => (j?.ok && j.data ? setP(j.data) : setP(PROFILE_STATE)))
      .catch(() => setP(PROFILE_STATE))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          className={`px-3 py-1.5 rounded-md ${tab === "perfil" ? "bg-[var(--emerald)] text-black" : "border"} `}
          onClick={() => setTab("perfil")}
          aria-current={tab === "perfil" ? "page" : undefined}
        >
          Perfil
        </button>
        <button
          className={`px-3 py-1.5 rounded-md ${tab === "editar" ? "bg-[var(--emerald)] text-black" : "border"} `}
          onClick={() => setTab("editar")}
          aria-current={tab === "editar" ? "page" : undefined}
        >
          Editar perfil
        </button>
        <button
          className={`px-3 py-1.5 rounded-md ${tab === "billing" ? "bg-[var(--emerald)] text-black" : "border"} `}
          onClick={() => setTab("billing")}
          aria-current={tab === "billing" ? "page" : undefined}
        >
          Billing
        </button>
      </div>

      {/* Contenido segun tab */}
      {tab === "perfil" && (
        <section className="space-y-3">
          {loading && <div className="text-sm opacity-70">Cargando…</div>}
          <ProfileCard p={p} />
        </section>
      )}

      {tab === "editar" && (
        <section>
          <EditForm
            initial={p}
            onSaved={(np) => {
              setP(np);
              setTab("perfil");
            }}
          />
        </section>
      )}

      {tab === "billing" && (
        <section>
          <Billing />
        </section>
      )}
    </div>
  );
}
