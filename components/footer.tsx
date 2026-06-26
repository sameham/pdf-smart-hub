import Link from "next/link";
import { FileText, Mail, Shield, BookOpen, LayoutDashboard } from "lucide-react";

const toolLinks = [
  { href: "/compress-pdf", label: "ضغط PDF" },
  { href: "/merge-pdf", label: "دمج PDF" },
  { href: "/split-pdf", label: "تقسيم PDF" },
  { href: "/pdf-to-image", label: "PDF إلى صورة" },
  { href: "/image-to-pdf", label: "صورة إلى PDF" },
  { href: "/word-to-pdf", label: "Word إلى PDF" },
  { href: "/pdf-to-word", label: "PDF إلى Word" },
  { href: "/ocr", label: "استخراج النصوص (OCR)" },
  { href: "/rotate-pdf", label: "تدوير PDF" },
  { href: "/watermark-pdf", label: "إضافة علامة مائية" },
  { href: "/unlock-pdf", label: "فك قفل PDF" },
  { href: "/protect-pdf", label: "حماية PDF" },
];

const quickLinks = [
  { href: "/chat", label: "محادثة مع PDF", icon: FileText },
  { href: "/pricing", label: "الأسعار", icon: Shield },
  { href: "/blog", label: "المدونة", icon: BookOpen },
  { href: "/dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/privacy", label: "سياسة الخصوصية", icon: Shield },
  { href: "/terms", label: "شروط الاستخدام", icon: Shield },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">PDF Smart Hub</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              أدوات PDF مجانية وذكية. جميع المعالجات تتم داخل متصفحك بدون رفع ملفاتك للسيرفر. آمن، سريع، مجاني.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <Mail className="w-4 h-4" />
              <a href="mailto:support@pdfsmarthub.com" className="hover:text-blue-400 transition-colors">
                support@pdfsmarthub.com
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-white font-semibold mb-4">أدوات PDF</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-2"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PDF Smart Hub. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-blue-400 transition-colors">
              الخصوصية
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:text-blue-400 transition-colors">
              الشروط
            </Link>
            <span>·</span>
            <span>صُنع بـ ❤️ للمستخدمين العرب</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
