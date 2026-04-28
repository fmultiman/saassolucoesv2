# Old Supabase inventory

Inventory source: `.env.local`

Supabase URL:

- `https://supabase.multihuman.com.br`

Snapshot from `pnpm supabase:inventory`:

| Area | Count/status |
| --- | ---: |
| `auth.users` | 5 |
| `public.users` | 5 |
| `public.profiles` | 5 |
| `public.solutions` | 46 |
| `public.plans` | 4 |
| `public.plan_solutions` | 64 |
| `public.subscriptions` | 0 |
| `public.posts` | 2 |
| `public.notifications` | 3 |
| `public.user_notifications` | 0 |
| `public.email_verification` | 0 |
| `public.email_change_requests` | 0 |
| `public.migrations` | 10 |
| Storage bucket `user-content` | exists, public |

## Migration relevance

Data worth preserving:

- Auth users and matching public `users` / `profiles`
- `solutions`
- `plans`
- `plan_solutions`
- `posts`
- `notifications`
- Storage files in `user-content`
- Existing `migrations` rows, at least as reference/audit trail

Likely safe to recreate empty:

- `subscriptions`
- `user_notifications`
- `email_verification`
- `email_change_requests`

## Next export pass

Before changing Supabase credentials, export:

1. Auth users metadata.
2. CSV or JSON rows for all tables with count greater than zero.
3. Bucket object list and files from `user-content`.
4. Schema definitions for `posts`, `notifications`, and `user_notifications`, because they are used by the app but are not clearly covered by the numbered migrations.

