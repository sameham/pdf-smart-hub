"use client";

import { useState, useRef } from "react";
import { FileText, Download, CheckCircle, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WordToPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(doc|docx)$/i)) {
      toast.error("يرجى رفع ملف Word (.doc أو .docx)");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error("حجم الملف يتجاوز الحد المسموح (50MB)");
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

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress("جاري قراءة الملف...");
    try {
      const arrayBuffer = await file.arrayBuffer();

      setProgress("جاري تحويل المحتوى...");
      const mammoth = await import("mammoth");
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      setProgress("جاري إنشاء ملف PDF...");
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // Parse HTML and add text to PDF
      const parser = new DOMParser();
      const docHtml = parser.parseFromString(html, "text/html");
      const textBlocks: string[] = [];

      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent?.trim();
          if (text) textBlocks.push(text);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as Element;
          const tag = el.tagName.toLowerCase();
          if (tag === "p" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "li") {
            const text = el.textContent?.trim();
            if (text) {
              textBlocks.push(text);
              textBlocks.push(""); // line break
            }
            return; // don't recurse, already got full text
          }
          el.childNodes.forEach(walk);
        }
      };
      docHtml.body.childNodes.forEach(walk);

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 60;
      const maxWidth = pageWidth - margin * 2;
      let y = margin;

      doc.setFont("helvetica");
      doc.setFontSize(11);
      doc.setR2L(true);

      for (const block of textBlocks) {
        if (block === "") {
          y += 8;
          continue;
        }
        const lines = doc.splitTextToSize(block, maxWidth);
        for (const line of lines) {
          if (y + 14 > pageHeight - margin) {
            doc.addPage();
            y = margin;
          }
          doc.text(line, pageWidth - margin, y, { align: "right" });
          y += 14;
        }
      }

      const pdfBlob = doc.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setDownloadUrl(url);
      toast.success("تم تحويل الملف بنجاح!");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء التحويل. تأكد من أن الملف صحيح.");
    } finally {
      setIsProcessing(false);
      setProgress("");
    }
  };

  const handleDownload = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(/\.(doc|docx)$/i, ".pdf");
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">تحويل Word إلى PDF</h1>
          <p className="text-gray-600 text-lg">
            حوّل ملفات Word (doc, docx) إلى PDF بسهولة داخل متصفحك
          </p>
        </div>

        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">اسحب ملف Word هنا</p>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار الملف</p>
            <span className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
              اختر ملف Word
            </span>
            <p className="text-xs text-gray-400 mt-3">يدعم .doc و .docx — الحد الأقصى 50MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".doc,.docx"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            />
          </div>
        )}

        {file && !downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">تغيير</button>
            </div>

            {isProcessing && progress && (
              <div className="flex items-center gap-2 mb-4 text-sm text-blue-600 bg-blue-50 rounded-xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin" />
                {progress}
              </div>
            )}

            <button
              onClick={handleConvert}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><Loader2 className="w-5 h-5 animate-spin" />جاري التحويل...</>
              ) : (
                <><FileText className="w-5 h-5" />تحويل إلى PDF</>
              )}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">تم التحويل بنجاح!</h2>
            <p className="text-gray-500 mb-6">ملف PDF جاهز للتنزيل</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                تنزيل PDF
              </button>
              <button
                onClick={reset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors"
              >
                تحويل ملف آخر
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: "🔒", title: "آمن 100%", desc: "ملفاتك لا تُرفع لأي سيرفر" },
            { icon: "⚡", title: "سريع", desc: "تحويل فوري داخل المتصفح" },
            { icon: "🆓", title: "مجاني", desc: "بدون أي تكاليف خفية" },
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
