import { getProfile, getLinks } from "@/lib/data";
import { LinksManager } from "@/components/admin/LinksManager";

export const dynamic = "force-dynamic";

export default async function LinksPage() {
  const profile = await getProfile(true);
  if (!profile) {
    return <SetupNotice />;
  }
  const links = await getLinks(profile.id, { admin: true });
  return <LinksManager initialLinks={links} profileId={profile.id} />;
}

function SetupNotice() {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
      <p className="font-semibold text-zinc-700">Configuracao pendente</p>
      <p className="mt-2">
        Defina as variaveis do Supabase em <code>.env.local</code> e rode o
        SQL em <code>supabase/schema.sql</code>.
      </p>
    </div>
  );
}
