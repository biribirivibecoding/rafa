"use client";

import { usePathname } from "next/navigation";
import { Sidebar, BottomNav } from "./AdminNav";

export function AdminShell({
  siteName,
  children,
}: {
  siteName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login nao usa o layout com sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <Sidebar siteName={siteName} />
        <div className="flex min-w-0 flex-col">
          <main className="mx-auto w-full max-w-5xl flex-1 p-4 pb-24 md:p-8 md:pb-8">
            {children}
          </main>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
