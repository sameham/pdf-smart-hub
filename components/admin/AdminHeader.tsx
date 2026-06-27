"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  LogOut,
  User,
  Menu,
  Shield,
} from "lucide-react";
import { createClient } from "@/lib/supabase";
import { toast } from "sonner";

interface AdminHeaderProps {
  user: { email?: string };
  adminRole: string;
}

export function AdminHeader({ user, adminRole }: AdminHeaderProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search users, settings, logs..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent rounded-lg focus:bg-white dark:focus:bg-gray-950 focus:border-purple-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Shield className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
              {adminRole}
            </span>
          </div>

          <button
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
                {user.email?.[0]?.toUpperCase() || "A"}
              </div>
            </button>

            {open && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-xl z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-medium truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{adminRole}</p>
                  </div>
                  <div className="p-1">
                    <button
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}