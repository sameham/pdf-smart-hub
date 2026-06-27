-- ============================================
-- Setup: إنشاء أول Super Admin
-- ============================================
-- شغّل الـ SQL ده في Supabase Dashboard بعد ما تعمل:
-- 1. حساب على www.pdfsmarthub.com/auth/signup بنفس الإيميل (sameham3@gmail.com)
-- 2. شغّل الـ admin schema من supabase/migrations/20240102000000_admin_schema.sql
-- 3. شغّل الـ SQL ده
-- ============================================

-- إضافة المستخدم كأدمن
insert into public.admin_users (id, role, is_active, notes)
select
  id,
  'super_admin',
  true,
  'Initial super admin created via setup script'
from auth.users
where email = 'sameham3@gmail.com'
on conflict (id) do update
set role = 'super_admin', is_active = true;

-- التحقق من النتيجة
select
  au.id,
  au.role,
  au.is_active,
  u.email,
  au.created_at
from public.admin_users au
join auth.users u on u.id = au.id;

-- إضافة audit log entry
insert into public.admin_audit_log (admin_id, action, target_type, target_id, details)
select
  id,
  'admin.created',
  'admin_user',
  id::text,
  '{"role": "super_admin", "method": "manual_setup"}'::jsonb
from auth.users
where email = 'sameham3@gmail.com';