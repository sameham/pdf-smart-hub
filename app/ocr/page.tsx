"use client";

import { useState, useRef } from "react";
import { ScanText, Download, CheckCircle, FileUp, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [progress, setProgress] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error("يرجى رفع ملف PDF أو صورة (PNG, JPG, WebP)");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز الحد المسموح (50MB)");
      return;
    }
    setFile(selectedFile);
    setExtractedText("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const extractFromImage = async (imageBlob: Blob, label: string): Promise<string> => {
    const Tesseract = await import("tesseract.js");
    const result = await Tesseract.recognize(imageBlob, "ara+eng", {
      logger: (m) => {
        if (m.status === "recognizing text") {
          setProgress(`${label} — ${Math.round((m.progress || 0) * 100)}%`);
        }
      },
    });
    return result.data.text;
  };

  const handleExtract = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress("جاري تحضير الملف...");
    try {
      if (file.type === "application/pdf") {
        // Try pdfjs text extraction first
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPageCount(pdf.numPages);

        let fullText = "";
        let hasText = false;

        // Try text extraction
        for (let i = 1; i <= pdf.numPages; i++) {
          setProgress(`استخراج نص الصفحة ${i} من ${pdf.numPages}...`);
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((item: any) => item.str ?? "")
            .filter((s: string) => s.trim())
            .join(" ");
          if (pageText.trim()) {
            hasText = true;
            fullText += `\n\n═══ صفحة ${i} من ${pdf.numPages} ═══\n${pageText}`;
          }
        }

        if (hasText) {
          setExtractedText(fullText.trim());
          toast.success(`تم استخراج النص من ${pdf.numPages} صفحة`);
        } else {
          // Fallback to OCR via canvas rendering
          setProgress("الملف ممسوح ضوئياً — جاري تطبيق OCR...");
          let ocrText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            setProgress(`OCR صفحة ${i} من ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 2 });
            const canvas = document.createElement("canvas");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext("2d")!;
            await page.render({ canvasContext: ctx, viewport }).promise;
            const blob = await new Promise<Blob>((res, rej) =>
              canvas.toBlob((b) => (b ? res(b) : rej(new Error("canvas error"))), "image/png")
            );
            const text = await extractFromImage(blob, `صفحة ${i}/${pdf.numPages}`);
            if (text.trim()) {
              ocrText += `\n\n═══ صفحة ${i} من ${pdf.numPages} ═══\n${text}`;
            }
          }
          setExtractedText(ocrText.trim() || "لم يتم العثور على نص في الملف.");
          toast.success("اكتمل OCR");
        }
      } else {
        // Image file
        setProgress("جاري تطبيق OCR على الصورة...");
        const text = await extractFromImage(file, "الصورة");
        setExtractedText(text.trim() || "لم يتم العثور على نص في الصورة.");
        toast.success("تم استخراج النص بنجاح!");
      }
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء الاستخراج.");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    toast.success("تم نسخ النص!");
  };

  const handleDownload = () => {
    const blob = new Blob([extractedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (file?.name || "extracted").replace(/\.\w+$/, "") + "-text.txt";
    a.click();
  };

  const reset = () => {
    setFile(null);
    setExtractedText("");
    setPageCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
            <ScanText className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">استخراج النصوص (OCR)</h1>
          <p className="text-gray-600 text-lg">
            استخرج النصوص من ملفات PDF والصور بما فيها الممسوحة ضوئياً
          </p>
        </div>

        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragging ? "border-purple-500 bg-purple-50" : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">اسحب ملف PDF أو صورة هنا</p>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار الملف</p>
            <span className="bg-purple-600 text-white px-6 py-2 rounded-lg text-sm font-medium">اختر الملف</span>
            <p className="text-xs text-gray-400 mt-3">PDF, PNG, JPG, WebP — الحد الأقصى 50MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        )}

        {file && !extractedText && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ScanText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">تغيير</button>
            </div>

            {isProcessing && progress && (
              <div className="flex items-center gap-2 mb-4 text-sm text-purple-600 bg-purple-50 rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress}
              </div>
            )}

            <button
              onClick={handleExtract}
              disabled={isProcessing}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" />جاري الاستخراج...</>
              ) : (
                <><ScanText className="w-5 h-5" />استخراج النصوص</>
              )}
            </button>
          </div>
        )}

        {extractedText && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h2 className="text-lg font-bold text-gray-900">
                  تم الاستخراج{pageCount > 0 ? ` (${pageCount} صفحة)` : ""}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Copy className="w-4 h-4" />نسخ
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />تنزيل
                </button>
                <button onClick={reset} className="text-sm text-gray-400 hover:text-gray-600 px-2">
                  ملف آخر
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto text-sm text-gray-800 font-mono whitespace-pre-wrap leading-relaxed" dir="auto">
              {extractedText}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: "🔒", title: "خصوصية تامة", desc: "لا يُرفع شيء للإنترنت" },
            { icon: "🌐", title: "متعدد اللغات", desc: "يدعم العربية والإنجليزية" },
            { icon: "🆓", title: "مجاني كلياً", desc: "بدون قيود أو اشتراك" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 text-sm">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
