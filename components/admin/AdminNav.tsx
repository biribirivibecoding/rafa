"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Link2, Palette, BarChart3, ExternalLink, LogOut } from "lucide-react";

const ITEMS = [
  { href: "/admin/links", label: "Links", icon: Link2 },
  { href: "/admin/design", label: "Design", icon: Palette },
  { href: "/admin/insights", label: "Insights", icon: BarChart3 },
];

export function Sidebar({ siteName }: { siteName: string }) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen flex-col border-r border-zinc-200 bg-white md:flex">
      <div className="flex items-center gap-3 border-b border-zinc-100 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 font-bold text-white">
          {siteName.charAt(0).toUpperCase()}
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">{siteName}</p>
          <p className="text-xs text-zinc-500">painel admin</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="flex flex-col gap-1 border-t border-zinc-100 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
        >
          <ExternalLink className="h-4 w-4" />
          Ver pagina publica
        </a>
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white md:hidden">
      <ul className="flex">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium ${
                  active ? "text-zinc-900" : "text-zinc-500"
                }`}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
