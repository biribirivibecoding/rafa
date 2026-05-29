export type ButtonStyle = "outline" | "fill";
export type SocialPosition = "top" | "bottom";

export type SocialLinks = {
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  facebook?: string;
  x?: string;
  email?: string;
  website?: string;
};

export type Profile = {
  id: string;
  name: string;
  bio: string;
  logo_url: string | null;
  footer: string;
  bg_color: string;
  bg_gradient_end: string;
  text_color: string;
  button_style: ButtonStyle;
  button_border_color: string;
  button_fill_color: string;
  button_text_color: string;
  button_radius: number;
  button_shadow: boolean;
  font: string;
  social_position: SocialPosition;
  social_links: SocialLinks;
  created_at: string;
  updated_at: string;
};

export type LinkItem = {
  id: string;
  profile_id: string;
  title: string;
  url: string;
  subtitle: string | null;
  thumbnail_url: string | null;
  position: number;
  active: boolean;
  is_featured: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
};

export const FONTS = [
  "Inter",
  "DM Sans",
  "Poppins",
  "Montserrat",
  "Playfair Display",
  "system-ui",
] as const;

export const SOCIAL_KEYS: (keyof SocialLinks)[] = [
  "instagram",
  "whatsapp",
  "tiktok",
  "youtube",
  "facebook",
  "x",
  "email",
  "website",
];
