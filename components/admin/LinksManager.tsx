"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
  GripVertical,
  Save,
} from "lucide-react";
import type { LinkItem } from "@/lib/types";

export function LinksManager({
  initialLinks,
  profileId,
}: {
  initialLinks: LinkItem[];
  profileId: string;
}) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function patchLocal(id: string, patch: Partial<LinkItem>) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  async function saveLink(link: LinkItem) {
    setSavingId(link.id);
    await fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: link.title,
        url: link.url,
        subtitle: link.subtitle,
        active: link.active,
      }),
    });
    setSavingId(null);
  }

  async function toggleActive(link: LinkItem) {
    const next = !link.active;
    patchLocal(link.id, { active: next });
    await fetch(`/api/links/${link.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    });
  }

  async function addLink() {
    setBusy(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile_id: profileId, title: "Novo link", url: "" }),
    });
    const data = await res.json();
    if (data.ok) setLinks((prev) => [...prev, data.link]);
    setBusy(false);
  }

  async function removeLink(id: string) {
    if (!confirm("Excluir este link?")) return;
    setLinks((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/links/${id}`, { method: "DELETE" });
  }

  async function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[index], next[target]] = [next[target], next[index]];
    setLinks(next);
    await fetch("/api/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((l) => l.id) }),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Links</h1>
        <button
          onClick={addLink}
          disabled={busy}
          className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Adicionar link
        </button>
      </div>

      {links.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center text-sm text-zinc-500">
          Nenhum link ainda. Clique em <strong>Adicionar link</strong>.
        </p>
      ) : (
        <div className="space-y-3">
          {links.map((link, i) => (
            <div
              key={link.id}
              className={`rounded-2xl border bg-white p-4 transition ${
                link.active ? "border-zinc-200" : "border-zinc-200 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center pt-1 text-zinc-300">
                  <GripVertical className="h-4 w-4" />
                </div>

                <div className="flex-1 space-y-2">
                  <input
                    className="input font-medium"
                    value={link.title}
                    placeholder="Titulo"
                    onChange={(e) => patchLocal(link.id, { title: e.target.value })}
                  />
                  <input
                    className="input"
                    value={link.url}
                    placeholder="https://..."
                    onChange={(e) => patchLocal(link.id, { url: e.target.value })}
                  />
                  <input
                    className="input"
                    value={link.subtitle ?? ""}
                    placeholder="Subtitulo (opcional)"
                    onChange={(e) => patchLocal(link.id, { subtitle: e.target.value })}
                  />
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      onClick={() => saveLink(link)}
                      className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
                    >
                      <Save className="h-3.5 w-3.5" />
                      {savingId === link.id ? "Salvando..." : "Salvar"}
                    </button>
                    <button
                      onClick={() => toggleActive(link)}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900"
                    >
                      {link.active ? (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Visivel
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Oculto
                        </>
                      )}
                    </button>
                    <span className="ml-auto text-xs text-zinc-400">
                      {link.click_count} cliques
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === links.length - 1}
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => removeLink(link.id)}
                    className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
