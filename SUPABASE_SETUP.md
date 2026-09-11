# Supabase setup

This setup stores the latest quiz result and quiz history for each account. Anonymous visitors continue to use the existing device-local result.

1. Create a Supabase project.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. Under **Authentication → URL Configuration**, set:
   - Site URL: `https://dogbreeds.github.io/`
   - Redirect URL: `https://dogbreeds.github.io/`
4. In the project's **Connect** dialog, copy the project URL and the publishable key beginning with `sb_publishable_`.
5. Put those two values into `supabase-config.js`.

The publishable key is designed for browser code and is restricted by Row Level Security. Never add a secret key or legacy `service_role` key to this repository.

## Add quiz history to an existing project

If the original setup was already completed, run `supabase/history-migration.sql` once in the Supabase SQL Editor. It creates the protected history table and copies each account's latest existing result into it.

## Sync behavior

- Completing the quiz still saves the result locally.
- When a user logs in, the newer of the local and cloud results wins.
- Completing another quiz while logged in updates the cloud result.
- Every completed quiz is also added to the account's past-results list.
- Logging out removes the account-owned local copy from that device. The cloud copy remains available after the next login.
