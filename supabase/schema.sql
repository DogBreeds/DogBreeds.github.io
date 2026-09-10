create table if not exists public.quiz_results (
  user_id uuid primary key references auth.users(id) on delete cascade,
  quiz_state jsonb not null,
  updated_at timestamptz not null default timezone('utc', now()),
  constraint quiz_results_state_is_object check (jsonb_typeof(quiz_state) = 'object')
);

alter table public.quiz_results enable row level security;

revoke all on table public.quiz_results from anon, authenticated;
grant select, insert, update on table public.quiz_results to authenticated;

drop policy if exists "Users can read their own quiz result" on public.quiz_results;
create policy "Users can read their own quiz result"
on public.quiz_results
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own quiz result" on public.quiz_results;
create policy "Users can create their own quiz result"
on public.quiz_results
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own quiz result" on public.quiz_results;
create policy "Users can update their own quiz result"
on public.quiz_results
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
