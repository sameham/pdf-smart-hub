"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import {
  Shield,
  Database,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  User,
  CheckCircle2,
  XCircle,
  Terminal,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_SCHEMA_SQL = `-- ============================================
-- PDF Smart Hub - Admin Dashboard Schema v2
-- ⚠️ FIXED: لا توجد infinite recursion
-- ============================================

-- ⚠️ لو الجداول موجودة من قبل، شغّل DROP أولاً:
-- DROP TABLE IF EXISTS public.site_settings CASCADE;
-- DROP TABLE IF EXISTS public.admin_audit_log CASCADE;
-- DROP TABLE IF EXISTS public.admin_users CASCADE;

-- 1. جدول admin_users
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

-- 2. Helper Functions (SECURITY DEFINER = الحل للـ recursion)
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

-- 3. Enable RLS + Policies (بدون recursion)
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow first admin bootstrap" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "First admin can self-insert" ON public.admin_users;

-- قراءة: أي مستخدم مسجل يقدر يقرأ
CREATE POLICY "Authenticated can read admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (true);

-- كتابة: super_admin بس (باستخدام function)
CREATE POLICY "Super admins can manage admin_users"
  ON public.admin_users FOR ALL
  TO authenticated
  USING (public.has_min_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_min_role(auth.uid(), 'admin'));

-- bootstrap: أول أدمن يقدر يضيف نفسه
CREATE POLICY "First admin can self-insert"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (SELECT 1 FROM public.admin_users LIMIT 1)
  );

-- 4. سجل نشاط الأدمن
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text,
  target_id text,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view audit" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Authenticated can insert audit" ON public.admin_audit_log;

CREATE POLICY "Admins can view audit"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.check_is_admin(auth.uid()));

CREATE POLICY "Authenticated can insert audit"
  ON public.admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

-- 5. إعدادات الموقع
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;

CREATE POLICY "Anyone reads settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.check_is_admin(auth.uid()))
  WITH CHECK (public.check_is_admin(auth.uid()));

INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', '"PDF Smart Hub"'::jsonb, 'اسم الموقع'),
  ('maintenance_mode', 'false'::jsonb, 'وضع الصيانة'),
  ('max_file_size_mb', '50'::jsonb, 'الحد الأقصى لحجم الملف'),
  ('daily_operations_limit', '100'::jsonb, 'عدد العمليات اليومية')
ON CONFLICT (key) DO NOTHING;

-- 6. Views
DROP VIEW IF EXISTS public.admin_stats CASCADE;
DROP VIEW IF EXISTS public.popular_tools CASCADE;
DROP VIEW IF EXISTS public.active_users CASCADE;

CREATE VIEW public.admin_stats AS
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

CREATE VIEW public.popular_tools AS
SELECT
  tool_type,
  COUNT(*) AS usage_count,
  COUNT(DISTINCT user_id) AS unique_users,
  MAX(created_at) AS last_used
FROM public.processing_history
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY tool_type
ORDER BY usage_count DESC;

CREATE VIEW public.active_users AS
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

GRANT SELECT ON public.admin_stats TO authenticated;
GRANT SELECT ON public.popular_tools TO authenticated;
GRANT SELECT ON public.active_users TO authenticated;

-- ✅ DONE! جرب تسجيل الدخول كأدمن دلوقتي`;

