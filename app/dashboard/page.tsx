"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { formatDate, formatBytes } from "@/lib/utils";
import { FileText, Loader2, History, Trash2, AlertCircle, RefreshCw, Database } from "lucide-react";
import { toast } from "sonner";

interface HistoryItem {
  id: string;
  tool_type: string;
  file_name: string;
  file_size: number;
  status: string;
  created_at: string;
}

const SCHEMA_SQL = `-- PDF Smart Hub Database Schema
CREATE TABLE IF NOT EXISTS public.processing_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_type text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'completed',
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS processing_history_user_id_idx
  ON public.processing_history(user_id);

ALTER TABLE public.processing_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own history" ON public.processing_history;
CREATE POLICY "Users can view own history"
  ON public.processing_history FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own history" ON public.processing_history;
CREATE POLICY "Users can insert own history"
  ON public.processing_history FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own history" ON public.processing_history;
CREATE POLICY "Users can delete own history"
  ON public.processing_history FOR DELETE USING (auth.uid() = user_id);`;

export default function DashboardPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [tableMissing, setTableMissing] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setDbError(null);
      setTableMissing(false);

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

      if (error) {
        // Check if table doesn't exist
        if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
          setTableMissing(true);
          setDbError("جدول السجل غير موجود في قاعدة البيانات");
          setItems([]);
          return;
        }
        throw error;
      }
      setItems(data || []);
    } catch (err) {
      console.error(err);
      setDbError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
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

  const copySchema = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    toast.success("تم نسخ SQL - الصقه في Supabase SQL Editor");
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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            مرحباً، {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "مستخدم"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            سجل عملياتك السابقة
          </p>
        </div>
        <button
          onClick={loadData}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          aria-label="تحديث"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Database Error Alert */}
      {tableMissing && (
        <div className="mb-8 p-6 bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-900 rounded-2xl">
          <div className="flex items-start gap-3 mb-4">
            <Database className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-1">
                جدول قاعدة البيانات غير موجود
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                لازم تشغّل الـ schema في Supabase Dashboard قبل ما السجل يشتغل. اتبع الخطوات دي:
              </p>
              <ol className="text-sm text-amber-700 dark:text-amber-300 space-y-2 mb-4 mr-4">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span>
                    افتح{" "}
                    <a
                      href="https://supabase.com/dashboard/project/zijqrpevpzgjtttmjwlt/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium"
                    >
                      Supabase SQL Editor
                    </a>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span>انسخ الـ SQL من الزر ده والصقه في الـ Editor</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span>اضغط Run</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span>ارجع هنا واضغط تحديث</span>
                </li>
              </ol>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copySchema}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  نسخ SQL Schema
                </button>
                <a
                  href="https://supabase.com/dashboard/project/zijqrpevpzgjtttmjwlt/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg font-medium transition"
                >
                  افتح Supabase SQL Editor
                </a>
                <button
                  onClick={loadData}
                  className="px-4 py-2 bg-white dark:bg-gray-800 border border-amber-300 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg font-medium transition flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  تحديث
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {!tableMissing && (
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
      )}

      {/* History List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold">السجل الأخير</h2>
        </div>

        {items.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-6">
              {tableMissing
                ? "شغّل الـ schema في Supabase أولاً"
                : "لم تقم بأي عملية بعد. ابدأ الآن!"}
            </p>
            {!tableMissing && (
              <Link
                href="/merge-pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg transition"
              >
                ابدأ بأداة
              </Link>
            )}
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