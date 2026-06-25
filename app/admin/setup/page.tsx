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
} from "lucide-react";
import { toast } from "sonner";

const ADMIN_SCHEMA_SQL = `-- PDF Smart Hub - Admin Dashboard Schema

-- جدول صلاحيات الأدمن
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

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
CREATE POLICY "Super admins can manage admin_users"
  ON public.admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.id = auth.uid() AND au.role = 'super_admin' AND au.is_active = true
    )
  );

-- سجل نشاط الأدمن
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

DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can view audit log"
  ON public.admin_audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

DROP POLICY IF EXISTS "Admins can insert audit log" ON public.admin_audit_log;
CREATE POLICY "Admins can insert audit log"
  ON public.admin_audit_log FOR INSERT
  WITH CHECK (auth.uid() = admin_id);

-- إعدادات الموقع
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  description text,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read public settings" ON public.site_settings;
CREATE POLICY "Anyone can read public settings"
  ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
CREATE POLICY "Admins can manage settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au
      WHERE au.id = auth.uid() AND au.is_active = true
    )
  );

INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', '"PDF Smart Hub"'::jsonb, 'اسم الموقع'),
  ('site_description', '"منصة عربية لمعالجة ملفات PDF"'::jsonb, 'وصف الموقع'),
  ('maintenance_mode', 'false'::jsonb, 'وضع الصيانة'),
  ('max_file_size_mb', '50'::jsonb, 'الحد الأقصى لحجم الملف'),
  ('daily_operations_limit', '100'::jsonb, 'عدد العمليات اليومية للمستخدم المجاني'),
  ('enable_signup', 'true'::jsonb, 'السماح بإنشاء حسابات جديدة'),
  ('contact_email', '"admin@pdfsmarthub.com"'::jsonb, 'بريد التواصل')
ON CONFLICT (key) DO NOTHING;

-- Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = check_user_id AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.has_permission(check_user_id uuid, required_role text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = check_user_id AND is_active = true
      AND (
        role = 'super_admin'
        OR (required_role = 'admin' AND role IN ('admin', 'super_admin'))
        OR (required_role = 'moderator' AND role IN ('moderator', 'admin', 'super_admin'))
      )
  );
$$;

-- Views
CREATE OR REPLACE VIEW public.admin_stats AS
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

CREATE OR REPLACE VIEW public.popular_tools AS
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

CREATE OR REPLACE VIEW public.active_users AS
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
  SELECT
    COUNT(*) AS op_count,
    MAX(created_at) AS last_operation
  FROM public.processing_history ph
  WHERE ph.user_id = u.id
) stats ON true
ORDER BY u.created_at DESC;`;

const SETUP_ADMIN_SQL = `-- بعد ما تشغّل الـ schema فوق، شغّل الـ SQL ده لإضافة أول سوبر أدمن
-- غيّر 'your-email@example.com' بإيميلك

INSERT INTO public.admin_users (id, role, is_active, notes)
SELECT
  id,
  'super_admin',
  true,
  'Initial super admin'
FROM auth.users
WHERE email = 'YOUR_EMAIL_HERE'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', is_active = true;`;

