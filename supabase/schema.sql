-- ============================================
-- PDF Smart Hub - Supabase Database Schema
-- ============================================

-- جدول سجل العمليات
create table if not exists public.processing_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tool_type text not null,
  file_name text not null,
  file_size bigint not null default 0,
  status text not null default 'completed',
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now() not null
);

-- Indexes للأداء
create index if not exists processing_history_user_id_idx
  on public.processing_history(user_id);

create index if not exists processing_history_created_at_idx
  on public.processing_history(created_at desc);

create index if not exists processing_history_tool_type_idx
  on public.processing_history(tool_type);

-- تفعيل RLS (Row Level Security)
alter table public.processing_history enable row level security;

-- Policies
drop policy if exists "Users can view own history" on public.processing_history;
create policy "Users can view own history"
  on public.processing_history for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own history" on public.processing_history;
create policy "Users can insert own history"
  on public.processing_history for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own history" on public.processing_history;
create policy "Users can delete own history"
  on public.processing_history for delete
  using (auth.uid() = user_id);

-- ============================================
-- User Profiles
-- ============================================

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  preferred_language text default 'ar' check (preferred_language in ('ar', 'en')),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- ============================================
-- Trigger: إنشاء profile تلقائياً عند التسجيل
-- ============================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- Function: تحديث updated_at تلقائياً
-- ============================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();