import Link from "next/link";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <FileQuestion className="w-20 h-20 mx-auto text-gray-400 mb-6" />
        <h1 className="text-7xl font-bold gradient-text mb-3">404</h1>
        <h2 className="text-2xl font-bold mb-3">الصفحة غير موجودة</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          عذراً، الصفحة التي تبحث عنها غير متوفرة أو تم نقلها
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}