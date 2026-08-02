-- 个人工作台：每位登录用户一份独立的 JSON 数据
create table if not exists public.workbench_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workbench_data enable row level security;

-- 表级权限：未登录用户无权访问，登录用户还必须通过下方 RLS 才能读写自己的记录
revoke all on table public.workbench_data from anon;
grant select, insert, update, delete on table public.workbench_data to authenticated;

drop policy if exists "workbench_select_own" on public.workbench_data;
create policy "workbench_select_own"
on public.workbench_data for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "workbench_insert_own" on public.workbench_data;
create policy "workbench_insert_own"
on public.workbench_data for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "workbench_update_own" on public.workbench_data;
create policy "workbench_update_own"
on public.workbench_data for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "workbench_delete_own" on public.workbench_data;
create policy "workbench_delete_own"
on public.workbench_data for delete
to authenticated
using ((select auth.uid()) = user_id);

create index if not exists workbench_data_user_id_idx
on public.workbench_data using btree (user_id);
