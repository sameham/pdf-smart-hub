"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  RefreshCw,
  Code2,
} from "lucide-react";
import { toast } from "sonner";

// SQL كامل يحل المشكلة في خطوة واحدة
const COMPLETE_SETUP_SQL = `-- ============================================
-- PDF Smart Hub - Complete Admin Setup
-- شغّل SQL ده مرة واحدة في Supabase SQL Editor
-- ============================================

-- 1. تنظيف كل الـ policies القديمة (احتياطياً)
DROP POLICY IF EXISTS "Anyone authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow first admin bootstrap" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "Authenticated can read admin_users" ON public.admin_users;
DROP POLICY IF EXISTS "First admin can self-insert" ON public.admin_users;
DROP POLICY IF EXISTS "Admins can view audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can insert audit log" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Admins can view audit" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Authenticated can insert audit" ON public.admin_audit_log;
DROP POLICY IF EXISTS "Anyone can read public settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.site_settings;
DROP POLICY IF EXISTS "Anyone reads settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins manage settings" ON public.site_settings;

-- 2. Helper Functions بـ SECURITY DEFINER (الحل للـ recursion)
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

-- 3. Policies جديدة (آمنة وبدون recursion)
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

-- 4. جدول الـ audit log
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit"
  ON public.admin_audit_log FOR SELECT
  TO authenticated
  USING (public.check_is_admin(auth.uid()));

CREATE POLICY "Authenticated can insert audit"
  ON public.admin_audit_log FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = admin_id);

-- 5. Site Settings
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins manage settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.check_is_admin(auth.uid()))
  WITH CHECK (public.check_is_admin(auth.uid()));

-- 6. ✅ الإصلاح العاجل: إضافة المستخدم كأدمن
-- غيّر 'sameham3@gmail.com' بإيميلك لو مختلف
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = 'sameham3@gmail.com'
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (id, role, is_active, notes, created_at)
    VALUES (target_user_id, 'super_admin', true, 'Bootstrap super admin via setup wizard', NOW())
    ON CONFLICT (id) DO UPDATE
    SET role = 'super_admin',
        is_active = true,
        notes = 'Bootstrap super admin (updated)';
    
    RAISE NOTICE '✅ تم إضافة المستخدم كأدمن بنجاح! User ID: %', target_user_id;
  ELSE
    RAISE NOTICE '⚠️ لم يتم العثور على مستخدم بهذا الإيميل. تأكد من التسجيل أولاً.';
  END IF;
END $$;

-- ✅ انتهى! جرب تسجيل الدخول كأدمن الآن`;

