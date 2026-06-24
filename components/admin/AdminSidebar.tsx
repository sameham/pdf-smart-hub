"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Wrench,
  ScrollText,
  Key,
  Shield,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  {
    title: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "moderator", "support"],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
    roles: ["super_admin", "admin", "moderator"],
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Tools Monitor",
    href: "/admin/tools",
    icon: Wrench,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Audit Log",
    href: "/admin/audit",
    icon: ScrollText,
    roles: ["super_admin", "admin"],
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
    roles: ["super_admin"],
  },
  {
    title: "API Keys",
    href: "/admin/api-keys",
    icon: Key,
    roles: ["super_admin"],
  },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const allowedItems = MENU_ITEMS.filter((item) => item.roles.includes(role));

  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-slate-900 border-l border-slate-800 z-40 hidden lg:block">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-slate-400">{role}</p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {allowedItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition",
                    isActive
                      ? "bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.title}
                  {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white transition"
          >
            ← العودة للموقع
          </Link>
        </div>
      </div>
    </aside>
  );
}