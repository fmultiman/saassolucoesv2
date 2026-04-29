alter table public.users
  add column if not exists plan_id integer references public.plans(id),
  add column if not exists onboarding_completed boolean not null default false;

create unique index if not exists users_email_lower_idx on public.users (lower(email));

update public.users
set onboarding_completed = false
where onboarding_completed is null;

update public.users u
set plan_id = p.id
from public.plans p
where u.plan_id is null
  and lower(coalesce(u.plan, 'gratuito')) = lower(coalesce(p.code, p.name));

create or replace function public.handle_new_auth_user()
returns trigger as $$
declare
  resolved_plan_id integer;
  resolved_plan_code text;
begin
  select id, coalesce(code, 'gratuito')
    into resolved_plan_id, resolved_plan_code
  from public.plans
  where lower(coalesce(code, name)) = lower(coalesce(new.raw_user_meta_data->>'plan', 'gratuito'))
  order by id
  limit 1;

  if resolved_plan_code is null then
    resolved_plan_code := 'gratuito';
  end if;

  insert into public.users (
    id,
    email,
    name,
    user_type,
    status,
    plan,
    plan_id,
    onboarding_completed,
    last_sign_in_at
  )
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'name', new.email),
    coalesce(new.raw_user_meta_data->>'user_type', 'client'),
    'active',
    resolved_plan_code,
    resolved_plan_id,
    false,
    new.last_sign_in_at
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(public.users.name, excluded.name),
        user_type = coalesce(public.users.user_type, excluded.user_type),
        plan = coalesce(public.users.plan, excluded.plan),
        plan_id = coalesce(public.users.plan_id, excluded.plan_id),
        last_sign_in_at = coalesce(excluded.last_sign_in_at, public.users.last_sign_in_at);

  insert into public.profiles (id, email, name)
  values (new.id, lower(new.email), coalesce(new.raw_user_meta_data->>'name', new.email))
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(public.profiles.name, excluded.name);

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();
