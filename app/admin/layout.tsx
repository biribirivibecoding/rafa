import { getProfile } from "@/lib/data";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile(true);
  return <AdminShell siteName={profile?.name || "Linktree"}>{children}</AdminShell>;
}
