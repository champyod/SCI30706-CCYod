-- Run in Supabase SQL Editor

create table transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense')),
  category text not null,
  amount numeric(12,2) not null check (amount > 0),
  note text default '',
  date date not null,
  created_at timestamptz not null default now()
);

create table goals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  target numeric(12,2) not null check (target > 0),
  current numeric(12,2) not null default 0,
  duration integer not null default 30,
  position integer not null default 0,  -- for promoteGoal ordering
  created_at timestamptz not null default now()
);

create table settings (
  id integer primary key,
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- RLS: enable + anon policies for all three tables
alter table transactions enable row level security;
alter table goals enable row level security;
alter table settings enable row level security;

create policy "anon insert transactions" on transactions for insert to anon with check (true);
create policy "anon select transactions" on transactions for select to anon using (true);
create policy "anon update transactions" on transactions for update to anon using (true);
create policy "anon delete transactions" on transactions for delete to anon using (true);

create policy "anon insert goals" on goals for insert to anon with check (true);
create policy "anon select goals" on goals for select to anon using (true);
create policy "anon update goals" on goals for update to anon using (true);
create policy "anon delete goals" on goals for delete to anon using (true);

create policy "anon insert settings" on settings for insert to anon with check (true);
create policy "anon select settings" on settings for select to anon using (true);
create policy "anon update settings" on settings for update to anon using (true);
create policy "anon delete settings" on settings for delete to anon using (true);
