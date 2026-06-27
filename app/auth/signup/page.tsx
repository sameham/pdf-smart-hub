"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, FileText, Mail, Lock, User } from "lucide-react";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("تم إنشاء الحساب بنجاح!");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
            <FileText className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">أنشئ حسابك</h1>
          <p className="text-gray-600 dark:text-gray-400">
            واحصل على سجل لعملياتك
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">
                الاسم الكامل
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="محمد أحمد"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 pl-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                  placeholder="6 أحرف على الأقل"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              إنشاء الحساب
            </button>

            <p className="text-xs text-center text-gray-500">
              بإنشائك حسابك فأنت توافق على{" "}
              <Link href="#" className="underline">
                الشروط
              </Link>{" "}
              و{" "}
              <Link href="#" className="underline">
                سياسة الخصوصية
              </Link>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          لديك حساب؟{" "}
          <Link
            href="/auth/login"
            className="text-brand-600 hover:underline font-medium"
          >
            سجل دخولك
          </Link>
        </p>
      </div>
    </div>
  );
}