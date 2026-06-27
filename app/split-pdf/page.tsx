"use client";

import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { ToolLayout } from "@/components/ToolLayout";
import { usePDFProcessor } from "@/hooks/usePDFProcessor";
import { splitPDF, type SplitRange } from "@/lib/pdf/split";
import { logProcessingHistory } from "@/lib/pdf/history";
import { downloadMultipleBlobs } from "@/lib/utils";
import { Split, Download, Plus, Trash2, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function SplitPDFPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState<SplitRange[]>([{ from: 1, to: 1 }]);

  const processor = async (
    input: { file: File; ranges: SplitRange[] },
    onProgress?: (p: number) => void
  ) => {
    onProgress?.(30);
    const results = await splitPDF(input.file, input.ranges);
    onProgress?.(100);
    return results;
  };

  const { state, process } = usePDFProcessor(processor);

  const handleSplit = async () => {
    if (files.length !== 1) {
      toast.error("يجب اختيار ملف PDF واحد فقط");
      return;
    }
    const valid = ranges.every((r) => r.from > 0 && r.to >= r.from);
    if (!valid) {
      toast.error("تأكد من صحة النطاقات (من يجب أن يكون أقل من أو يساوي إلى)");
      return;
    }
    try {
      const results = await process({ file: files[0], ranges });
      downloadMultipleBlobs(results);

      await logProcessingHistory({
        toolType: "split",
        fileName: files[0].name,
        fileSize: files[0].size,
        metadata: {
          ranges_count: ranges.length,
          ranges: ranges,
          output_files: results.length,
        },
      });

      toast.success(`تم التقسيم إلى ${results.length} ملف`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "فشل التقسيم");
    }
  };

  const addRange = () => setRanges([...ranges, { from: 1, to: 1 }]);
  const removeRange = (idx: number) =>
    setRanges(ranges.filter((_, i) => i !== idx));
  const updateRange = (
    idx: number,
    key: "from" | "to",
    value: number
  ) => {
    setRanges(
      ranges.map((r, i) => (i === idx ? { ...r, [key]: value } : r))
    );
  };

  return (
    <ToolLayout
      icon={Split}
      title="تقسيم ملف PDF"
      description="قسّم ملف PDF إلى عدة ملفات بناءً على نطاقات الصفحات"
      color="purple"
    >
      <FileUploader
        accept=".pdf,application/pdf"
        multiple={false}
        files={files}
        onFilesChange={setFiles}
      />

      {files.length === 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">نطاقات الصفحات</label>
            <button
              onClick={addRange}
              className="text-sm flex items-center gap-1 text-purple-600 hover:underline"
            >
              <Plus className="w-4 h-4" />
              إضافة نطاق
            </button>
          </div>

          {ranges.map((range, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-500 w-16">
                النطاق {idx + 1}
              </span>
              <input
                type="number"
                min={1}
                value={range.from}
                onChange={(e) =>
                  updateRange(idx, "from", parseInt(e.target.value) || 1)
                }
                placeholder="من"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-center"
              />
              <span className="text-gray-400">إلى</span>
              <input
                type="number"
                min={1}
                value={range.to}
                onChange={(e) =>
                  updateRange(idx, "to", parseInt(e.target.value) || 1)
                }
                placeholder="إلى"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-center"
              />
              {ranges.length > 1 && (
                <button
                  onClick={() => removeRange(idx)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-red-500"
                  aria-label="حذف النطاق"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <ProcessingStatus state={state} />

      <button
        onClick={handleSplit}
        disabled={files.length !== 1 || state.status === "processing"}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition shadow-lg shadow-purple-500/20"
      >
        <Download className="w-5 h-5" />
        تقسيم وتحميل الملفات
      </button>

      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-xl">
        <div className="flex items-start gap-2 text-sm text-purple-700 dark:text-purple-300">
          <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">💡 أمثلة:</p>
            <ul className="space-y-1 text-xs">
              <li>• نطاق واحد (1 إلى 5) → ملف بصفحات 1-5</li>
              <li>• نطاقين (1-3, 5-7) → ملفين منفصلين</li>
              <li>• كل صفحة لوحدها: أضف نطاقات (1-1, 2-2, 3-3)</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}