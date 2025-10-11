"use client";
import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import { AVATARS } from "@/lib/demoData";
import { supabase } from "@/lib/supabase";
import { getProfileKey } from "@/lib/profileKey";

type Props = { initial: UserProfile; onSaved?: (p: UserProfile) => void };

// Resize a 300x300 JPG (~0.7 calidad) para ahorrar cuota
async function resizeImage(file: File, size = 300): Promise<Blob> {
  const img = document.createElement("img");
  const url = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const minSide = Math.min(img.width, img.height);
  const sx = (img.width - minSide) / 2;
  const sy = (img.height - minSide) / 2;
  ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, size, size);
  return await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.7));
}

export default function EditForm({ initial, onSaved }: Props) {
  // arrancamos vacíos para que se vean los placeholders
  const [alias, setAlias] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [xUrl, setXUrl] = useState<string>("");
  const [avatar, setAvatar] = useState<string>(initial.avatar || AVATARS.default);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setAvatar(url); // preview local
  }

  async function uploadAvatar(): Promise<string | null> {
    if (!file) return null;
    const blob = await resizeImage(file, 300);
    const ext = "jpg";
    const key = getProfileKey(); // "anon:<uuid>" o "0x..."
    const path = `${key}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("avatars").upload(path, blob, {
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) {
      console.error("[upload avatar]", error);
      return null;
    }
    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(data.path);
    return pub.publicUrl || null;
  }

  async function save() {
    setSaving(true);
    try {
      let avatarUrl: string | null = null;
      if (file) {
        avatarUrl = await uploadAvatar();
        if (avatarUrl) setAvatar(avatarUrl);
      }

      const body: Partial<UserProfile> = {};
      if (alias.trim()) body.alias = alias.trim();
      if (bio.trim()) body.bio = bio.trim();
      if (xUrl.trim()) body.xUrl = xUrl.trim();
      if (avatarUrl) body.avatar = avatarUrl;

      const key = getProfileKey();
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-profile-key": key },
        body: JSON.stringify(body),
      });
      const j = await res.json();
      if (j?.ok && onSaved) onSaved(j.data);
    } finally {
      setSaving(false);
    }
  }

  function cancel() {
    setAlias("");
    setBio("");
    setXUrl("");
    setAvatar(initial.avatar || AVATARS.default);
    setFile(null);
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{ background: "var(--panel)", border: `1px solid var(--border)` }}
    >
      {/* PFP */}
      <div className="grid sm:grid-cols-[160px_1fr] gap-4 items-center">
        <div>
          <div className="text-sm font-medium">PFP</div>
          <div className="text-xs opacity-70">Tamaño recomendado 300×300</div>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={avatar || AVATARS.default}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border"
            style={{ borderColor: "var(--border)" }}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              (e.currentTarget as HTMLImageElement).src = AVATARS.default;
            }}
          />
          <label
            className="px-3 py-1.5 rounded-md cursor-pointer"
            style={{ background: "var(--emerald)", color: "#0A0D0A" }}
          >
            Sube tu avatar
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
        </div>
      </div>

      {/* Seudónimo */}
      <div>
        <label className="text-sm font-medium">Seudónimo</label>
        <input
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
          placeholder="Satoshi Nakamoto"
          className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm font-medium">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Una bio corta sobre ti, tus intereses y lo que te hace especial."
          className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border min-h-[110px]"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      {/* X (Twitter) */}
      <div>
        <label className="text-sm font-medium">X (Twitter)</label>
        <input
          value={xUrl}
          onChange={(e) => setXUrl(e.target.value)}
          placeholder="https://x.com/gavofyork"
          className="mt-1 w-full rounded-md px-3 py-2 bg-transparent border"
          style={{ borderColor: "var(--border)", color: "var(--text)" }}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          className="px-3 py-1.5 rounded-md border"
          style={{ borderColor: "var(--border)" }}
          onClick={cancel}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="px-3 py-1.5 rounded-md"
          disabled={saving}
          onClick={save}
          style={{ background: "var(--emerald)", color: "#0A0D0A", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
      </div>
    </div>
  );
}
