"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { mergePDFs } from "@/lib/pdf/merge";
import { logProcessingHistory } from "@/lib/pdf/history";
import { downloadBlob } from "@/lib/utils";
import { Combine, Download, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function MergePDFPage() {
  const [files, setFiles] = useState<File[]>([]);

  const processor = async (
    input: File[],
    onProgress?: (p: number) => void
  ) => {
    onProgress?.(20);
    const result = await mergePDFs(input);
    onProgress?.(100);
    return result;
  };

  const { state, process } = usePDFProcessor(processor);

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error("يجب اختيار ملفين على الأقل");
      return;
    }
    try {
      const blob = await process(files);
      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      const filename = `merged_${Date.now()}.pdf`;

      downloadBlob(blob, "merged.pdf");

      // حفظ في السجل
      await logProcessingHistory({
        toolType: "merge",
        fileName: filename,
        fileSize: totalSize,
        metadata: {
          files_count: files.length,
          original_files: files.map((f) => f.name),
        },
      });

      toast.success(`تم دمج ${files.length} ملفات بنجاح!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الدمج");
    }
  };

  return (
    <ToolLayout
      icon={Combine}
      title="دمج ملفات PDF"
      description="ادمج عدة ملفات PDF في ملف واحد بسرعة وسهولة"
      color="blue"
    >
      <FileUploader
        accept=".pdf,application/pdf"
        multiple
        files={files}
        onFilesChange={setFiles}
      />

      <ProcessingStatus state={state} />

      <button
        onClick={handleMerge}
        disabled={files.length < 2 || state.status === "processing"}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-blue-500/20"
      >
        <Download className="w-5 h-5" />
        دمج {files.length > 0 && `(${files.length} ملف)`} وتحميل النتيجة
      </button>

      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl">
        <div className="flex items-start gap-2 text-sm text-blue-700 dark:text-blue-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">💡 نصائح:</p>
            <ul className="space-y-1 text-xs">
              <li>• يمكنك ترتيب الملفات قبل الدمج باستخدام الأسهم</li>
              <li>• كل المعالجة تتم داخل متصفحك - ملفاتك آمنة</li>
              <li>• الحد الأقصى لكل ملف 50 ميجابايت</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}