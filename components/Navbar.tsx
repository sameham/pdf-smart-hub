"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, FileText, LayoutDashboard, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch {
        setUser(null);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    setUser(null);
    router.refresh();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-xl">PDF Smart Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/merge-pdf"
              className="text-sm font-medium hover:text-brand-600 transition"
            >
              الأدوات
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-brand-600 transition"
            >
              عن التطبيق
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium hover:text-brand-600 transition"
            >
              الأسعار
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {mounted && user ? (
              <>
                <Link
                  href="/dashboard"
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                  aria-label="لوحة التحكم"
                >
                  <LayoutDashboard className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  خروج
                </button>
              </>
            ) : mounted ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium transition"
                >
                  دخول
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition"
                >
                  حساب جديد
                </Link>
              </>
            ) : (
              <div className="w-32 h-9" />
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="القائمة"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-slide-up">
            <div className="flex flex-col gap-1">
              <Link
                href="/merge-pdf"
                onClick={() => setOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                الأدوات
              </Link>
              <Link
                href="/about"
                onClick={() => setOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                عن التطبيق
              </Link>
              <Link
                href="/pricing"
                onClick={() => setOpen(false)}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                الأسعار
              </Link>
              {mounted && user ? (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    لوحة التحكم
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-red-600"
                  >
                    تسجيل خروج
                  </button>
                </>
              ) : mounted ? (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    تسجيل دخول
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 bg-brand-600 text-white rounded-lg text-center"
                  >
                    حساب جديد
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}