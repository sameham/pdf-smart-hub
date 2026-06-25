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
  CheckCircle2,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/admin/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTableMissing(false);
    setShowSetup(false);

    const supabase = createClient();

    // 1. Login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("بيانات الدخول غير صحيحة");
      setLoading(false);
      return;
    }

    if (!data.user) {
      toast.error("فشل تسجيل الدخول");
      setLoading(false);
      return;
    }

    // 2. Check admin status
    try {
      const { data: adminData, error: adminError } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", data.user.id)
        .eq("is_active", true)
        .single();

      if (adminError) {
        if (adminError.code === "PGRST205") {
          // الجدول مش موجود
          setTableMissing(true);
          setShowSetup(true);
          toast.error("جدول admin_users مش موجود - شوف خطوات الإعداد");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        throw adminError;
      }

      if (!adminData) {
        // مش أدمن
        await supabase.auth.signOut();
        setShowSetup(true);
        toast.error("هذا الحساب غير مصرح له بالدخول كأدمن");
        setLoading(false);
        return;
      }

      // نجاح
      toast.success(`مرحباً ${adminData.role === "super_admin" ? "سوبر أدمن" : "أدمن"}`);
      router.push(redirect);
      router.refresh();
    } catch (err) {
      toast.error("حدث خطأ غير متوقع");
      await supabase.auth.signOut();
      setLoading(false);
    }
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

      {showSetup && (
        <SetupHelp
          tableMissing={tableMissing}
          email={email}
          onGoToSetup={() => router.push("/admin/setup")}
        />
      )}
    </>
  );
}

function SetupHelp({
  tableMissing,
  email,
  onGoToSetup,
}: {
  tableMissing: boolean;
  email: string;
  onGoToSetup: () => void;
}) {
  return (
    <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl animate-fade-in">
      <div className="flex items-start gap-3 mb-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-amber-200 font-medium mb-2">
            {tableMissing
              ? "⚠️ جدول admin_users مش موجود في قاعدة البيانات"
              : "⚠️ الحساب ده مش أدمن"}
          </p>

          {tableMissing ? (
            <ol className="text-sm text-amber-300/90 space-y-1 mr-4 list-decimal">
              <li>افتح Supabase Dashboard</li>
              <li>روح SQL Editor</li>
              <li>شغّل Admin Schema SQL</li>
              <li>ارجع وجرب تاني</li>
            </ol>
          ) : (
            <p className="text-sm text-amber-300/90 mb-2">
              الحساب <code className="bg-slate-900 px-1.5 py-0.5 rounded">{email}</code>{" "}
              مش موجود في جدول الأدمن. لازم تضيفه يدوياً من Supabase.
            </p>
          )}

          <button
            onClick={onGoToSetup}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition text-sm"
          >
            <Database className="w-4 h-4" />
            افتح صفحة الإعداد
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>
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