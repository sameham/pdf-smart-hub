import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  let adminData = null;

  try {
    const supabase = createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;

    if (user) {
      const { data: admin } = await supabase
        .from("admin_users")
        .select("*")
        .eq("id", user.id)
        .eq("is_active", true)
        .single();
      adminData = admin;
    }
  } catch (err) {
    console.error("Admin layout error:", err);
  }

  // صفحة الـ login مش محتاجة تحقق
  // لكن باقي صفحات الأدمن محتاجة
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="ltr">
      {user && adminData ? (
        <>
          <AdminSidebar role={adminData.role} />
          <div className="lg:ml-64">
            <AdminHeader user={user} adminRole={adminData.role} />
            <main className="p-6">{children}</main>
          </div>
        </>
      ) : (
        // لو مش مسجل دخول أو مش أدمن، اعرض المحتوى مباشرة
        // (Middleware هيتحقق من الصلاحيات)
        <>{children}</>
      )}
    </div>
  );
}