export default function AdminSetupPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [email, setEmail] = useState("sameham3@gmail.com");
  const [userId, setUserId] = useState("");
  const [checking, setChecking] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [status, setStatus] = useState<{
    tableExists: boolean;
    userIsAdmin: boolean;
    currentUser: any;
    adminsCount: number;
    error?: string;
  } | null>(null);
  const router = useRouter();

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("✅ تم النسخ");
    setTimeout(() => setCopied(null), 2000);
  };

  const checkStatus = async () => {
    setChecking(true);
    setStatus(null);
    try {
      const supabase = createClient();

      // 1. Get current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        setStatus({
          tableExists: false,
          userIsAdmin: false,
          currentUser: null,
          adminsCount: 0,
          error: "Not logged in - سجل دخول من /auth/login أولاً",
        });
        setChecking(false);
        return;
      }

      setUserId(userData.user.id);

      // 2. Check if admin_users table exists
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .limit(10);

      if (adminError) {
        setStatus({
          tableExists: false,
          userIsAdmin: false,
          currentUser: userData.user,
          adminsCount: 0,
          error: adminError.message,
        });
        setChecking(false);
        return;
      }

      // 3. Check if current user is admin
      const userIsAdmin = adminData?.some(
        (a: any) => a.id === userData.user.id && a.is_active
      );

      setStatus({
        tableExists: true,
        userIsAdmin: userIsAdmin || false,
        currentUser: userData.user,
        adminsCount: adminData?.length || 0,
      });
    } catch (err: any) {
      setStatus({
        tableExists: false,
        userIsAdmin: false,
        currentUser: null,
        adminsCount: 0,
        error: err?.message || "Unknown error",
      });
    } finally {
      setChecking(false);
    }
  };

  const promoteSelf = async () => {
    if (!userId) {
      toast.error("شغل الفحص أولاً");
      return;
    }
    setPromoting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("admin_users")
        .insert({
          id: userId,
          role: "super_admin",
          is_active: true,
          notes: "Self-promoted via setup wizard",
        });

      if (error) {
        toast.error("فشل: " + error.message);
        setPromoting(false);
        return;
      }

      toast.success("✅ تم! جاري تسجيل الدخول...");
      setTimeout(() => {
        router.push("/admin/login");
      }, 1000);
    } catch (err: any) {
      toast.error("خطأ: " + err?.message);
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center mb-4 shadow-2xl shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Setup Wizard</h1>
          <p className="text-slate-400">إعداد نظام الأدمن - خطوة بخطوة</p>
        </div>

        {/* Status Check */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              فحص الحالة الحالية
            </h2>
            <button
              onClick={checkStatus}
              disabled={checking}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition flex items-center gap-2 text-sm disabled:opacity-50"
            >
              {checking ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              فحص
            </button>
          </div>

          {status && (
            <div className="space-y-2">
              <StatusRow
                ok={status.currentUser !== null}
                label="المستخدم مسجل دخول"
                detail={status.currentUser?.email || "Not logged in"}
              />
              <StatusRow
                ok={status.tableExists}
                label="جدول admin_users موجود"
                detail={
                  status.tableExists
                    ? `يحتوي ${status.adminsCount} صف`
                    : status.error || "غير موجود"
                }
              />
              <StatusRow
                ok={status.userIsAdmin}
                label="أنت أدمن"
                detail={
                  status.userIsAdmin
                    ? "✅ يمكنك تسجيل الدخول كأدمن"
                    : status.tableExists
                    ? "تحتاج تضيف نفسك كأدمن"
                    : "شغّل الـ schema أولاً"
                }
              />
            </div>
          )}

          {status?.userIsAdmin && (
            <button
              onClick={() => router.push("/admin/login")}
              className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              كل حاجة جاهزة - سجل دخول كأدمن
            </button>
          )}
        </div>

        {/* Step 1: Schema */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              1
            </div>
            <h2 className="text-xl font-bold text-white">
              شغّل Database Schema
            </h2>
          </div>

          <p className="text-slate-300 text-sm mb-4">
            افتح Supabase SQL Editor والصق الكود التالي:
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            <a
              href="https://supabase.com/dashboard/project/zijqrpevpzgjtttmjwlt/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium transition text-sm"
            >
              <Database className="w-4 h-4" />
              افتح Supabase SQL Editor
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => copyText(ADMIN_SCHEMA_SQL, "schema")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm"
            >
              {copied === "schema" ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  تم
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ Schema
                </>
              )}
            </button>
          </div>

          <details className="mt-4">
            <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
              عرض SQL ({ADMIN_SCHEMA_SQL.split("\n").length} سطر)
            </summary>
            <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-slate-300 overflow-x-auto max-h-96 overflow-y-auto">
              {ADMIN_SCHEMA_SQL}
            </pre>
          </details>
        </div>

        {/* Step 2: Promote Self */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              2
            </div>
            <h2 className="text-xl font-bold text-white">
              ارفع نفسك كأدمن
            </h2>
          </div>

          <p className="text-slate-300 text-sm mb-4">
            بعد ما تشغّل الـ schema، دوس الزر ده عشان يضيفك كأدمن تلقائياً:
          </p>

          <button
            onClick={promoteSelf}
            disabled={promoting || !userId}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 text-lg"
          >
            {promoting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            إضافة كأدمن وتسجيل الدخول
          </button>

          <div className="mt-4 p-3 bg-slate-900/50 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">أو SQL يدوي:</p>
            <pre className="text-xs text-slate-300 overflow-x-auto">
{`INSERT INTO public.admin_users (id, role, is_active, notes)
VALUES ('${userId || "YOUR_USER_ID"}', 'super_admin', true, 'Setup wizard');`}
            </pre>
            <button
              onClick={() =>
                copyText(
                  `INSERT INTO public.admin_users (id, role, is_active, notes) VALUES ('${userId}', 'super_admin', true, 'Setup wizard');`,
                  "promote"
                )
              }
              className="mt-2 inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-medium transition"
            >
              {copied === "promote" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              نسخ
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://supabase.com/dashboard/project/zijqrpevpzgjtttmjwlt/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl hover:bg-slate-800/50 transition flex items-center gap-3 text-slate-300"
          >
            <Database className="w-5 h-5 text-purple-400" />
            <div>
              <p className="font-medium">Supabase Table Editor</p>
              <p className="text-xs text-slate-500">عرض وتعديل الجداول</p>
            </div>
          </a>
          <a
            href="https://supabase.com/dashboard/project/zijqrpevpzgjtttmjwlt/auth/users"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-slate-800/30 border border-slate-700 rounded-xl hover:bg-slate-800/50 transition flex items-center gap-3 text-slate-300"
          >
            <User className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="font-medium">Auth Users</p>
              <p className="text-xs text-slate-500">إدارة المستخدمين</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  ok,
  label,
  detail,
}: {
  ok: boolean;
  label: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
      {ok ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm">{label}</p>
        <p className="text-xs text-slate-400 truncate">{detail}</p>
      </div>
    </div>
  );
}