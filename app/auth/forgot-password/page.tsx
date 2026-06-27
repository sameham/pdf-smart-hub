"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, CheckCircle2, FileText } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      toast.error("حدث خطأ. تأكد من البريد الإلكتروني.");
    } else {
      setSent(true);
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

          {!sent ? (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 items-center justify-center mb-4">
                  <Mail className="w-7 h-7 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  استعادة كلمة المرور
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  أدخل بريدك الإلكتروني وسنرسل لك رابط الاستعادة
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@email.com"
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />جاري الإرسال...</>
                  ) : (
                    <>إرسال رابط الاستعادة</>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                تم الإرسال!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                أرسلنا رابط استعادة كلمة المرور إلى:
              </p>
              <p className="font-medium text-blue-600 dark:text-blue-400 mb-6" dir="ltr">
                {email}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
                تحقق من صندوق الوارد والبريد المزعج. الرابط صالح لمدة ساعة.
              </p>
              <button
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
              >
                إرسال مرة أخرى
              </button>
              <div className="mt-4">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 dark:text-gray-400 transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
