"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { imagesToPDF, type ImageToPDFOptions } from "@/lib/pdf/image-to-pdf";
import { logProcessingHistory } from "@/lib/pdf/history";
import { downloadBlob } from "@/lib/utils";
import { FileImage, Download, Lightbulb } from "lucide-react";
import { toast } from "sonner";

type PageSize = "A4" | "A3" | "Letter" | "Fit";
type Orientation = "portrait" | "landscape";

export default function ImageToPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("A4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState(20);

  const processor = async (
    input: { files: File[]; options: ImageToPDFOptions },
    onProgress?: (p: number) => void
  ) => {
    onProgress?.(40);
    const blob = await imagesToPDF(input.files, input.options);
    onProgress?.(100);
    return blob;
  };

  const { state, process } = usePDFProcessor(processor);

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error("يجب اختيار صورة واحدة على الأقل");
      return;
    }
    try {
      const blob = await process({
        files,
        options: { pageSize, orientation, margin },
      });

      const totalSize = files.reduce((sum, f) => sum + f.size, 0);
      await logProcessingHistory({
        toolType: "image-to-pdf",
        fileName: `images_${files.length}.pdf`,
        fileSize: totalSize,
        metadata: {
          images_count: files.length,
          page_size: pageSize,
          orientation,
          margin,
        },
      });

      downloadBlob(blob, "images.pdf");
      toast.success(`تم دمج ${files.length} صورة في PDF`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل التحويل");
    }
  };

  return (
    <ToolLayout
      icon={FileImage}
      title="صور إلى PDF"
      description="ادمج الصور في ملف PDF واحد"
      color="pink"
    >
      <FileUploader
        accept="image/jpeg,image/png,image/jpg"
        multiple
        files={files}
        onFilesChange={setFiles}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">حجم الصفحة</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
          >
            <option value="A4">A4 (الأكثر شيوعاً)</option>
            <option value="A3">A3 (كبير)</option>
            <option value="Letter">Letter (أمريكي)</option>
            <option value="Fit">ملاءمة الصورة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الاتجاه</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            disabled={pageSize === "Fit"}
          >
            <option value="portrait">طولي (Portrait)</option>
            <option value="landscape">عرضي (Landscape)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            الهامش: {margin}px
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={margin}
            onChange={(e) => setMargin(parseInt(e.target.value))}
            className="w-full accent-pink-600"
            disabled={pageSize === "Fit"}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="p-3 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-lg text-sm text-pink-700 dark:text-pink-300">
          📷 سيتم إنشاء PDF يحتوي على <strong>{files.length}</strong> صفحة
          {pageSize === "Fit" ? " (كل صورة بصفحة كاملة)" : ""}
        </div>
      )}

      <ProcessingStatus state={state} />

      <button
        onClick={handleConvert}
        disabled={files.length === 0 || state.status === "processing"}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-pink-500/20"
      >
        <Download className="w-5 h-5" />
        تحويل وتحميل PDF
      </button>

      <div className="p-4 bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 rounded-xl">
        <div className="flex items-start gap-2 text-sm text-pink-700 dark:text-pink-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">💡 نصائح:</p>
            <ul className="space-y-1 text-xs">
              <li>• مدعوم: JPG, PNG</li>
              <li>• ترتيب الصور = ترتيب الصفحات في PDF</li>
              <li>• استخدم "ملاءمة الصورة" للصور المختلفة الأحجام</li>
              <li>• كل صورة تصبح صفحة منفصلة</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}