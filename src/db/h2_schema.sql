-- Hito 2: esquema mínimo off-chain
-- NOTA: Políticas RLS aquí son PERMISIVAS para desarrollo.
-- En producción, AJUSTAR a autorización real.

create extension if not exists "pgcrypto";

-- USERS
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  address text,
  created_at timestamptz not null default now()
);

-- COUPONS
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text,
  discount_bps int not null check (discount_bps between 0 and 5000),
  max_uses int not null default 0,
  used int not null default 0,
  active boolean not null default true,
  expires_at timestamptz
);

-- CHECKOUT SESSIONS
create table if not exists public.checkout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  plan text not null check (plan in ('monthly','yearly')),
  base_price_cents int not null check (base_price_cents >= 0),
  discount_bps int not null default 0 check (discount_bps between 0 and 5000),
  final_price_cents int not null check (final_price_cents >= 0),
  code text,
  status text not null default 'created' check (
    status in ('created','review','code_applied','confirmed_offchain','ready_for_chain','onchain_success','active')
  ),
  paid_offchain boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

-- WEBHOOKS (para logs varios)
create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  kind text,
  payload_json jsonb,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.users enable row level security;
alter table public.coupons enable row level security;
alter table public.checkout_sessions enable row level security;
alter table public.webhooks enable row level security;

-- DEV POLICIES (permisivas). Cambiar en prod.
do $$
begin
  -- USERS
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='users' and policyname='dev_users_all') then
    create policy "dev_users_all" on public.users
      for all using (true) with check (true);
  end if;

  -- COUPONS (solo lectura en dev para anon)
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='coupons' and policyname='dev_coupons_select') then
    create policy "dev_coupons_select" on public.coupons
      for select using (true);
  end if;

  -- CHECKOUT SESSIONS (rw en dev)
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='checkout_sessions' and policyname='dev_sessions_all') then
    create policy "dev_sessions_all" on public.checkout_sessions
      for all using (true) with check (true);
  end if;

  -- WEBHOOKS (insert/select en dev)
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='webhooks' and policyname='dev_webhooks_ins_sel') then
    create policy "dev_webhooks_ins_sel" on public.webhooks
      for select using (true);
    create policy "dev_webhooks_insert" on public.webhooks
      for insert with check (true);
  end if;
end$$;
