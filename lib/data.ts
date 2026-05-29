import { createPublicClient, createAdminClient } from "@/lib/supabase/server";
import type { Profile, LinkItem } from "@/lib/types";

/** Perfil unico do dono. Usa admin client p/ garantir leitura mesmo sem RLS configurado. */
export async function getProfile(admin = false): Promise<Profile | null> {
  const supabase = admin ? createAdminClient() : createPublicClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return (data as Profile) ?? null;
}

/** Links ordenados. activeOnly=true filtra so os ativos (pagina publica). */
export async function getLinks(
  profileId: string,
  opts: { activeOnly?: boolean; admin?: boolean } = {}
): Promise<LinkItem[]> {
  const supabase = opts.admin ? createAdminClient() : createPublicClient();
  let query = supabase
    .from("links")
    .select("*")
    .eq("profile_id", profileId)
    .order("position", { ascending: true });
  if (opts.activeOnly) query = query.eq("active", true);
  const { data } = await query;
  return (data as LinkItem[]) ?? [];
}
