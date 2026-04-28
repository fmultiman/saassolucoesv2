-- Restore production-oriented RLS after the temporary stabilization patch in 015.
-- Server-side service_role clients continue to bypass RLS; browser/session clients are scoped here.

create or replace function public.current_app_user_type()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.user_type from public.users u where u.id = auth.uid()
$$;

create or replace function public.current_app_user_plan()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.plan from public.users u where u.id = auth.uid()
$$;

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_app_user_type() = 'admin', false)
$$;

do $$
declare
  table_name text;
  policy_name text;
begin
  foreach table_name in array array[
    'users',
    'profiles',
    'solutions',
    'plans',
    'plan_solutions',
    'subscriptions',
    'posts',
    'notifications',
    'user_notifications',
    'email_verification',
    'migrations'
  ]
  loop
    for policy_name in
      select pol.polname
      from pg_policy pol
      join pg_class cls on cls.oid = pol.polrelid
      join pg_namespace nsp on nsp.oid = cls.relnamespace
      where nsp.nspname = 'public'
        and cls.relname = table_name
    loop
      execute format('drop policy if exists %I on public.%I', policy_name, table_name);
    end loop;
  end loop;
end $$;

alter table public.users enable row level security;
alter table public.profiles enable row level security;
alter table public.solutions enable row level security;
alter table public.plans enable row level security;
alter table public.plan_solutions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.posts enable row level security;
alter table public.notifications enable row level security;
alter table public.user_notifications enable row level security;
alter table public.email_verification enable row level security;
alter table public.migrations enable row level security;

revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all tables in schema public from authenticated;
revoke all on all sequences in schema public from authenticated;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.solutions, public.plans, public.plan_solutions, public.posts to anon;
grant select on public.solutions, public.plans, public.plan_solutions, public.posts to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant usage, select on all sequences in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;

grant execute on function public.current_app_user_type() to anon, authenticated, service_role;
grant execute on function public.current_app_user_plan() to anon, authenticated, service_role;
grant execute on function public.is_app_admin() to anon, authenticated, service_role;
grant select on public.user_profiles_view to anon, authenticated, service_role;

create policy "Users can read own row or admins can read all users"
on public.users for select
using (auth.uid() = id or public.is_app_admin());

create policy "Users can insert own row or admins can insert users"
on public.users for insert
with check (auth.uid() = id or public.is_app_admin());

create policy "Users can update own row or admins can update users"
on public.users for update
using (auth.uid() = id or public.is_app_admin())
with check (auth.uid() = id or public.is_app_admin());

create policy "Users can read own profile or admins can read profiles"
on public.profiles for select
using (auth.uid() = id or public.is_app_admin());

create policy "Users can insert own profile or admins can insert profiles"
on public.profiles for insert
with check (auth.uid() = id or public.is_app_admin());

create policy "Users can update own profile or admins can update profiles"
on public.profiles for update
using (auth.uid() = id or public.is_app_admin())
with check (auth.uid() = id or public.is_app_admin());

create policy "Public can read active solutions and admins can read all solutions"
on public.solutions for select
using (is_active = true or public.is_app_admin());

create policy "Admins can manage solutions"
on public.solutions for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Public can read active plans and admins can read all plans"
on public.plans for select
using (is_active = true or public.is_app_admin());

create policy "Admins can manage plans"
on public.plans for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Public can read plan solutions and admins can manage them"
on public.plan_solutions for select
using (true);

create policy "Admins can manage plan solutions"
on public.plan_solutions for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Users can read own subscriptions and admins can manage subscriptions"
on public.subscriptions for select
using (auth.uid() = user_id or public.is_app_admin());

create policy "Admins can manage subscriptions"
on public.subscriptions for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Public can read published posts and admins can manage posts"
on public.posts for select
using (publicado = true or public.is_app_admin());

create policy "Admins can manage posts"
on public.posts for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Authenticated users can read targeted notifications and admins can manage notifications"
on public.notifications for select
using (
  public.is_app_admin()
  or (
    auth.role() = 'authenticated'
    and (expires_at is null or expires_at > now())
    and (user_target is null or user_target = auth.uid())
    and (role_target is null or role_target = 'all' or role_target = public.current_app_user_type())
    and (plan_target is null or plan_target = public.current_app_user_plan())
  )
);

create policy "Admins can manage notifications"
on public.notifications for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Users can manage own notification read state and admins can manage all read state"
on public.user_notifications for all
using (user_id = auth.uid() or public.is_app_admin())
with check (user_id = auth.uid() or public.is_app_admin());

create policy "Users can read own email verification rows and admins can manage all"
on public.email_verification for select
using (user_id = auth.uid() or public.is_app_admin());

create policy "Admins can manage email verification rows"
on public.email_verification for all
using (public.is_app_admin())
with check (public.is_app_admin());

create policy "Admins can manage migration audit rows"
on public.migrations for all
using (public.is_app_admin())
with check (public.is_app_admin());
