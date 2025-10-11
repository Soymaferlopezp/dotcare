// client-only
export function getProfileKey(): string {
  if (typeof window === "undefined") return "anon:server";
  const KEY = "dc_profile_key";
  let k = window.localStorage.getItem(KEY);
  if (!k) {
    // uuid estable por dispositivo sin usar `any`
    const c: Crypto | undefined = window.crypto;
    const uuid =
      c && "randomUUID" in c && typeof c.randomUUID === "function"
        ? c.randomUUID()
        : Math.random().toString(36).slice(2);
    k = `anon:${uuid}`;
    window.localStorage.setItem(KEY, k);
  }
  return k;
}
