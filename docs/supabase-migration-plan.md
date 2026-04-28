# Supabase migration plan

## Current decision

Use the numbered migrations as the starting source of truth, but treat `013_reset_auth_system.sql` as the final authority for auth-related objects.

Recommended base order for a new Supabase project:

1. `migrations/000_create_execute_sql_function.sql`
2. `migrations/001_insert_solutions.sql`
3. `migrations/003_create_plans.sql`
4. `migrations/004_create_plan_solutions.sql`
5. `migrations/005_create_subscriptions.sql`
6. `migrations/006_configure_storage_permissions.sql`
7. `migrations/009_fix_storage_policies.sql`
8. `migrations/013_reset_auth_system.sql`
9. `migrations/update_plans_schema.sql`, only if old data still uses legacy plan codes

The older profile/auth migrations (`002`, `007`, `008`, `010`, `011`, `012`) overlap with `013` and should not be blindly replayed into a fresh database without consolidation.

## Tables used by the app

Core tables found in migrations:

- `users`
- `profiles`
- `solutions`
- `plans`
- `plan_solutions`
- `subscriptions`
- `migrations`

Tables used by app code but not clearly represented in the numbered migration set:

- `posts`
- `notifications`
- `user_notifications`
- `email_verification`
- `email_change_requests`

These should be inspected in the old Supabase before creating the new schema. If they contain data, export their structure and rows before switching projects.

## Storage

The app expects a public Supabase Storage bucket:

- `user-content`

Known usage:

- `user-content/avatars/...`

Before migration, list the bucket and decide whether to copy the files or start with an empty bucket.

## Environment variables needed for the new Supabase

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

Current `.env.local` also contains Upstash Redis credentials. Rotate those before production if they were shared or committed anywhere else.

## Migration checklist

1. Run the inventory script against the old Supabase.
2. Export table schemas for all tables that have data but no migration file.
3. Export data for auth users, public tables, and storage files.
4. Create a fresh consolidated migration set for the new Supabase.
5. Apply migrations to the new Supabase.
6. Import data.
7. Update `.env.local` and deployment variables.
8. Validate login, admin routes, blog posts, plans, solutions, storage upload, and notifications.

