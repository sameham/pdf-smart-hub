-- ============================================
-- EMERGENCY FIX: Infinite Recursion in RLS
-- ============================================
-- شغّل الـ SQL ده في Supabase لو حصلت infinite recursion
-- ============================================

-- 1. حذف كل الـ policies القديمة على admin_users
DROP POLICY IF EXISTS "Anyone authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow first admin bootstrap" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "First admin can self-insert" ON public.admin_users;

-- 2. حذف الـ policies على audit_log
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can insert audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can view audit" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Authenticated can insert audit" ON public.admin_audit_log;

-- 3. حذف الـ policies على site_settings
DROP POLICY IF EXISTS "Anyone can read public settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;

-- 4. إنشاء helper functions بـ SECURITY DEFINER
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

GRANT EXECUTE ON FUNCTION public.check_is_admin(uuid) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_min_role(uuid, text) TO authenticated, anon;

-- 5. إنشاء policies جديدة (بدون recursion)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Super admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.has_min_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_min_role(auth.uid(), 'admin'));

CREATE POLICY "First admin can self-insert"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
  );

-- 6. نفس الشيء للجداول الأخرى
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.check_is_admin(auth.uid()));

CREATE POLICY "Authenticated can insert audit"
  ON public.admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.check_is_admin(auth.uid()))
  WITH CHECK (public.check_is_admin(auth.uid()));

-- ✅ شغّل الـ SQL ده كمان لو الجدول فيه بيانات قديمة
UPDATE public.admin_users
SET is_active = true
WHERE is_active IS NULL;

-- ✅ الخطوة الأخيرة: لو الجدول فاضي وعايز تضيف نفسك
-- غيّر 'YOUR_USER_ID' بالـ UUID بتاعك من auth.users

-- INSERT INTO public.admin_users (id, role, is_active, notes)
-- SELECT id, 'super_admin', true, 'Emergency setup'
-- FROM auth.users
-- WHERE email = 'sameham3@gmail.com';

-- ✅ Done! جرب تسجيل الدخول دلوقتي