"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { pdfToImages } from "@/lib/pdf/pdf-to-image";
import { logProcessingHistory } from "@/lib/pdf/history";
import { downloadMultipleBlobs } from "@/lib/utils";
import { Image, Download, Lightbulb } from "lucide-react";
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

      const totalSize = results.reduce((sum, r) => sum + r.blob.size, 0);
      await logProcessingHistory({
        toolType: "pdf-to-image",
        fileName: files[0].name,
        fileSize: files[0].size,
        metadata: {
          format,
          scale,
          pages_converted: results.length,
          output_size: totalSize,
        },
      });

      toast.success(`تم تحويل ${results.length} صفحة بنجاح`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل التحويل");
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">الصيغة</label>
              <div className="grid grid-cols-2 gap-2">
                {(["png", "jpeg"] as Format[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                      format === f
                        ? "border-orange-500 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="text-sm">
                      {f === "png" ? "PNG" : "JPG"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {f === "png" ? "بدون فقدان" : "حجم أصغر"}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                الدقة: {scale}x ({Math.round(scale * 72)} DPI)
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
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>منخفضة (72 DPI)</span>
                <span>عالية جداً (288 DPI)</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <strong>تقدير:</strong> سيتم إنشاء {scale >= 2 ? "صور كبيرة" : "صور متوسطة"} بدقة {Math.round(scale * 72)} DPI
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

      <div className="p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-xl">
        <div className="flex items-start gap-2 text-sm text-orange-700 dark:text-orange-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">💡 نصائح:</p>
            <ul className="space-y-1 text-xs">
              <li>• PNG للجودة العالية بدون فقدان</li>
              <li>• JPG لحجم أصغر (مناسب للمشاركة)</li>
              <li>• الدقة 2x كافية للعرض، 4x للطباعة</li>
              <li>• كل صفحة ستحفظ كصورة منفصلة</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}