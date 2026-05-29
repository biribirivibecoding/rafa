import { getProfile, getLinks } from "@/lib/data";
import { createAdminClient } from "@/lib/supabase/server";
import { MousePointerClick, TrendingUp, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

type Stat = { id: string; title: string; total: number; d7: number; d30: number; today: number };

export default async function InsightsPage() {
  const profile = await getProfile(true);
  if (!profile) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
        Configure o Supabase primeiro.
      </div>
    );
  }

  const links = await getLinks(profile.id, { admin: true });
  const supabase = createAdminClient();

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const linkIds = links.map((l) => l.id);

  let events: { link_id: string; created_at: string }[] = [];
  if (linkIds.length > 0) {
    const { data } = await supabase
      .from("click_events")
      .select("link_id, created_at")
      .in("link_id", linkIds)
      .gte("created_at", since);
    events = data ?? [];
  }

  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const t7 = now - 7 * 24 * 60 * 60 * 1000;

  const stats: Stat[] = links.map((l) => {
    const evs = events.filter((e) => e.link_id === l.id);
    return {
      id: l.id,
      title: l.title,
      total: l.click_count,
      d30: evs.length,
      d7: evs.filter((e) => new Date(e.created_at).getTime() >= t7).length,
      today: evs.filter((e) => new Date(e.created_at) >= startOfToday).length,
    };
  });

  const totalAll = stats.reduce((s, x) => s + x.total, 0);
  const total7 = stats.reduce((s, x) => s + x.d7, 0);
  const totalToday = stats.reduce((s, x) => s + x.today, 0);
  const max = Math.max(1, ...stats.map((s) => s.total));
  const ranked = [...stats].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold md:text-2xl">Insights</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard icon={<MousePointerClick className="h-5 w-5" />} label="Cliques (total)" value={totalAll} />
        <KpiCard icon={<TrendingUp className="h-5 w-5" />} label="Ultimos 7 dias" value={total7} />
        <KpiCard icon={<Calendar className="h-5 w-5" />} label="Hoje" value={totalToday} />
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Cliques por link
        </h2>
        {ranked.length === 0 ? (
          <p className="text-sm text-zinc-500">Nenhum link ainda.</p>
        ) : (
          <div className="space-y-4">
            {ranked.map((s) => (
              <div key={s.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-800">{s.title || "(sem titulo)"}</span>
                  <span className="text-zinc-500">
                    {s.total} <span className="text-zinc-400">total</span>
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                    style={{ width: `${(s.total / max) * 100}%` }}
                  />
                </div>
                <div className="mt-1 flex gap-4 text-xs text-zinc-400">
                  <span>Hoje: {s.today}</span>
                  <span>7d: {s.d7}</span>
                  <span>30d: {s.d30}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center gap-2 text-zinc-400">{icon}</div>
      <p className="mt-2 text-3xl font-bold text-zinc-900">{value}</p>
      <p className="text-sm text-zinc-500">{label}</p>
    </div>
  );
}
