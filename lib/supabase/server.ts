import { createClient } from "@supabase/supabase-js";

// O Next.js cacheia o fetch global; forcamos no-store para que edicoes
// no admin aparecam imediatamente na pagina publica.
const noStoreFetch: typeof fetch = (input, init) =>
  fetch(input, { ...init, cache: "no-store" });

/** Cliente de leitura publica (anon key). Respeita RLS. */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false }, global: { fetch: noStoreFetch } }
  );
}

/** Cliente admin (service_role). Bypassa RLS — use SOMENTE no servidor. */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false }, global: { fetch: noStoreFetch } }
  );
}
