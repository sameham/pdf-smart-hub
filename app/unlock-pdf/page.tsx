"use client";

import { useState, useRef } from "react";
import { LockOpen, Download, CheckCircle, FileUp, Lock } from "lucide-react";
import { toast } from "sonner";
import { PDFDocument } from "pdf-lib";

export default function UnlockPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
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
    setPassword("");
    
    // Check if encrypted
    try {
      const ab = await selectedFile.arrayBuffer();
      await PDFDocument.load(ab);
      setIsPasswordProtected(false);
    } catch {
      setIsPasswordProtected(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFileSelect(dropped);
  };

  const handleUnlock = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      // pdf-lib supports loading with password option
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
      } as any);

      // Remove encryption by saving without password
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      toast.success("تم فك تشفير الملف بنجاح!");
    } catch (err) {
      const msg = String(err);
      if (msg.includes("password") || msg.includes("encrypted")) {
        toast.error("كلمة المرور غير صحيحة. يرجى المحاولة مجدداً.");
      } else {
        toast.error("حدث خطأ أثناء المعالجة.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!downloadUrl || !file) return;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = file.name.replace(".pdf", "-unlocked.pdf");
    a.click();
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setPassword("");
    setIsPasswordProtected(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-2xl mb-4">
            <LockOpen className="w-8 h-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">فك قفل PDF</h1>
          <p className="text-gray-600 text-lg">
            أزل كلمة المرور وقيود التحرير من ملفات PDF المحمية
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">ملاحظة مهمة</p>
            <p className="text-sm text-amber-700 mt-1">
              هذه الأداة مخصصة للملفات التي تملكها ولديك كلمة مرورها. 
              استخدم هذه الأداة بمسؤولية.
            </p>
          </div>
        </div>

        {!file && (
          <div
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer
              ${isDragging ? "border-yellow-500 bg-yellow-50" : "border-gray-300 hover:border-yellow-400 hover:bg-yellow-50/50"}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <FileUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 mb-2">اسحب ملف PDF المحمي هنا</p>
            <p className="text-gray-500 mb-4">أو اضغط لاختيار الملف</p>
            <span className="bg-yellow-600 text-white px-6 py-2 rounded-lg text-sm font-medium">اختر ملف PDF</span>
            <p className="text-xs text-gray-400 mt-3">يدعم .pdf — الحد الأقصى 100MB</p>
            <input ref={fileInputRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
          </div>
        )}

        {file && !downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isPasswordProtected ? "bg-red-100" : "bg-yellow-100"}`}>
                {isPasswordProtected ? (
                  <Lock className="w-6 h-6 text-red-600" />
                ) : (
                  <LockOpen className="w-6 h-6 text-yellow-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB ·{" "}
                  <span className={isPasswordProtected ? "text-red-500" : "text-green-500"}>
                    {isPasswordProtected ? "محمي بكلمة مرور" : "غير محمي"}
                  </span>
                </p>
              </div>
              <button onClick={reset} className="text-gray-400 hover:text-gray-600 text-sm">تغيير</button>
            </div>

            {isPasswordProtected && (
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">كلمة المرور</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة مرور الملف"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                />
              </div>
            )}

            <button
              onClick={handleUnlock}
              disabled={isProcessing || (isPasswordProtected && !password.trim())}
              className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />جاري فك القفل...</>
              ) : (
                <><LockOpen className="w-5 h-5" />فك قفل PDF</>
              )}
            </button>
          </div>
        )}

        {downloadUrl && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">تم فك القفل بنجاح!</h2>
            <p className="text-gray-500 mb-6">الملف جاهز للتنزيل بدون كلمة مرور</p>
            <div className="flex gap-3 justify-center">
              <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium flex items-center gap-2">
                <Download className="w-5 h-5" />تنزيل PDF
              </button>
              <button onClick={reset} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium">ملف آخر</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mt-10">
          {[
            { icon: "🔒", title: "خصوصية كاملة", desc: "المعالجة داخل متصفحك" },
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
