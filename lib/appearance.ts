import type { CSSProperties } from "react";
import type { Profile } from "@/lib/types";

/**
 * Estilo de fundo da pagina, compartilhado entre a pagina publica e o preview
 * do admin para que fiquem sempre identicos.
 *
 * - modo "image": imagem cobrindo a tela, com uma camada de escurecimento
 *   (bg_overlay, 0-100%) por cima para manter o texto legivel.
 * - modo "gradient": cor solida (quando as duas cores sao iguais) ou gradiente.
 */
export function backgroundStyle(profile: Profile): CSSProperties {
  if (profile.bg_mode === "image" && profile.bg_image_url) {
    const o = Math.min(Math.max(profile.bg_overlay ?? 0, 0), 100) / 100;
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,${o}), rgba(0,0,0,${o})), url("${profile.bg_image_url}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  }

  const bg =
    profile.bg_color === profile.bg_gradient_end
      ? profile.bg_color
      : `linear-gradient(160deg, ${profile.bg_color}, ${profile.bg_gradient_end})`;
  return { background: bg };
}
