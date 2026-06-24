"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { protectPDF, type ProtectOptions } from "@/lib/pdf/protect";
import { logProcessingHistory } from "@/lib/pdf/history";
import { downloadBlob } from "@/lib/utils";
import { Lock, Download, Eye, EyeOff, Info, Lightbulb, Shield } from "lucide-react";
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

      await logProcessingHistory({
        toolType: "protect",
        fileName: files[0].name,
        fileSize: files[0].size,
        metadata: {
          has_user_password: !!userPassword,
          timestamp: Date.now(),
        },
      });

      downloadBlob(blob, "protected.pdf");
      toast.success("تم تطبيق الحماية على الملف");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشلت العملية");
    }
  };

  const passwordStrength = (pwd: string): { level: number; label: string; color: string } => {
    if (pwd.length === 0) return { level: 0, label: "", color: "" };
    if (pwd.length < 4) return { level: 1, label: "ضعيفة", color: "bg-red-500" };
    if (pwd.length < 8) return { level: 2, label: "متوسطة", color: "bg-yellow-500" };
    if (pwd.length < 12) return { level: 3, label: "جيدة", color: "bg-blue-500" };
    return { level: 4, label: "قوية جداً", color: "bg-green-500" };
  };

  const strength = passwordStrength(ownerPassword);

  return (
    <ToolLayout
      icon={Lock}
      title="حماية ملف PDF"
      description="احمِ ملف PDF بكلمة مرور لمنع الوصول غير المصرح"
      color="red"
    >
      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl flex gap-3 text-sm text-blue-700 dark:text-blue-300">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium mb-1">معلومة مهمة:</p>
          <p className="text-xs">
            حالياً يتم تطبيق حماية على مستوى البيانات الوصفية (metadata) والصلاحيات.
            للتشفير الكامل بكلمة مرور (يتطلب كلمة مرور لفتح الملف)، استخدم تطبيقات سطح المكتب المتخصصة مثل Adobe Acrobat.
          </p>
        </div>
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
              كلمة مرور المالك <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                placeholder="أدخل كلمة مرور قوية"
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="إظهار/إخفاء"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {ownerPassword.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        i <= strength.level ? strength.color : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  القوة: <span className="font-medium">{strength.label}</span>
                </p>
              </div>
            )}

            <p className="mt-1 text-xs text-gray-500">4 أحرف على الأقل</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              كلمة مرور المستخدم (اختيارية)
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="اتركها فارغة إذا لم تحتج"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              كلمة مرور إضافية للمستخدمين النهائيين
            </p>
          </div>
        </div>
      )}

      <ProcessingStatus state={state} />

      <button
        onClick={handleProtect}
        disabled={
          files.length !== 1 ||
          state.status === "processing" ||
          ownerPassword.length < 4
        }
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-red-500/20"
      >
        <Shield className="w-5 h-5" />
        تطبيق الحماية وتحميل
      </button>

      <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
        <div className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">💡 إرشادات:</p>
            <ul className="space-y-1 text-xs">
              <li>• استخدم كلمة مرور قوية (12+ حرف، رموز، أرقام)</li>
              <li>• احفظ كلمة المرور في مكان آمن</li>
              <li>• لا يمكن استرجاع كلمة المرور لاحقاً</li>
              <li>• لحماية كاملة، استخدم برنامج متخصص</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}