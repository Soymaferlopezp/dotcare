// client-only
export function getProfileKey(): string {
  if (typeof window === "undefined") return "anon:server";
  const KEY = "dc_profile_key";
  let k = localStorage.getItem(KEY);
  if (!k) {
    // uuid estable por dispositivo
    const uuid = (crypto as any)?.randomUUID?.() || Math.random().toString(36).slice(2);
    k = `anon:${uuid}`;
    localStorage.setItem(KEY, k);
  }
  return k;
}
