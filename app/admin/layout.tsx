import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  // التحقق من admin role
  const { data: adminData } = await supabase
    .from("admin_users")
    .select("*")
    .eq("id", user.id)
    .eq("is_active", true)
    .single();

  if (!adminData) {
    redirect("/?error=unauthorized");
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="ltr">
      <AdminSidebar role={adminData.role} />
      <div className="lg:ml-64">
        <AdminHeader user={user} adminRole={adminData.role} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}