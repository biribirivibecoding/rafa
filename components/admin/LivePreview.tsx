"use client";

import type { Profile, LinkItem } from "@/lib/types";
import { SocialIcons } from "@/components/SocialIcons";
import { backgroundStyle } from "@/lib/appearance";

export function LivePreview({
  profile,
  links,
}: {
  profile: Profile;
  links: LinkItem[];
}) {
  const isFill = profile.button_style === "fill";

  const social = <SocialIcons links={profile.social_links} color={profile.text_color} />;

  return (
    <div
      className="flex h-full flex-col items-center overflow-y-auto px-5 py-8"
      style={{
        ...backgroundStyle(profile),
        color: profile.text_color,
        fontFamily: `'${profile.font}', system-ui, sans-serif`,
      }}
    >
      {profile.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={profile.logo_url}
          alt=""
          className="mb-3 h-20 w-20 rounded-full object-cover shadow-lg"
        />
      ) : null}
      <p className="text-center text-lg font-bold">{profile.name}</p>
      {profile.bio ? (
        <p className="mt-1.5 text-center text-xs opacity-90">{profile.bio}</p>
      ) : null}

      {profile.social_position === "top" ? <div className="mt-4">{social}</div> : null}

      <div className="mt-5 flex w-full flex-col gap-2.5">
        {links.map((link) => (
          <div
            key={link.id}
            className="relative px-4 py-3 text-center"
            style={{
              borderRadius: profile.button_radius,
              borderColor: profile.button_border_color,
              borderWidth: 2,
              borderStyle: "solid",
              backgroundColor: isFill ? profile.button_fill_color : "transparent",
              color: isFill ? profile.button_text_color : profile.text_color,
              boxShadow: profile.button_shadow ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
            }}
          >
            {link.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={link.thumbnail_url}
                alt=""
                className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-md object-cover"
              />
            ) : null}
            <span className="block text-sm font-semibold leading-tight">{link.title}</span>
            {link.subtitle ? (
              <span className="mt-0.5 block text-[11px] opacity-80">{link.subtitle}</span>
            ) : null}
          </div>
        ))}
      </div>

      {profile.social_position === "bottom" ? (
        <div className="mt-5">{social}</div>
      ) : null}

      {profile.footer ? (
        <p className="mt-6 text-center text-[10px] opacity-70">{profile.footer}</p>
      ) : null}
    </div>
  );
}
