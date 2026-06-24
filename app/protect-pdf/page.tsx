"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { protectPDF, type ProtectOptions } from "@/lib/pdf/protect";
import { downloadBlob } from "@/lib/utils";
import { Lock, Download, Eye, EyeOff, Info } from "lucide-react";
import { toast } from "sonner";

export default function ProtectPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [ownerPassword, setOwnerPassword] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const processor = async (
    input: { file: File; options: ProtectOptions },
    onProgress?: (p: number) => void
  ) => {
    onProgress?.(40);
    const blob = await protectPDF(input.file, input.options);
    onProgress?.(100);
    return blob;
  };

  const { state, process } = usePDFProcessor(processor);

  const handleProtect = async () => {
    if (files.length !== 1) {
      toast.error("يجب اختيار ملف PDF واحد");
      return;
    }
    if (ownerPassword.length < 4) {
      toast.error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
      return;
    }
    try {
      const blob = await process({
        file: files[0],
        options: { ownerPassword, userPassword: userPassword || undefined },
      });
      downloadBlob(blob, "protected.pdf");
      toast.success("تم تطبيق الحماية!");
    } catch {
      toast.error("فشلت العملية");
    }
  };

  return (
    <ToolLayout
      icon={Lock}
      title="حماية ملف PDF"
      description="احمِ ملف PDF بكلمة مرور لمنع الوصول غير المصرح"
      color="red"
    >
      <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg flex gap-2 text-sm text-amber-700 dark:text-amber-300">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          حالياً يتم تطبيق حماية على مستوى البيانات الوصفية. للتشفير الكامل،
          استخدم تطبيقات سطح المكتب المتخصصة.
        </p>
      </div>

      <FileUploader
        accept=".pdf,application/pdf"
        multiple={false}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length === 1 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              كلمة مرور المالك (مطلوبة)
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="أدخل كلمة مرور قوية"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label="إظهار/إخفاء"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              4 أحرف على الأقل
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              كلمة مرور المستخدم (اختيارية)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="كلمة مرور لفتح الملف"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}

      <ProcessingStatus state={state} />

      <button
        onClick={handleProtect}
        disabled={
          files.length !== 1 || state.status === "processing" || ownerPassword.length < 4
        }
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-red-500/20"
      >
        <Download className="w-5 h-5" />
        تطبيق الحماية وتحميل
      </button>
    </ToolLayout>
  );
}