"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Profile, LinkItem, SocialLinks } from "@/lib/types";
import { FONTS, SOCIAL_KEYS } from "@/lib/types";
import { LivePreview } from "./LivePreview";

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-zinc-200 p-0.5"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input flex-1"
        />
      </div>
    </label>
  );
}

const SOCIAL_LABELS: Record<keyof SocialLinks, string> = {
  instagram: "Instagram",
  whatsapp: "WhatsApp",
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  x: "X (Twitter)",
  email: "E-mail",
  website: "Website",
};

export function DesignEditor({
  initialProfile,
  links,
}: {
  initialProfile: Profile;
  links: LinkItem[];
}) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function setSocial(key: keyof SocialLinks, value: string) {
    setProfile((p) => ({ ...p, social_links: { ...p.social_links, [key]: value } }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-semibold md:text-2xl">Design</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          {/* Perfil */}
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Perfil
            </h2>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                Nome / Marca
              </span>
              <input
                className="input"
                value={profile.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Bio</span>
              <textarea
                className="input min-h-20"
                value={profile.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                URL do logo
              </span>
              <input
                className="input"
                placeholder="https://.../logo.png"
                value={profile.logo_url ?? ""}
                onChange={(e) => set("logo_url", e.target.value || null)}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                Rodape (opcional)
              </span>
              <input
                className="input"
                value={profile.footer}
                onChange={(e) => set("footer", e.target.value)}
              />
            </label>
          </section>

          {/* Cores do fundo */}
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Cores do fundo
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <ColorField
                label="Cor principal"
                value={profile.bg_color}
                onChange={(v) => set("bg_color", v)}
              />
              <ColorField
                label="Gradiente (fim)"
                value={profile.bg_gradient_end}
                onChange={(v) => set("bg_gradient_end", v)}
              />
            </div>
            <ColorField
              label="Cor do texto"
              value={profile.text_color}
              onChange={(v) => set("text_color", v)}
            />
          </section>

          {/* Botoes */}
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Botoes
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => set("button_style", "outline")}
                className={`flex-1 rounded-xl border py-3 text-sm font-medium ${
                  profile.button_style === "outline"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                Contorno
              </button>
              <button
                onClick={() => set("button_style", "fill")}
                className={`flex-1 rounded-xl border py-3 text-sm font-medium ${
                  profile.button_style === "fill"
                    ? "border-zinc-900 bg-zinc-900 text-white"
                    : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                }`}
              >
                Preenchido
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ColorField
                label="Cor da borda"
                value={profile.button_border_color}
                onChange={(v) => set("button_border_color", v)}
              />
              {profile.button_style === "fill" ? (
                <ColorField
                  label="Cor de preenchimento"
                  value={profile.button_fill_color}
                  onChange={(v) => set("button_fill_color", v)}
                />
              ) : null}
            </div>
            {profile.button_style === "fill" ? (
              <ColorField
                label="Cor do texto do botao"
                value={profile.button_text_color}
                onChange={(v) => set("button_text_color", v)}
              />
            ) : (
              <p className="text-xs text-zinc-500">
                Botoes contornados usam a <strong>Cor do texto</strong> acima. Mude para
                &quot;Preenchido&quot; para customizar o texto do botao separadamente.
              </p>
            )}
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                Arredondamento: {profile.button_radius}px
              </span>
              <input
                type="range"
                min={0}
                max={40}
                value={profile.button_radius}
                onChange={(e) => set("button_radius", Number(e.target.value))}
                className="w-full"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={profile.button_shadow}
                onChange={(e) => set("button_shadow", e.target.checked)}
              />
              Sombra nos botoes
            </label>
          </section>

          {/* Tipografia & Layout */}
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Tipografia &amp; Layout
            </h2>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">Fonte</span>
              <select
                className="input"
                value={profile.font}
                onChange={(e) => set("font", e.target.value)}
              >
                {FONTS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                Posicao das redes sociais
              </span>
              <select
                className="input"
                value={profile.social_position}
                onChange={(e) => set("social_position", e.target.value as Profile["social_position"])}
              >
                <option value="top">Topo (abaixo do nome)</option>
                <option value="bottom">Rodape (abaixo dos links)</option>
              </select>
            </label>
          </section>

          {/* Redes sociais */}
          <section className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Redes sociais
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {SOCIAL_KEYS.map((key) => (
                <label key={key} className="block">
                  <span className="mb-1.5 block text-sm font-medium text-zinc-700">
                    {SOCIAL_LABELS[key]}
                  </span>
                  <input
                    className="input"
                    placeholder={key === "email" ? "voce@email.com" : "https://..."}
                    value={profile.social_links[key] ?? ""}
                    onChange={(e) => setSocial(key, e.target.value)}
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Preview */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <p className="mb-3 px-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Preview ao vivo
            </p>
            <div
              className="mx-auto overflow-hidden rounded-[36px] border-8 border-zinc-900 bg-black shadow-2xl"
              style={{ width: 300, height: 600 }}
            >
              <LivePreview profile={profile} links={links} />
            </div>
          </div>
        </aside>
      </div>

      {/* Botao salvar */}
      <div className="sticky bottom-4 z-10 md:bottom-6">
        <button
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-900 py-4 font-semibold text-white shadow-lg transition hover:bg-zinc-800 disabled:opacity-50"
        >
          {saved ? (
            <>
              <Check className="h-5 w-5" /> Salvo!
            </>
          ) : saving ? (
            "Salvando..."
          ) : (
            "Salvar alteracoes"
          )}
        </button>
      </div>
    </div>
  );
}
