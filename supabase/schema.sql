-- ============================================================
--  Linktree — schema do banco (rode no SQL Editor do Supabase)
-- ============================================================
-- Cria as tabelas, politicas de RLS e dados iniciais.
-- Pode rodar mais de uma vez sem quebrar (usa IF NOT EXISTS / ON CONFLICT).

-- Extensao para gen_random_uuid()
create extension if not exists pgcrypto;

-- ------------------------------------------------------------
--  Tabela: profiles  (perfil unico do dono da pagina)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null default 'Meu Linktree',
  bio                 text not null default '',
  logo_url            text,
  footer              text not null default '',

  -- fundo
  bg_color            text not null default '#192815',
  bg_gradient_end     text not null default '#192815',
  text_color          text not null default '#fffae3',

  -- botoes
  button_style        text not null default 'outline',   -- 'outline' | 'fill'
  button_border_color text not null default '#cfcebf',
  button_fill_color   text not null default '#ffffff',
  button_text_color   text not null default '#192815',
  button_radius       int  not null default 28,
  button_shadow       boolean not null default false,

  -- tipografia & layout
  font                text not null default 'Inter',
  social_position     text not null default 'top',        -- 'top' | 'bottom'
  social_links        jsonb not null default '{}'::jsonb,  -- { instagram, whatsapp, tiktok, ... }

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ------------------------------------------------------------
--  Tabela: links
-- ------------------------------------------------------------
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  title       text not null default '',
  url         text not null default '',
  subtitle    text,
  thumbnail_url text,
  position    int  not null default 0,
  active      boolean not null default true,
  is_featured boolean not null default false,
  click_count int  not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists links_profile_position_idx
  on public.links (profile_id, position);

-- ------------------------------------------------------------
--  Tabela: click_events  (1 linha por clique, p/ insights)
-- ------------------------------------------------------------
create table if not exists public.click_events (
  id          bigint generated always as identity primary key,
  link_id     uuid not null references public.links(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists click_events_link_idx
  on public.click_events (link_id, created_at);

-- ------------------------------------------------------------
--  Funcao: registrar clique (incrementa contador + evento)
-- ------------------------------------------------------------
create or replace function public.register_click(p_link_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.links set click_count = click_count + 1 where id = p_link_id;
  insert into public.click_events (link_id) values (p_link_id);
end;
$$;

-- ------------------------------------------------------------
--  RLS
-- ------------------------------------------------------------
alter table public.profiles     enable row level security;
alter table public.links        enable row level security;
alter table public.click_events enable row level security;

-- Leitura publica do perfil
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Leitura publica dos links (so os ativos)
drop policy if exists "links_public_read" on public.links;
create policy "links_public_read"
  on public.links for select
  using (active = true);

-- Permitir registrar clique via RPC (a funcao roda como definer; nenhuma
-- politica de insert direto necessaria). Sem politicas de escrita publica:
-- todas as alteracoes do admin passam pela service_role (bypassa RLS).

-- ------------------------------------------------------------
--  Seed: cria um perfil padrao se ainda nao existir
-- ------------------------------------------------------------
insert into public.profiles (id, name, bio, footer)
select
  '11111111-1111-1111-1111-111111111111',
  'Rafaela Hoden',
  'Bem-vindo ao meu cantinho ✨',
  ''
where not exists (select 1 from public.profiles);

-- Links de exemplo (so insere se a tabela estiver vazia)
insert into public.links (profile_id, title, url, subtitle, position)
select p.id, v.title, v.url, v.subtitle, v.position
from (select id from public.profiles order by created_at limit 1) p,
     (values
        ('Instagram', 'https://instagram.com/', null, 0),
        ('WhatsApp',  'https://wa.me/55',        null, 1),
        ('Meu site',  'https://example.com',     'Conheca meu trabalho', 2)
     ) as v(title, url, subtitle, position)
where not exists (select 1 from public.links);
