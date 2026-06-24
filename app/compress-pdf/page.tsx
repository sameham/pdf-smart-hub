"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { compressPDF } from "@/lib/pdf/compress";
import { logProcessingHistory } from "@/lib/pdf/history";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Minimize2, Download, TrendingDown, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function CompressPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{
    blob: Blob;
    original: number;
    compressed: number;
  } | null>(null);

  const processor = async (
    input: File,
    onProgress?: (p: number) => void
  ) => {
    onProgress?.(30);
    const compressed = await compressPDF(input);
    onProgress?.(100);
    return compressed;
  };

  const { state, process } = usePDFProcessor(processor);

  const handleCompress = async () => {
    if (files.length !== 1) {
      toast.error("يجب اختيار ملف PDF واحد فقط");
      return;
    }
    try {
      const blob = await process(files[0]);
      const originalSize = files[0].size;
      const compressedSize = blob.size;
      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

      setResult({ blob, original: originalSize, compressed: compressedSize });

      await logProcessingHistory({
        toolType: "compress",
        fileName: files[0].name,
        fileSize: originalSize,
        metadata: {
          compressed_size: compressedSize,
          reduction_percent: parseFloat(reduction),
        },
      });

      toast.success(`تم الضغط بنجاح! تقليل ${reduction}%`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل الضغط");
    }
  };

  const downloadCompressed = () => {
    if (result) {
      downloadBlob(result.blob, "compressed.pdf");
    }
  };

  return (
    <ToolLayout
      icon={Minimize2}
      title="ضغط ملف PDF"
      description="قلّل حجم ملف PDF مع الحفاظ على الجودة"
      color="green"
    >
      <FileUploader
        accept=".pdf,application/pdf"
        multiple={false}
        files={files}
        onFilesChange={(f) => {
          setFiles(f);
          setResult(null);
        }}
      />

      {result && (
        <div className="p-5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl animate-fade-in">
          <div className="flex items-center gap-2 mb-3 text-green-700 dark:text-green-300 font-medium">
            <TrendingDown className="w-5 h-5" />
            <span>نتيجة الضغط</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500 mb-1">الحجم الأصلي</p>
              <p className="font-bold text-lg">{formatBytes(result.original)}</p>
            </div>
            <div className="text-center border-x border-green-200 dark:border-green-800">
              <p className="text-gray-500 mb-1">الحجم الجديد</p>
              <p className="font-bold text-lg text-green-600">
                {formatBytes(result.compressed)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 mb-1">التقليل</p>
              <p className="font-bold text-lg text-green-600">
                {((1 - result.compressed / result.original) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
          {result.compressed >= result.original && (
            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400">
              ⚠️ الملف الأصلي صغير بالفعل، الضغط لم يخفض الحجم بشكل ملحوظ
            </p>
          )}
        </div>
      )}

      <ProcessingStatus state={state} />

      {result ? (
        <button
          onClick={downloadCompressed}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition shadow-lg shadow-green-500/20"
        >
          <Download className="w-5 h-5" />
          تحميل الملف المضغوط
        </button>
      ) : (
        <button
          onClick={handleCompress}
          disabled={files.length !== 1 || state.status === "processing"}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-green-500/20"
        >
          <Minimize2 className="w-5 h-5" />
          ابدأ الضغط
        </button>
      )}

      <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl">
        <div className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">💡 كيف يعمل الضغط؟</p>
            <ul className="space-y-1 text-xs">
              <li>• يعيد بناء هيكل PDF بإعدادات محسّنة</li>
              <li>• يحافظ على جودة المحتوى (نصوص وصور)</li>
              <li>• أفضل نتيجة مع ملفات تحتوي على صور كبيرة</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}