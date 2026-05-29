import { getProfile, getLinks } from "@/lib/data";
import { DesignEditor } from "@/components/admin/DesignEditor";

export const dynamic = "force-dynamic";

export default async function DesignPage() {
  const profile = await getProfile(true);
  if (!profile) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
        Configure o Supabase e rode <code>supabase/schema.sql</code> primeiro.
      </div>
    );
  }
  const links = await getLinks(profile.id, { activeOnly: true, admin: true });
  return <DesignEditor initialProfile={profile} links={links} />;
}
