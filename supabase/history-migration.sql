create table if not exists public.quiz_result_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  result_created_at bigint not null,
  quiz_state jsonb not null,
  saved_at timestamptz not null default timezone('utc', now()),
  constraint quiz_result_history_state_is_object check (jsonb_typeof(quiz_state) = 'object'),
  constraint quiz_result_history_user_time_unique unique (user_id, result_created_at)
);

alter table public.quiz_result_history enable row level security;

revoke all on table public.quiz_result_history from anon, authenticated;
grant select, insert on table public.quiz_result_history to authenticated;

drop policy if exists "Users can read their quiz history" on public.quiz_result_history;
create policy "Users can read their quiz history"
on public.quiz_result_history
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can add to their quiz history" on public.quiz_result_history;
create policy "Users can add to their quiz history"
on public.quiz_result_history
for insert
to authenticated
with check ((select auth.uid()) = user_id);

insert into public.quiz_result_history (user_id, result_created_at, quiz_state)
select
  user_id,
  coalesce(
    case
      when (quiz_state->>'createdAt') ~ '^[0-9]+$' then (quiz_state->>'createdAt')::bigint
      else null
    end,
    (extract(epoch from updated_at) * 1000)::bigint
  ),
  quiz_state
from public.quiz_results
on conflict (user_id, result_created_at) do nothing;
