"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { pdfToImages } from "@/lib/pdf/pdf-to-image";
import { downloadMultipleBlobs } from "@/lib/utils";
import { Image, Download } from "lucide-react";
import { toast } from "sonner";

type Format = "png" | "jpeg";

export default function PDFToImagePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<Format>("png");
  const [scale, setScale] = useState(2);

  const processor = async (
    input: { file: File; format: Format; scale: number },
    onProgress?: (p: number) => void
  ) => {
    const results = await pdfToImages(
      input.file,
      { format: input.format, scale: input.scale },
      onProgress
    );
    return results;
  };

  const { state, process } = usePDFProcessor(processor);

  const handleConvert = async () => {
    if (files.length !== 1) {
      toast.error("يجب اختيار ملف PDF واحد");
      return;
    }
    try {
      const results = await process({ file: files[0], format, scale });
      downloadMultipleBlobs(results);
      toast.success(`تم تحويل ${results.length} صفحة`);
    } catch {
      toast.error("فشل التحويل");
    }
  };

  return (
    <ToolLayout
      icon={Image}
      title="PDF إلى صورة"
      description="حوّل صفحات ملف PDF إلى صور JPG أو PNG"
      color="orange"
    >
      <FileUploader
        accept=".pdf,application/pdf"
        multiple={false}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length === 1 && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">الصيغة</label>
            <div className="grid grid-cols-2 gap-2">
              {(["png", "jpeg"] as Format[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`px-4 py-2.5 rounded-lg border-2 font-medium transition ${
                    format === f
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                  }`}
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              الدقة: {scale}x
            </label>
            <input
              type="range"
              min="1"
              max="4"
              step="0.5"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full accent-orange-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>منخفضة</span>
              <span>عالية</span>
            </div>
          </div>
        </div>
      )}

      <ProcessingStatus state={state} />

      <button
        onClick={handleConvert}
        disabled={files.length !== 1 || state.status === "processing"}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-orange-500/20"
      >
        <Download className="w-5 h-5" />
        تحويل وتحميل الصور
      </button>
    </ToolLayout>
  );
}