"use client";

import { useState, useRef } from "react";
import { RotateCw, Download, CheckCircle, FileUp } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, degrees } from "pdf-lib";

export default function RotatePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [pageCount, setPageCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      toast.error("يرجى رفع ملف PDF");
      return;
    }
    if (selectedFile.size > 100 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز الحد المسموح (100MB)");
      return;
    }
    setFile(selectedFile);
    setDownloadUrl(null);
    // Count pages
    try {
      const ab = await selectedFile.arrayBuffer();
      const pdf = await PDFDocument.load(ab);
      setPageCount(pdf.getPageCount());
    } catch { setPageCount(0); }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleRotate = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      pages.forEach((page) => {
        page.setRotation(degrees(rotation));
      });
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(`تم تدوير جميع الصفحات (${pages.length}) بزاوية ${rotation}°`);
    } catch {
      toast.error("حدث خطأ أثناء التدوير. تأكد من أن الملف غير محمي.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(".pdf", `-rotated-${rotation}.pdf`);
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setPageCount(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-2xl mb-4">
            <RotateCw className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">تدوير PDF</h1>
          <p className="text-gray-600 text-lg">
            قم بتدوير جميع صفحات ملف PDF بزاوية 90° أو 180° أو 270°
          </p>
        </div>

        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300 hover:border-orange-400 hover:bg-orange-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">اسحب ملف PDF هنا</p>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار الملف</p>
            <span className="bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
              اختر ملف PDF
            </span>
            <p className="text-xs text-gray-400 mt-3">يدعم .pdf — الحد الأقصى 100MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        )}

        {file && !downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <RotateCw className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                  {pageCount > 0 && ` · ${pageCount} صفحة`}
                </p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">تغيير</button>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 mb-3">اختر زاوية التدوير:</p>
              <div className="flex gap-3">
                {([90, 180, 270] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotation(angle)}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors border-2
                      ${rotation === angle ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}
                  >
                    <RotateCw className={`w-4 h-4 mx-auto mb-1 ${rotation === angle ? "text-orange-600" : "text-gray-400"}`} />
                    {angle}°
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleRotate}
              disabled={isProcessing}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التدوير...
                </>
              ) : (
                <>
                  <RotateCw className="w-5 h-5" />
                  تدوير {rotation}°
                </>
              )}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">تم التدوير بنجاح!</h2>
            <p className="text-gray-500 mb-6">تم تدوير جميع الصفحات بزاوية {rotation}°</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                تنزيل PDF
              </button>
              <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium">
                ملف آخر
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: "🔒", title: "آمن 100%", desc: "المعالجة داخل متصفحك" },
            { icon: "⚡", title: "فوري", desc: "بدون رفع للسيرفر" },
            { icon: "🆓", title: "مجاني", desc: "بدون قيود" },
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
