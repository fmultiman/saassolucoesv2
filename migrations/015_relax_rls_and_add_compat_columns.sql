-- Temporary stabilization patch while the app is being revived.
-- Adds columns expected by legacy screens/APIs and relaxes RLS until route auth is rebuilt.

alter table public.users add column if not exists active_solutions integer default 0;
alter table public.users add column if not exists last_active timestamptz default now();
alter table public.users add column if not exists plan_id integer references public.plans(id);

alter table public.plan_solutions add column if not exists custom_price numeric;
alter table public.plan_solutions add column if not exists custom_limits jsonb;

update public.users u
set plan_id = p.id
from public.plans p
where u.plan_id is null
  and p.code = u.plan;

update public.users
set plan_id = (select id from public.plans where code = 'gratuito' limit 1)
where plan_id is null
  and user_type = 'client';

drop view if exists public.user_profiles_view;

create or replace view public.user_profiles_view as
select
  u.id,
  u.email,
  u.name,
  u.status,
  u.plan,
  u.plan_id,
  u.user_type,
  u.user_type as role,
  true as verified,
  (p.id is not null) as has_profile,
  u.active_solutions,
  u.last_active,
  u.last_sign_in_at,
  u.created_at,
  u.updated_at,
  p.bio,
  p.phone,
  p.job_title,
  p.company,
  p.website,
  p.location,
  p.avatar_url,
  p.preferences,
  p.profile_complete,
  p.company_name,
  p.company_size,
  p.industry,
  p.address,
  p.city,
  p.state,
  p.country,
  p.postal_code,
  p.social_links,
  p.username
from public.users u
left join public.profiles p on p.id = u.id;

grant select on public.user_profiles_view to anon, authenticated, service_role;

alter table public.users disable row level security;
alter table public.profiles disable row level security;
alter table public.solutions disable row level security;
alter table public.plans disable row level security;
alter table public.plan_solutions disable row level security;
alter table public.subscriptions disable row level security;
alter table public.posts disable row level security;
alter table public.notifications disable row level security;
alter table public.user_notifications disable row level security;
alter table public.email_verification disable row level security;
alter table public.migrations disable row level security;

grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
