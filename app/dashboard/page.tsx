"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, formatBytes } from "@/lib/utils";
import { FileText, Loader2, History, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  tool_type: string;
  file_name: string;
  file_size: number;
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      setUser(user);

      const { data, error } = await supabase
        .from("processing_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error(err);
      toast.error("فشل تحميل السجل");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العنصر؟")) return;
    try {
      const { error } = await supabase
        .from("processing_history")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setItems(items.filter((i) => i.id !== id));
      toast.success("تم الحذف");
    } catch {
      toast.error("فشل الحذف");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          مرحباً، {user?.user_metadata?.full_name || "مستخدم"}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          سجل عملياتك السابقة
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <History className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">إجمالي العمليات</p>
          </div>
          <p className="text-3xl font-bold">{items.length}</p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">عمليات اليوم</p>
          </div>
          <p className="text-3xl font-bold">
            {
              items.filter(
                (i) =>
                  new Date(i.created_at).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </p>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500">إجمالي المعالجة</p>
          </div>
          <p className="text-3xl font-bold">
            {formatBytes(items.reduce((acc, i) => acc + i.file_size, 0))}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">السجل الأخير</h2>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">
              لم تقم بأي عملية بعد. ابدأ الآن!
            </p>
            <Link
              href="/merge-pdf"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
            >
              ابدأ بأداة
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{item.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {item.tool_type} • {formatBytes(item.file_size)} •{" "}
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-red-500 transition"
                  aria-label="حذف"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}