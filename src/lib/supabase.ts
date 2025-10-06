"use client";

import { createClient } from "@supabase/supabase-js";

/** Variables expuestas al cliente (Next exige NEXT_PUBLIC_*) */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Creamos el cliente aunque esté vacío; avisamos por consola en dev */
if (!url || !anonKey) {
  console.warn(
    "[supabase] Falta NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(url, anonKey);
