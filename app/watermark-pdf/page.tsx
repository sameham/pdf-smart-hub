"use client";

import { useState, useRef } from "react";
import { Stamp, Download, CheckCircle, FileUp } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState("سري");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
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
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        page.drawText(watermarkText, {
          x: (width - textWidth) / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(45),
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success(`تم إضافة العلامة المائية إلى ${pages.length} صفحة`);
    } catch {
      toast.error("حدث خطأ. تأكد من أن الملف غير محمي.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(".pdf", "-watermarked.pdf");
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-2xl mb-4">
            <Stamp className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">إضافة علامة مائية لـ PDF</h1>
          <p className="text-gray-600 text-lg">
            أضف علامة مائية نصية لجميع صفحات ملف PDF لحماية محتواك
          </p>
        </div>

        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragging ? "border-teal-500 bg-teal-50" : "border-gray-300 hover:border-teal-400 hover:bg-teal-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">اسحب ملف PDF هنا</p>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار الملف</p>
            <span className="bg-teal-600 text-white px-6 py-2 rounded-lg text-sm font-medium">اختر ملف PDF</span>
            <p className="text-xs text-gray-400 mt-3">يدعم .pdf — الحد الأقصى 100MB</p>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
          </div>
        )}

        {file && !downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Stamp className="w-6 h-6 text-teal-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">تغيير</button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">نص العلامة المائية</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="مثال: سري، مسودة، PDF Smart Hub"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">الشفافية: {Math.round(opacity * 100)}%</label>
                  <input type="range" min="0.1" max="1" step="0.1" value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full accent-teal-600" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">حجم الخط: {fontSize}pt</label>
                  <input type="range" min="20" max="120" step="10" value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full accent-teal-600" />
                </div>
              </div>
            </div>

            <button
              onClick={handleWatermark}
              disabled={isProcessing || !watermarkText.trim()}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />جاري الإضافة...</>
              ) : (
                <><Stamp className="w-5 h-5" />إضافة العلامة المائية</>
              )}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">تم إضافة العلامة المائية!</h2>
            <p className="text-gray-500 mb-6">نص: "{watermarkText}"</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2">
                <Download className="w-5 h-5" />تنزيل PDF
              </button>
              <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium">ملف آخر</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
