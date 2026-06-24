"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { imagesToPDF, type ImageToPDFOptions } from "@/lib/pdf/image-to-pdf";
import { downloadBlob } from "@/lib/utils";
import { FileImage, Download } from "lucide-react";
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
      downloadBlob(blob, "images.pdf");
      toast.success("تم التحويل بنجاح!");
    } catch {
      toast.error("فشل التحويل");
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

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">حجم الصفحة</label>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as PageSize)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="A4">A4</option>
            <option value="A3">A3</option>
            <option value="Letter">Letter</option>
            <option value="Fit">ملائمة الصورة</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">الاتجاه</label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            disabled={pageSize === "Fit"}
          >
            <option value="portrait">طولي</option>
            <option value="landscape">عرضي</option>
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

      <ProcessingStatus state={state} />

      <button
        onClick={handleConvert}
        disabled={files.length === 0 || state.status === "processing"}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-pink-500/20"
      >
        <Download className="w-5 h-5" />
        تحويل وتحميل PDF
      </button>
    </ToolLayout>
  );
}