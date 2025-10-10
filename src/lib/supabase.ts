import { createClient } from "@supabase/supabase-js";

// En cliente deben ser NEXT_PUBLIC_*. En server aceptamos ambas por compatibilidad.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.SUPABASE_URL;

const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Mensaje claro en runtime si faltan envs
  throw new Error(
    "[Supabase] Falta configuración. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY (o las variantes sin prefijo en el server)."
  );
}

// Cliente público (sin sesión persistente)
export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
