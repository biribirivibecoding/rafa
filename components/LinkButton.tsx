"use client";

import type { Profile, LinkItem } from "@/lib/types";

export function LinkButton({
  link,
  profile,
}: {
  link: LinkItem;
  profile: Profile;
}) {
  const isFill = profile.button_style === "fill";

  const style: React.CSSProperties = {
    borderRadius: profile.button_radius,
    borderColor: profile.button_border_color,
    borderWidth: 2,
    borderStyle: "solid",
    backgroundColor: isFill ? profile.button_fill_color : "transparent",
    color: isFill ? profile.button_text_color : profile.text_color,
    boxShadow: profile.button_shadow ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
  };

  function handleClick() {
    // fire-and-forget; nao bloqueia a navegacao
    navigator.sendBeacon?.(
      "/api/track",
      new Blob([JSON.stringify({ id: link.id })], { type: "application/json" })
    );
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={style}
      className="block w-full px-5 py-4 text-center transition hover:scale-[1.02] active:scale-[0.99]"
    >
      <span className="block text-base font-semibold leading-tight">{link.title}</span>
      {link.subtitle ? (
        <span className="mt-0.5 block text-xs opacity-80">{link.subtitle}</span>
      ) : null}
    </a>
  );
}
