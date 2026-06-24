"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { mergePDFs } from "@/lib/pdf/merge";
import { downloadBlob } from "@/lib/utils";
import { Combine, Download } from "lucide-react";
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
      downloadBlob(blob, "merged.pdf");
      toast.success("تم الدمج بنجاح!");
    } catch (err) {
      toast.error("فشل الدمج");
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
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-brand-500/20"
      >
        <Download className="w-5 h-5" />
        دمج الملفات وتحميل النتيجة
      </button>

      {files.length === 0 && (
        <p className="text-center text-sm text-gray-500">
          💡 نصيحة: يمكنك ترتيب الملفات قبل الدمج باستخدام الأسهم
        </p>
      )}
    </ToolLayout>
  );
}