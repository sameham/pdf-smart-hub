-- ============================================
-- PDF Smart Hub - Admin Dashboard Schema v2
-- FIXED: No infinite recursion
-- ============================================

-- ⚠️ لو الجداول موجودة من قبل، شغّل DROP أولاً
-- DROP TABLE IF EXISTS public.site_settings CASCADE;
-- DROP TABLE IF EXISTS public.admin_audit_log CASCADE;
-- DROP TABLE IF EXISTS public.admin_users CASCADE;

-- ============================================
-- 1. جدول admin_users
-- ============================================
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'moderator' CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')),
  permissions jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  last_login_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  notes text
);

CREATE INDEX IF NOT EXISTS admin_users_role_idx ON public.admin_users(role);
CREATE INDEX IF NOT EXISTS admin_users_active_idx ON public.admin_users(is_active);

-- ============================================
-- 2. Helper Functions (SECURITY DEFINER)
--    ده هو الحل - بتشتغل بصلاحيات owner ومش بتتفعّل RLS عليها
-- ============================================

CREATE OR REPLACE FUNCTION public.check_is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = check_user_id AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(check_user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.admin_users
  WHERE id = check_user_id AND is_active = true
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_min_role(check_user_id uuid, required_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = check_user_id
      AND is_active = true
      AND (
        role = 'super_admin'
        OR (required_role = 'admin' AND role IN ('admin', 'super_admin'))
        OR (required_role = 'moderator' AND role IN ('moderator', 'admin', 'super_admin'))
      )
  );
$$;

-- منح الصلاحيات للـ functions
GRANT EXECUTE ON FUNCTION public.check_is_admin(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_role(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_min_role(uuid, text) TO authenticated, anon;

-- ============================================
-- 3. Enable RLS + Policies (NO RECURSION)
-- ============================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- حذف الـ policies القديمة (احتياطياً)
DROP POLICY IF EXISTS "Anyone authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow first admin bootstrap" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can insert audit log" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_users;
DROP POLICY IF EXISTS "Anyone can read public settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can view audit" ON public.admin_audit_log;

-- قراءة: أي مستخدم مسجل يقدر يقرأ (آمن - البيانات مش حساسة)
CREATE POLICY "Authenticated can read admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (true);

-- كتابة: فقط super_admin (باستخدام function - لا recursion)
CREATE POLICY "Super admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.has_min_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_min_role(auth.uid(), 'admin'));

-- bootstrap: أول أدمن (لما الجدول فاضي) يقدر يضيف نفسه
CREATE POLICY "First admin can self-insert"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
  );

-- ============================================
-- 4. جدول admin_audit_log
-- ============================================

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS admin_audit_admin_idx ON public.admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_audit_action_idx ON public.admin_audit_log(action);
CREATE INDEX IF NOT EXISTS admin_audit_created_idx ON public.admin_audit_log(created_at DESC);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

-- قراءة: بس الأدمن (باستخدام SECURITY DEFINER function)
CREATE POLICY "Admins can view audit"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.check_is_admin(auth.uid()));

-- كتابة: أي logged-in user يقدر يسجل عمليات
CREATE POLICY "Authenticated can insert audit"
  ON public.admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

-- ============================================
-- 5. جدول site_settings
-- ============================================

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- قراءة: أي حد
CREATE POLICY "Anyone reads settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- كتابة: بس الأدمن
CREATE POLICY "Admins manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.check_is_admin(auth.uid()))
  WITH CHECK (public.check_is_admin(auth.uid()));

-- إعدادات افتراضية
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', '"PDF Smart Hub"'::jsonb, 'اسم الموقع'),
  ('site_description', '"منصة عربية لمعالجة ملفات PDF"'::jsonb, 'وصف الموقع'),
  ('maintenance_mode', 'false'::jsonb, 'وضع الصيانة'),
  ('max_file_size_mb', '50'::jsonb, 'الحد الأقصى لحجم الملف'),
  ('daily_operations_limit', '100'::jsonb, 'عدد العمليات اليومية للمستخدم المجاني'),
  ('enable_signup', 'true'::jsonb, 'السماح بإنشاء حسابات جديدة'),
  ('contact_email', '"admin@pdfsmarthub.com"'::jsonb, 'بريد التواصل')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- 6. Views (محسّنة مع SECURITY INVOKER)
-- ============================================

DROP VIEW IF EXISTS public.admin_stats CASCADE;
DROP VIEW IF EXISTS public.popular_tools CASCADE;
DROP VIEW IF EXISTS public.active_users CASCADE;

CREATE VIEW public.admin_stats
WITH (security_invoker = true)
AS
SELECT
  (SELECT COUNT(*) FROM auth.users) AS total_users,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '24 hours') AS new_users_24h,
  (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '7 days') AS new_users_7d,
  (SELECT COUNT(*) FROM public.processing_history) AS total_operations,
  (SELECT COUNT(*) FROM public.processing_history WHERE created_at > NOW() - INTERVAL '24 hours') AS operations_24h,
  (SELECT COUNT(*) FROM public.processing_history WHERE created_at > NOW() - INTERVAL '7 days') AS operations_7d,
  (SELECT COUNT(*) FROM public.processing_history WHERE status = 'failed') AS failed_operations,
  (SELECT COALESCE(SUM(file_size), 0) FROM public.processing_history) AS total_bytes_processed,
  (SELECT COUNT(*) FROM public.admin_users WHERE is_active = true) AS active_admins;

CREATE VIEW public.popular_tools
WITH (security_invoker = true)
AS
SELECT
  tool_type,
  COUNT(*) AS usage_count,
  COUNT(DISTINCT user_id) AS unique_users,
  AVG(file_size)::bigint AS avg_file_size,
  MAX(created_at) AS last_used
FROM public.processing_history
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY tool_type
ORDER BY usage_count DESC;

CREATE VIEW public.active_users
WITH (security_invoker = true)
AS
SELECT
  u.id,
  u.email,
  u.created_at,
  u.last_sign_in_at,
  u.raw_user_meta_data->>'full_name' AS full_name,
  COALESCE(stats.op_count, 0) AS total_operations,
  stats.last_operation,
  CASE WHEN au.id IS NOT NULL THEN au.role ELSE NULL END AS admin_role
FROM auth.users u
LEFT JOIN public.admin_users au ON au.id = u.id
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS op_count, MAX(created_at) AS last_operation
  FROM public.processing_history ph WHERE ph.user_id = u.id
) stats ON true
ORDER BY u.created_at DESC;

-- منح صلاحيات قراءة الـ views
GRANT SELECT ON public.admin_stats TO authenticated;
GRANT SELECT ON public.popular_tools TO authenticated;
GRANT SELECT ON public.active_users TO authenticated;

-- ============================================
-- ✅ DONE!
-- ============================================
-- الآن لو ظهر خطأ infinite recursion:
-- 1. تأكد إنك شغّلت الـ SQL ده كاملاً (مش قديم)
-- 2. لو الجداول قديمة، شغّل DROP أولاً
-- 3. أو احذف الـ policies يدوياً من Supabase Dashboard
-- ============================================