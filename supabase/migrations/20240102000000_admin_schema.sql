-- ============================================
-- PDF Smart Hub - Admin Dashboard Schema
-- ============================================

-- جدول صلاحيات الأدمن
create table if not exists public.admin_users (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null default 'moderator' check (role in ('super_admin', 'admin', 'moderator', 'support')),
  permissions jsonb default '{}'::jsonb,
  is_active boolean default true,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone default now() not null,
  created_by uuid references auth.users(id),
  notes text
);

create index if not exists admin_users_role_idx on public.admin_users(role);
create index if not exists admin_users_active_idx on public.admin_users(is_active);

-- RLS: فقط super_admin يقدر يدير، أي admin يقدر يقرأ
alter table public.admin_users enable row level security;

drop policy if exists "Admins can view admin_users" on public.admin_users;
create policy "Admins can view admin_users"
  on public.admin_users for select
  using (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid() and au.is_active = true
    )
  );

drop policy if exists "Super admins can manage admin_users" on public.admin_users;
create policy "Super admins can manage admin_users"
  on public.admin_users for all
  using (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid() and au.role = 'super_admin' and au.is_active = true
    )
  );

-- ============================================
-- سجل نشاط الأدمن (Audit Log)
-- ============================================

create table if not exists public.admin_audit_log (
  id uuid default gen_random_uuid() primary key,
  admin_id uuid references auth.users(id) on delete set null,
  action text not null, -- 'user.ban', 'user.delete', 'settings.update', etc.
  target_type text, -- 'user', 'tool', 'setting', 'system'
  target_id text,
  details jsonb default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone default now() not null
);

create index if not exists admin_audit_admin_idx on public.admin_audit_log(admin_id);
create index if not exists admin_audit_action_idx on public.admin_audit_log(action);
create index if not exists admin_audit_created_idx on public.admin_audit_log(created_at desc);

alter table public.admin_audit_log enable row level security;

drop policy if exists "Admins can view audit log" on public.admin_audit_log;
create policy "Admins can view audit log"
  on public.admin_audit_log for select
  using (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid() and au.is_active = true
    )
  );

drop policy if exists "Admins can insert audit log" on public.admin_audit_log;
create policy "Admins can insert audit log"
  on public.admin_audit_log for insert
  with check (auth.uid() = admin_id);

-- ============================================
-- إعدادات الموقع
-- ============================================

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default now() not null,
  updated_by uuid references auth.users(id)
);

alter table public.site_settings enable row level security;

drop policy if exists "Anyone can read public settings" on public.site_settings;
create policy "Anyone can read public settings"
  on public.site_settings for select using (true);

drop policy if exists "Admins can manage settings" on public.site_settings;
create policy "Admins can manage settings"
  on public.site_settings for all
  using (
    exists (
      select 1 from public.admin_users au
      where au.id = auth.uid() and au.is_active = true
    )
  );

-- إعدادات افتراضية
insert into public.site_settings (key, value, description) values
  ('site_name', '"PDF Smart Hub"'::jsonb, 'اسم الموقع'),
  ('site_description', '"منصة عربية لمعالجة ملفات PDF"'::jsonb, 'وصف الموقع'),
  ('maintenance_mode', 'false'::jsonb, 'وضع الصيانة'),
  ('max_file_size_mb', '50'::jsonb, 'الحد الأقصى لحجم الملف'),
  ('daily_operations_limit', '100'::jsonb, 'عدد العمليات اليومية للمستخدم المجاني'),
  ('enable_signup', 'true'::jsonb, 'السماح بإنشاء حسابات جديدة'),
  ('enable_analytics', 'true'::jsonb, 'تفعيل الإحصائيات'),
  ('contact_email', '"admin@pdfsmarthub.com"'::jsonb, 'بريد التواصل')
on conflict (key) do nothing;

-- ============================================
-- تعديلات على جدول processing_history للأدمن
-- ============================================

-- إضافة indexes إضافية لتحسين الأداء
create index if not exists processing_history_status_idx on public.processing_history(status);

-- ============================================
-- Function: فحص صلاحيات المستخدم
-- ============================================

create or replace function public.is_admin(check_user_id uuid)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = check_user_id and is_active = true
  );
$$;

create or replace function public.get_admin_role(check_user_id uuid)
returns text
language sql
security definer
stable
as $$
  select role from public.admin_users
  where id = check_user_id and is_active = true
  limit 1;
$$;

create or replace function public.has_permission(
  check_user_id uuid,
  required_role text
)
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admin_users
    where id = check_user_id
      and is_active = true
      and (
        role = 'super_admin'
        or (required_role = 'admin' and role in ('admin', 'super_admin'))
        or (required_role = 'moderator' and role in ('moderator', 'admin', 'super_admin'))
      )
  );
$$;

-- ============================================
-- View: إحصائيات شاملة للأدمن
-- ============================================

create or replace view public.admin_stats as
select
  (select count(*) from auth.users) as total_users,
  (select count(*) from auth.users where created_at > now() - interval '24 hours') as new_users_24h,
  (select count(*) from auth.users where created_at > now() - interval '7 days') as new_users_7d,
  (select count(*) from public.processing_history) as total_operations,
  (select count(*) from public.processing_history where created_at > now() - interval '24 hours') as operations_24h,
  (select count(*) from public.processing_history where created_at > now() - interval '7 days') as operations_7d,
  (select count(*) from public.processing_history where status = 'failed') as failed_operations,
  (select coalesce(sum(file_size), 0) from public.processing_history) as total_bytes_processed,
  (select count(*) from public.admin_users where is_active = true) as active_admins;

-- ============================================
-- View: أكثر الأدوات استخداماً
-- ============================================

create or replace view public.popular_tools as
select
  tool_type,
  count(*) as usage_count,
  count(distinct user_id) as unique_users,
  avg(file_size)::bigint as avg_file_size,
  max(created_at) as last_used
from public.processing_history
where created_at > now() - interval '30 days'
group by tool_type
order by usage_count desc;

-- ============================================
-- View: المستخدمون النشطون
-- ============================================

create or replace view public.active_users as
select
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.raw_user_meta_data->>'full_name' as full_name,
  coalesce(stats.op_count, 0) as total_operations,
  stats.last_operation,
  case when au.id is not null then au.role else null end as admin_role
from auth.users u
left join public.admin_users au on au.id = u.id
left join lateral (
  select
    count(*) as op_count,
    max(created_at) as last_operation
  from public.processing_history ph
  where ph.user_id = u.id
) stats on true
order by u.created_at desc;

-- ============================================
-- Insert: أول super admin (sameham3@gmail.com)
-- ============================================

-- هيتضاف بعد ما المستخدم يعمل signup
-- أو يدوياً من الـ SQL Editor