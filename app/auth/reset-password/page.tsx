"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, FileText, AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Supabase يضع session في URL hash بعد النقر على رابط الاستعادة
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSessionReady(true);
      } else {
        setError("الرابط منتهي الصلاحية أو غير صالح. طلب رابطاً جديداً.");
      }
    });

    // استماع لحدث تسجيل الدخول عبر الرابط
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setSessionReady(true);
        setError("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const strengthLevel = (pwd: string) => {
    if (!pwd) return { level: 0, label: "", color: "" };
    if (pwd.length < 6)  return { level: 1, label: "ضعيفة جداً", color: "bg-red-500" };
    if (pwd.length < 8)  return { level: 2, label: "ضعيفة", color: "bg-orange-500" };
    if (pwd.length < 12) return { level: 3, label: "متوسطة", color: "bg-yellow-500" };
    return { level: 4, label: "قوية", color: "bg-green-500" };
  };

  const strength = strengthLevel(password);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    if (password !== confirm) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("فشل تحديث كلمة المرور. جرّب مرة أخرى.");
    } else {
      setDone(true);
      toast.success("تم تغيير كلمة المرور بنجاح!");
      setTimeout(() => router.push("/auth/login"), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            PDF Smart Hub
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">

          {done ? (
            /* Success */
            <div className="text-center py-4">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                تم تغيير كلمة المرور!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                جاري تحويلك لصفحة تسجيل الدخول...
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition"
              >
                تسجيل الدخول الآن
              </Link>
            </div>

          ) : error ? (
            /* Error / expired link */
            <div className="text-center py-4">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/30 items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                الرابط غير صالح
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{error}</p>
              <Link
                href="/auth/forgot-password"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition"
              >
                طلب رابط جديد
              </Link>
            </div>

          ) : !sessionReady ? (
            /* Loading */
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">جاري التحقق من الرابط...</p>
            </div>

          ) : (
            /* Form */
            <>
              <div className="text-center mb-6">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mb-4">
                  <Lock className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  كلمة مرور جديدة
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  أدخل كلمة المرور الجديدة
                </p>
              </div>

              <form onSubmit={handleReset} className="space-y-4">
                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    كلمة المرور الجديدة
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pr-10 pl-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1,2,3,4].map((i) => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${i <= strength.level ? strength.color : "bg-gray-200 dark:bg-gray-700"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">قوة كلمة المرور: <span className="font-medium">{strength.label}</span></p>
                    </div>
                  )}
                </div>

                {/* Confirm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    تأكيد كلمة المرور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pr-10 pl-4 py-3 rounded-xl border bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition
                        ${confirm && password !== confirm
                          ? "border-red-400 dark:border-red-600"
                          : "border-gray-200 dark:border-gray-700"}`}
                    />
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-red-500 mt-1">كلمتا المرور غير متطابقتين</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || password !== confirm || password.length < 6}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />جاري الحفظ...</>
                  ) : (
                    "حفظ كلمة المرور الجديدة"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
