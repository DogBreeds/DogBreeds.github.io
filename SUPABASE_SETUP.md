# Supabase setup

This phase stores one latest quiz result per account. Anonymous visitors continue to use the existing device-local result.

1. Create a Supabase project.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. Under **Authentication → URL Configuration**, set:
   - Site URL: `https://dogbreeds.github.io/`
   - Redirect URL: `https://dogbreeds.github.io/`
4. In the project's **Connect** dialog, copy the project URL and the publishable key beginning with `sb_publishable_`.
5. Put those two values into `supabase-config.js`.

The publishable key is designed for browser code and is restricted by Row Level Security. Never add a secret key or legacy `service_role` key to this repository.

## Sync behavior

- Completing the quiz still saves the result locally.
- When a user logs in, the newer of the local and cloud results wins.
- Completing another quiz while logged in updates the cloud result.
- Logging out removes the account-owned local copy from that device. The cloud copy remains available after the next login.
