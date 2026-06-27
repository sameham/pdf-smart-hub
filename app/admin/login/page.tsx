"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Mail,
  Lock,
  Loader2,
  AlertTriangle,
  Database,
  ArrowLeft,
  Copy,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{
    type: "table_missing" | "not_admin" | "auth" | "unknown";
    message: string;
    details?: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    // 1. Login
    let loginData;
    try {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (result.error) {
        setError({
          type: "auth",
          message: "بيانات الدخول غير صحيحة",
          details: result.error.message,
        });
        toast.error("بيانات الدخول غير صحيحة");
        setLoading(false);
        return;
      }
      if (!result.data.user) {
        setError({
          type: "auth",
          message: "فشل تسجيل الدخول",
        });
        toast.error("فشل تسجيل الدخول");
        setLoading(false);
        return;
      }
      loginData = result.data;
    } catch (err: any) {
      setError({
        type: "auth",
        message: "خطأ في المصادقة",
        details: err?.message,
      });
      toast.error("خطأ في المصادقة");
      setLoading(false);
      return;
    }

    const userId = loginData.user.id;

    // 2. Try multiple ways to check admin status
    let adminData = null;
    let adminError: any = null;

    // الطريقة 1: استعلام مباشر
    try {
      const result = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", userId)
        .eq("is_active", true)
        .maybeSingle();

      adminData = result.data;
      adminError = result.error;
    } catch (err: any) {
      adminError = err;
    }

    // لو مفيش نتيجة، نجرب RPC
    if (!adminData && !adminError) {
      try {
        const { data: rpcData, error: rpcError } = await supabase.rpc(
          "is_admin",
          { check_user_id: userId }
        );

        if (!rpcError && rpcData === true) {
          // هو أدمن، نقرأ بياناته
          const { data: userData } = await supabase
            .from("admin_users")
            .select("*")
            .eq("id", userId)
            .single();
          adminData = userData;
        }
      } catch {
        // ignore
      }
    }

    // تحليل النتيجة
    if (adminError) {
      console.error("Admin check error:", adminError);
      await supabase.auth.signOut();

      const code = adminError.code;
      const msg = adminError.message || "";

      if (
        code === "PGRST205" ||
        msg.includes("Could not find the table") ||
        msg.includes("admin_users")
      ) {
        setError({
          type: "table_missing",
          message: "جدول admin_users غير موجود في قاعدة البيانات",
          details: `الخطأ: ${msg}`,
        });
        toast.error("جدول admin_users غير موجود");
      } else if (code === "42501" || msg.includes("permission denied")) {
        setError({
          type: "table_missing",
          message: "مش مسموح بقراءة جدول admin_users (RLS)",
          details: `RLS Policy مش متاحة. شغّل الـ schema الكاملة.`,
        });
        toast.error("مشكلة في الصلاحيات");
      } else {
        setError({
          type: "unknown",
          message: "خطأ غير متوقع في التحقق",
          details: `${code}: ${msg}`,
        });
        toast.error("خطأ غير متوقع");
      }
      setLoading(false);
      return;
    }

    if (!adminData) {
      // مش أدمن
      await supabase.auth.signOut();
      setError({
        type: "not_admin",
        message: `الحساب (${email}) مش موجود في جدول الأدمن`,
        details: "تحتاج تضيفه يدوياً من Supabase",
      });
      toast.error("هذا الحساب غير مصرح له بالدخول كأدمن");
      setLoading(false);
      return;
    }

    // نجاح
    toast.success(
      `مرحباً ${adminData.role === "super_admin" ? "سوبر أدمن" : adminData.role}`
    );
    router.push(redirect);
    router.refresh();
  };

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="admin@pdfsmarthub.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Sign In to Admin
        </button>
      </form>

      {error && (
        <ErrorBox error={error} email={email} onGoToSetup={() => router.push("/admin/setup")} />
      )}
    </>
  );
}

function ErrorBox({
  error,
  email,
  onGoToSetup,
}: {
  error: { type: string; message: string; details?: string };
  email: string;
  onGoToSetup: () => void;
}) {
  const copyDetails = () => {
    if (error.details) {
      navigator.clipboard.writeText(error.details);
      toast.success("تم نسخ التفاصيل");
    }
  };

  const config = {
    table_missing: {
      color: "amber",
      icon: Database,
      title: "⚠️ جدول admin_users غير موجود",
      steps: [
        "افتح Supabase Dashboard",
        "روح SQL Editor",
        "شغّل الـ Admin Schema الكامل",
        "ارجع وجرب تاني",
      ],
    },
    not_admin: {
      color: "amber",
      icon: Shield,
      title: "⚠️ الحساب مش أدمن",
      steps: [
        `الحساب ${email} مش موجود في admin_users`,
        "روح Supabase → Table Editor → admin_users",
        "أضف صف جديد بالـ user_id و role = super_admin",
        "أو شغّل SQL:",
        `INSERT INTO admin_users (id, role, is_active) SELECT id, 'super_admin', true FROM auth.users WHERE email = '${email}';`,
      ],
    },
    auth: {
      color: "red",
      icon: AlertTriangle,
      title: "❌ خطأ في المصادقة",
      steps: ["تأكد من الإيميل وكلمة المرور", "تأكد إن الحساب موجود"],
    },
    unknown: {
      color: "red",
      icon: Terminal,
      title: "❌ خطأ غير متوقع",
      steps: [
        "انسخ التفاصيل وابعتهم للدعم",
        "أو روح /admin/setup للمساعدة",
      ],
    },
  }[error.type] || {
    color: "red",
    icon: AlertTriangle,
    title: "❌ خطأ",
    steps: [],
  };

  const Icon = config.icon;

  return (
    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-fade-in">
      <div className="flex items-start gap-3 mb-3">
        <Icon className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-amber-200 font-medium mb-1">{error.message}</p>
          {error.details && (
            <button
              onClick={copyDetails}
              className="mt-1 text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              {error.details.length > 60
                ? error.details.substring(0, 60) + "..."
                : error.details}
            </button>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        {config.steps.map((step, idx) => (
          <p key={idx} className="text-sm text-amber-300/90">
            {step}
          </p>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onGoToSetup}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition text-sm"
        >
          <Database className="w-4 h-4" />
          افتح صفحة الإعداد
          <ArrowLeft className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 items-center justify-center mb-4 shadow-2xl shadow-purple-500/30">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-slate-400">PDF Smart Hub Control Center</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-start gap-2 text-amber-200 text-xs">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p>للأدمن فقط. كل محاولات الدخول يتم تسجيلها.</p>
          </div>

          <Suspense fallback={<div className="text-center py-8 text-slate-400">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by PDF Smart Hub Security • v1.0
        </p>
      </div>
    </div>
  );
}