export default function AdminSetupPage() {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [promoting, setPromoting] = useState(false);
  const [checking, setChecking] = useState(false);
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const router = useRouter();

  const copySchema = async () => {
    await navigator.clipboard.writeText(ADMIN_SCHEMA_SQL);
    setCopied(true);
    toast.success("✅ Schema SQL copied! افتح Supabase والصقه");
    setTimeout(() => setCopied(false), 3000);
  };

  const checkSetup = async () => {
    setChecking(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("admin_users")
        .select("id")
        .limit(1);

      if (error) {
        if (error.code === "PGRST205") {
          setTableExists(false);
          toast.error("الجدول مش موجود - شغّل الـ SQL أولاً");
        } else {
          toast.error("خطأ: " + error.message);
        }
      } else {
        setTableExists(true);
        toast.success("✅ الجدول موجود!");
      }
    } catch (err) {
      toast.error("فشل التحقق");
    } finally {
      setChecking(false);
    }
  };

  const promoteSelf = async () => {
    if (!email) {
      toast.error("اكتب إيميلك أولاً");
      return;
    }
    setPromoting(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("promote_to_admin", {
        user_email: email,
      });

      if (error) throw error;
      toast.success("✅ تم! جاري تسجيل الدخول...");
      router.push("/admin/login");
    } catch (err: any) {
      toast.error("فشل: " + (err.message || "تحقق من تشغيل الـ schema"));
    } finally {
      setPromoting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center mb-4 shadow-2xl shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-slate-400">
            إعداد نظام الأدمن - خطوة واحدة
          </p>
        </div>

        {/* Status */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
          <button
            onClick={checkSetup}
            disabled={checking}
            className="w-full flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">حالة قاعدة البيانات</span>
            </div>
            <div className="flex items-center gap-2">
              {checking && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
              {tableExists === true && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                  ✅ جاهز
                </span>
              )}
              {tableExists === false && (
                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded-full text-xs">
                  ❌ محتاج إعداد
                </span>
              )}
              {tableExists === null && (
                <span className="px-2 py-1 bg-slate-700 text-slate-300 rounded-full text-xs">
                  اضغط للتحقق
                </span>
              )}
            </div>
          </button>

          {tableExists === false && (
            <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-amber-200 text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>
                  الجدول مش موجود. اتبع الخطوات تحت لإعداده.
                </span>
              </p>
            </div>
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
            افتح Supabase SQL Editor والصق الكود ده:
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
              onClick={copySchema}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  تم النسخ
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ SQL Schema
                </>
              )}
            </button>
          </div>

          <details className="mt-4">
            <summary className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
              عرض SQL
            </summary>
            <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-xs text-slate-300 overflow-x-auto max-h-96 overflow-y-auto">
              {ADMIN_SCHEMA_SQL.substring(0, 500)}...
            </pre>
          </details>
        </div>

        {/* Step 2: Promote */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
              2
            </div>
            <h2 className="text-xl font-bold text-white">
              أضف نفسك كـ Super Admin
            </h2>
          </div>

          <p className="text-slate-300 text-sm mb-4">
            اكتب الإيميل اللي عملت بيه حساب على الموقع:
          </p>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={async () => {
                if (!email) {
                  toast.error("اكتب الإيميل");
                  return;
                }
                await navigator.clipboard.writeText(
                  SETUP_ADMIN_SQL.replace("YOUR_EMAIL_HERE", email)
                );
                toast.success("✅ تم نسخ SQL - الصقه في Supabase");
              }}
              className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              نسخ
            </button>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-400 mb-2">SQL اللي هيتنسخ:</p>
            <pre className="text-xs text-slate-300 overflow-x-auto">
{`INSERT INTO public.admin_users (id, role, is_active, notes)
SELECT id, 'super_admin', true, 'Initial super admin'
FROM auth.users
WHERE email = '${email || "YOUR_EMAIL_HERE"}'
ON CONFLICT (id) DO UPDATE
SET role = 'super_admin', is_active = true;`}
            </pre>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            💡 شغّل الـ SQL ده في Supabase، ثم ارجع واضغط "إضافة كأدمن":
          </p>

          <div className="flex gap-2">
            <button
              onClick={async () => {
                setPromoting(true);
                try {
                  const supabase = createClient();
                  // Verify user is logged in
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) {
                    toast.error("سجل دخول أولاً من /admin/login");
                    router.push("/admin/login");
                    return;
                  }

                  // Check if user is now admin
                  const { data: adminData, error } = await supabase
                    .from("admin_users")
                    .select("role")
                    .eq("id", user.id)
                    .eq("is_active", true)
                    .single();

                  if (error || !adminData) {
                    toast.error("لسه مش أدمن - شغّل SQL في Supabase أولاً");
                  } else {
                    toast.success(`✅ أنت ${adminData.role}!`);
                    router.push("/admin/login");
                  }
                } catch (err) {
                  toast.error("حدث خطأ");
                } finally {
                  setPromoting(false);
                }
              }}
              disabled={promoting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
            >
              {promoting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  تم - جرّب تسجيل الدخول
                </>
              )}
            </button>
          </div>
        </div>

        {/* Help */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            محتاج مساعدة؟{" "}
            <a
              href="https://supabase.com/docs/guides/database/overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Supabase Docs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}