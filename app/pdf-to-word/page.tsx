"use client";

import { useState, useRef } from "react";
import { FileType, Download, CheckCircle, FileUp } from "lucide-react";
import { toast } from "sonner";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      toast.error("يرجى رفع ملف PDF");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز الحد المسموح (50MB)");
      return;
    }
    setFile(selectedFile);
    setDownloadUrl(null);
    setExtractedText("");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(" ");
        fullText += `\n--- صفحة ${i} ---\n${pageText}\n`;
      }
      
      setExtractedText(fullText);
      
      // Create a simple text file (Word-compatible)
      const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success("تم استخراج النص بنجاح!");
    } catch {
      toast.error("حدث خطأ أثناء المعالجة. تأكد من أن الملف غير محمي.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(".pdf", ".txt");
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setExtractedText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <FileType className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">تحويل PDF إلى Word</h1>
          <p className="text-gray-600 text-lg">
            استخرج النصوص من ملفات PDF وحوّلها إلى نص قابل للتحرير
          </p>
        </div>

        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">اسحب ملف PDF هنا</p>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار الملف</p>
            <span className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
              اختر ملف PDF
            </span>
            <p className="text-xs text-gray-400 mt-3">يدعم .pdf — الحد الأقصى 50MB</p>
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
                <FileType className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">تغيير</button>
            </div>
            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري الاستخراج...
                </>
              ) : (
                <>
                  <FileType className="w-5 h-5" />
                  استخراج النص
                </>
              )}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">تم الاستخراج بنجاح!</h2>
            </div>
            {extractedText && (
              <div className="bg-gray-50 rounded-xl p-4 mb-4 max-h-48 overflow-y-auto text-sm text-gray-700 text-left font-mono whitespace-pre-wrap">
                {extractedText.slice(0, 500)}...
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                تنزيل الملف النصي
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                ملف آخر
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: "🔒", title: "آمن 100%", desc: "المعالجة داخل متصفحك فقط" },
            { icon: "⚡", title: "فوري", desc: "بدون رفع للسيرفر" },
            { icon: "🆓", title: "مجاني", desc: "بدون اشتراك" },
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
