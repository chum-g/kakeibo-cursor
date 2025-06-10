-- categories テーブル作成
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now()),
  color text
);

-- expenses テーブル作成
create table expenses (
  id uuid primary key default gen_random_uuid(),
  amount integer not null,
  date date not null,
  memo text,
  category_id uuid references categories(id) on delete set null,
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLS（行レベルセキュリティ）有効化とポリシー
-- categories
alter table categories enable row level security;
create policy "ユーザー本人のみ参照可" on categories
  for select using (auth.uid() = user_id);
create policy "ユーザー本人のみ挿入可" on categories
  for insert with check (auth.uid() = user_id);
create policy "ユーザー本人のみ更新可" on categories
  for update using (auth.uid() = user_id);
create policy "ユーザー本人のみ削除可" on categories
  for delete using (auth.uid() = user_id);

-- expenses
alter table expenses enable row level security;
create policy "ユーザー本人のみ参照可" on expenses
  for select using (auth.uid() = user_id);
create policy "ユーザー本人のみ挿入可" on expenses
  for insert with check (auth.uid() = user_id);
create policy "ユーザー本人のみ更新可" on expenses
  for update using (auth.uid() = user_id);
create policy "ユーザー本人のみ削除可" on expenses
  for delete using (auth.uid() = user_id);

-- 既存テーブルにcolorカラムを追加
alter table categories add column if not exists color text; 