export default function AdminSetupPage() {
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [promoting, setPromoting] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [status, setStatus] = useState<{
    loggedIn: boolean;
    email?: string;
    userId?: string;
    tableExists: boolean;
    isAdmin: boolean;
    recursionError: boolean;
    error?: string;
  } | null>(null);
  const router = useRouter();

  const copySql = async () => {
    await navigator.clipboard.writeText(COMPLETE_SETUP_SQL);
    setCopied(true);
    toast.success("✅ تم نسخ SQL الكامل - الصقه في Supabase");
    setTimeout(() => setCopied(false), 3000);
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
          loggedIn: false,
          tableExists: false,
          isAdmin: false,
          recursionError: false,
          error: "سجل دخول من /auth/login أولاً",
        });
        setChecking(false);
        return;
      }

      // 2. Test if we can read admin_users (without recursion)
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("id, role, is_active")
        .eq("id", userData.user.id)
        .maybeSingle();

      let tableExists = false;
      let isAdmin = false;
      let recursionError = false;

      if (adminError) {
        if (
          adminError.code === "42P17" ||
          adminError.message.includes("infinite recursion")
        ) {
          recursionError = true;
        } else if (
          adminError.code === "PGRST205" ||
          adminError.message.includes("Could not find")
        ) {
          tableExists = false;
        } else {
          tableExists = true;
        }
      } else {
        tableExists = true;
        isAdmin = adminData?.is_active === true;
      }

      setStatus({
        loggedIn: true,
        email: userData.user.email,
        userId: userData.user.id,
        tableExists,
        isAdmin,
        recursionError,
        error: adminError?.message,
      });
    } catch (err: any) {
      setStatus({
        loggedIn: false,
        tableExists: false,
        isAdmin: false,
        recursionError: false,
        error: err?.message || "Unknown error",
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const tryPromoteViaApi = async () => {
    if (!status?.userId) return;
    setPromoting(true);
    try {
      const response = await fetch("/api/admin-bootstrap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: status.userId,
          email: status.email,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("✅ تم! جاري تسجيل الدخول...");
        setTimeout(() => router.push("/admin/login"), 1000);
      } else {
        toast.error("فشل: " + (data.error || "تحقق من setup wizard"));
        setShowSql(true);
      }
    } catch (err: any) {
      toast.error("API غير متاح - استخدم SQL");
      setShowSql(true);
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
          <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
          <p className="text-slate-400">إعداد نظام الأدمن - خطوة واحدة</p>
        </div>

        {/* Status Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-400" />
              الحالة الحالية
            </h2>
            <button
              onClick={checkStatus}
              disabled={checking}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              {checking ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3" />
              )}
              إعادة الفحص
            </button>
          </div>

          {status && (
            <div className="space-y-2">
              <StatusRow
                ok={status.loggedIn}
                label="مسجل دخول"
                detail={status.email || "Not logged in"}
              />
              <StatusRow
                ok={status.tableExists && !status.recursionError}
                label="جدول admin_users يعمل بدون مشاكل"
                detail={
                  status.recursionError
                    ? "⚠️ Infinite recursion - يجب إصلاح الـ policies"
                    : status.tableExists
                    ? "✅ يعمل"
                    : status.error || "غير موجود"
                }
              />
              <StatusRow
                ok={status.isAdmin}
                label="أنت مسجل كأدمن"
                detail={
                  status.isAdmin
                    ? "✅ يمكنك تسجيل الدخول"
                    : "تحتاج إضافة نفسك لأدمن"
                }
              />
            </div>
          )}

          {status?.isAdmin && (
            <button
              onClick={() => router.push("/admin/login")}
              className="mt-4 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              كل شيء جاهز - سجل دخول كأدمن
            </button>
          )}
        </div>

        {/* الحل الرئيسي - SQL واحد شامل */}
        <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 backdrop-blur border-2 border-purple-500/50 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              ⚡
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-1">
                الحل في خطوة واحدة
              </h2>
              <p className="text-slate-300 text-sm">
                شغّل الـ SQL ده مرة واحدة في Supabase - هيصلح كل شيء ويضيفك كأدمن تلقائياً
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <a
              href="https://supabase.com/dashboard/project/zijqrpevpzgjtttmjwlt/sql"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-lg font-medium transition text-sm shadow-lg"
            >
              <Database className="w-4 h-4" />
              افتح Supabase SQL Editor
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={copySql}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition text-sm shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  تم النسخ ✓
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  نسخ SQL الكامل
                </>
              )}
            </button>
            <button
              onClick={tryPromoteViaApi}
              disabled={promoting || !status?.userId}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg font-medium transition text-sm"
            >
              {promoting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              جرب إضافة تلقائية
            </button>
          </div>

          {/* Quick Steps */}
          <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-medium">
              خطوات سريعة:
            </p>
            <ol className="text-sm text-slate-300 space-y-1.5 mr-4 list-decimal">
              <li>
                اضغط <span className="text-emerald-400 font-medium">"افتح Supabase SQL Editor"</span>
              </li>
              <li>
                اضغط <span className="text-purple-400 font-medium">"نسخ SQL الكامل"</span>
              </li>
              <li>الصق في الـ SQL Editor واضغط <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-xs">Run</kbd></li>
              <li>ارجع هنا واضغط "إعادة الفحص"</li>
            </ol>
          </div>

          {/* SQL Display */}
          <div className="mt-4">
            <button
              onClick={() => setShowSql(!showSql)}
              className="text-sm text-slate-400 hover:text-slate-300 flex items-center gap-2"
            >
              <Code2 className="w-4 h-4" />
              {showSql ? "إخفاء" : "عرض"} محتوى الـ SQL ({COMPLETE_SETUP_SQL.split("\n").length} سطر)
            </button>
            {showSql && (
              <pre className="mt-3 p-4 bg-slate-950 rounded-lg text-xs text-slate-300 overflow-x-auto max-h-96 overflow-y-auto border border-slate-700">
                {COMPLETE_SETUP_SQL}
              </pre>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            لو SQL مشتغلش؟
          </h3>
          <ul className="text-sm text-slate-300 space-y-2 mr-4 list-disc">
            <li>تأكد إنك في <strong className="text-white">SQL Editor</strong> مش Table Editor</li>
            <li>لو ظهر خطأ "permission denied"، شغّل كمان:
              <pre className="mt-1 p-2 bg-slate-900 rounded text-xs">
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
              </pre>
            </li>
            <li>ابعتلي <strong className="text-white">screenshot للـ error</strong> لو في مشكلة</li>
          </ul>
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
        <p className="text-xs text-slate-400 break-all">{detail}</p>
      </div>
    </div>
  );
}