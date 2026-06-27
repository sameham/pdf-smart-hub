import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "المدونة - نصائح وأدلة PDF",
  description: "مقالات ونصائح حول العمل مع ملفات PDF، التحويل، الضغط، وأفضل الممارسات.",
};

const blogPosts = [
  {
    slug: "compress-pdf-guide",
    title: "كيفية ضغط ملفات PDF بدون فقدان الجودة",
    excerpt: "تعلم أفضل الطرق لتقليل حجم ملفات PDF مع الحفاظ على جودة النص والصور. دليل شامل لجميع المستخدمين.",
    date: "15 يناير 2025",
    readTime: "5 دقائق",
    category: "أدلة",
    color: "blue",
  },
  {
    slug: "pdf-to-word-tips",
    title: "تحويل PDF إلى Word: الدليل الكامل",
    excerpt: "كل ما تحتاج معرفته عن تحويل ملفات PDF إلى مستندات Word قابلة للتحرير، مع نصائح للحصول على أفضل النتائج.",
    date: "10 يناير 2025",
    readTime: "7 دقائق",
    category: "تحويل",
    color: "green",
  },
  {
    slug: "ocr-arabic-pdf",
    title: "استخراج النصوص العربية من PDF باستخدام OCR",
    excerpt: "دليل عملي لاستخدام تقنية OCR لاستخراج النصوص العربية والإنجليزية من ملفات PDF الممسوحة ضوئياً.",
    date: "5 يناير 2025",
    readTime: "6 دقائق",
    category: "OCR",
    color: "purple",
  },
  {
    slug: "merge-pdf-best-practices",
    title: "أفضل ممارسات دمج ملفات PDF",
    excerpt: "كيفية دمج ملفات PDF متعددة بكفاءة، وترتيب الصفحات، والحفاظ على التنسيق الأصلي لكل ملف.",
    date: "1 يناير 2025",
    readTime: "4 دقائق",
    category: "أدلة",
    color: "orange",
  },
  {
    slug: "pdf-security-guide",
    title: "حماية ملفات PDF: دليل الأمان الشامل",
    excerpt: "تعلم كيفية إضافة كلمات مرور وعلامات مائية لحماية ملفاتك، وكيفية فك الحماية عند الحاجة.",
    date: "25 ديسمبر 2024",
    readTime: "8 دقائق",
    category: "أمان",
    color: "red",
  },
  {
    slug: "image-to-pdf-tips",
    title: "تحويل الصور إلى PDF: نصائح احترافية",
    excerpt: "أفضل الطرق لتحويل صورك إلى ملفات PDF عالية الجودة، مع نصائح لضبط الدقة والحجم.",
    date: "20 ديسمبر 2024",
    readTime: "5 دقائق",
    category: "تحويل",
    color: "teal",
  },
];

const categoryColors: Record<string, string> = {
  أدلة: "bg-blue-100 text-blue-700",
  تحويل: "bg-green-100 text-green-700",
  OCR: "bg-purple-100 text-purple-700",
  أمان: "bg-red-100 text-red-700",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">مدونة PDF Smart Hub</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            مقالات ونصائح احترافية حول العمل مع ملفات PDF، التحويل، الضغط، وكل ما يتعلق بـ PDF
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all group">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[post.category] || "bg-gray-100 text-gray-700"}`}>
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Clock className="w-3 h-3" />
                  {post.readTime}
                </div>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{post.date}</span>
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  اقرأ المقال
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
