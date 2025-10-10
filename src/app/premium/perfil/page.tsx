"use client";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/lib/types";
import ProfileCard from "@/components/dashboard/Profile/ProfileCard";
import EditForm from "@/components/dashboard/Profile/EditForm";
import Billing from "@/components/dashboard/Profile/Billing";
import { getProfileKey } from "@/lib/profileKey";

export default function PerfilPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tab, setTab] = useState<"edit" | "billing">("edit");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const key = getProfileKey();
      const r = await fetch(`/api/profile?key=${encodeURIComponent(key)}`);
      const j = await r.json();
      if (j?.ok && j.data) setProfile(j.data);
      else setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="text-sm opacity-70">Cargando…</div>;
  if (!profile) return <div className="text-sm opacity-70">No se pudo cargar el perfil.</div>;

  return (
    <div className="space-y-4">
      <ProfileCard p={profile} />

      <div className="flex items-center gap-2">
        <button onClick={()=>setTab("edit")} className={`nav-pill ${tab==="edit"?"is-active":""}`} style={{ color: "var(--text)" }}>
          Editar perfil
        </button>
        <button onClick={()=>setTab("billing")} className={`nav-pill ${tab==="billing"?"is-active":""}`} style={{ color: "var(--text)" }}>
          Billing
        </button>
      </div>

      {tab==="edit" && <EditForm initial={profile} onSaved={(p)=>setProfile(p)} />}
      {tab==="billing" && <Billing />}
    </div>
  );
}
