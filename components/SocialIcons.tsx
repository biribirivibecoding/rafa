import {
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Mail,
  Globe,
  MessageCircle,
  Music2,
} from "lucide-react";
import type { SocialLinks } from "@/lib/types";

const ICONS: Record<keyof SocialLinks, typeof Instagram> = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  tiktok: Music2,
  youtube: Youtube,
  facebook: Facebook,
  x: Twitter,
  email: Mail,
  website: Globe,
};

function href(key: keyof SocialLinks, value: string): string {
  if (key === "email") return value.startsWith("mailto:") ? value : `mailto:${value}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export function SocialIcons({
  links,
  color,
}: {
  links: SocialLinks;
  color: string;
}) {
  const entries = (Object.entries(links) as [keyof SocialLinks, string][]).filter(
    ([, v]) => v && v.trim()
  );
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {entries.map(([key, value]) => {
        const Icon = ICONS[key];
        if (!Icon) return null;
        return (
          <a
            key={key}
            href={href(key, value)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={key}
            className="opacity-90 transition hover:opacity-100 hover:scale-110"
            style={{ color }}
          >
            <Icon className="h-6 w-6" />
          </a>
        );
      })}
    </div>
  );
}
