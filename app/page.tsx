import { getProfile, getLinks } from "@/lib/data";
import { LinkButton } from "@/components/LinkButton";
import { SocialIcons } from "@/components/SocialIcons";

export const dynamic = "force-dynamic";

export default async function PublicPage() {
  const profile = await getProfile(true);

  if (!profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 p-6 text-center text-zinc-600">
        <div>
          <p className="text-lg font-semibold">Pagina ainda nao configurada</p>
          <p className="mt-2 text-sm">
            Configure o Supabase (.env.local) e rode o <code>supabase/schema.sql</code>.
          </p>
        </div>
      </main>
    );
  }

  const links = await getLinks(profile.id, { activeOnly: true, admin: true });

  const background =
    profile.bg_color === profile.bg_gradient_end
      ? profile.bg_color
      : `linear-gradient(160deg, ${profile.bg_color}, ${profile.bg_gradient_end})`;

  const social = (
    <SocialIcons links={profile.social_links} color={profile.text_color} />
  );

  return (
    <main
      className="flex min-h-screen flex-col items-center px-5 py-12"
      style={{
        background,
        color: profile.text_color,
        fontFamily: `'${profile.font}', system-ui, sans-serif`,
      }}
    >
      <div className="flex w-full max-w-md flex-1 flex-col items-center">
        {profile.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.logo_url}
            alt={profile.name}
            className="h-24 w-24 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div
            className="flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold shadow-lg"
            style={{ backgroundColor: profile.button_border_color, color: profile.bg_color }}
          >
            {profile.name.charAt(0).toUpperCase()}
          </div>
        )}

        <h1 className="mt-4 text-center text-2xl font-bold">{profile.name}</h1>
        {profile.bio ? (
          <p className="mt-2 max-w-sm text-center text-sm opacity-90">{profile.bio}</p>
        ) : null}

        {profile.social_position === "top" ? <div className="mt-5">{social}</div> : null}

        <div className="mt-7 flex w-full flex-col gap-3.5">
          {links.length === 0 ? (
            <p className="text-center text-sm opacity-70">Nenhum link ainda.</p>
          ) : (
            links.map((link) => (
              <LinkButton key={link.id} link={link} profile={profile} />
            ))
          )}
        </div>

        {profile.social_position === "bottom" ? (
          <div className="mt-7">{social}</div>
        ) : null}
      </div>

      {profile.footer ? (
        <footer className="mt-10 text-center text-xs opacity-70">{profile.footer}</footer>
      ) : null}
    </main>
  );
}
