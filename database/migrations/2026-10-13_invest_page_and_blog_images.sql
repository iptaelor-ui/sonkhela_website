-- Sonkhela: Invest page tables + optional blog cover images
-- Run once in Supabase → SQL Editor. Safe to re-run.

-- ───────────────────────────────────────────────────────────────
-- 1. Investors (photos + testimonials shown on /invest)
-- ───────────────────────────────────────────────────────────────
create table if not exists public.investors (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  role           text,                 -- e.g. "Business owner, Lusaka"
  photo_url      text,                 -- public URL from the site-images bucket
  testimonial    text not null,
  investor_since int,                  -- e.g. 2025
  display_order  int  not null default 0,
  is_published   boolean not null default true,
  created_at     timestamptz not null default now()
);

alter table public.investors enable row level security;

drop policy if exists "Public can read published investors" on public.investors;
create policy "Public can read published investors"
  on public.investors for select
  to anon, authenticated
  using (is_published);

-- ───────────────────────────────────────────────────────────────
-- 2. Investment & savings openings
-- ───────────────────────────────────────────────────────────────
create table if not exists public.investment_openings (
  id            uuid primary key default gen_random_uuid(),
  kind          text not null default 'investment'
                  check (kind in ('investment', 'savings')),
  title         text not null,
  description   text,
  min_amount    numeric,               -- in kwacha, e.g. 5000
  return_rate   text,                  -- e.g. "15% per year"
  term          text,                  -- e.g. "12 months"
  status        text not null default 'open'
                  check (status in ('open', 'closing_soon', 'closed')),
  display_order int  not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.investment_openings enable row level security;

drop policy if exists "Public can read published openings" on public.investment_openings;
create policy "Public can read published openings"
  on public.investment_openings for select
  to anon, authenticated
  using (is_published);

-- ───────────────────────────────────────────────────────────────
-- 3. Optional cover image for blog posts
--    (posts without one get a built-in illustration)
-- ───────────────────────────────────────────────────────────────
alter table public.blog_posts add column if not exists cover_image text;

-- ───────────────────────────────────────────────────────────────
-- 4. Public bucket for investor photos and blog images
-- ───────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;
