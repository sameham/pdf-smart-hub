import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Zap,
  Lock,
  Globe,
  Sparkles,
  Check,
  Shield,
} from "lucide-react";
import { TOOLS } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-100 dark:bg-brand-900/30 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                مجاني بالكامل • بدون تسجيل
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-slide-up">
              كل أدوات الـ{" "}
              <span className="gradient-text">PDF</span>
              <br />
              في مكان واحد
            </h1>

            <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              ادمج، قسّم، اضغط، حوّل واحمِ ملفات PDF والصور بسرعة فائقة
              وبخصوصية تامة — كل المعالجة تتم داخل متصفحك
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/merge-pdf"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition shadow-lg shadow-brand-500/20 hover:scale-105"
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition border border-gray-200 dark:border-gray-700"
              >
                تعرف على المزيد
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span>بدون رفع للسيرفر</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-600" />
                <span>معالجة فورية</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>خصوصية كاملة</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            الأدوات المتاحة
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            ست أدوات احترافية لتلبية كل احتياجاتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="group p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-brand-500 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-${tool.color}-100 dark:bg-${tool.color}-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition`}
              >
                <FileText className={`w-6 h-6 text-${tool.color}-600`} />
              </div>
              <h3 className="text-xl font-bold mb-2">{tool.nameAr}</h3>
              <p className="text-sm text-gray-500 mb-3">{tool.nameEn}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tool.description}
              </p>
              <div className="mt-4 flex items-center text-brand-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                ابدأ الآن
                <ArrowLeft className="w-4 h-4 mr-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              لماذا PDF Smart Hub؟
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              نقدم تجربة استثنائية في معالجة ملفات PDF
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "سريع جداً",
                desc: "معالجة فورية داخل المتصفح بدون رفع للسيرفر أو انتظار",
              },
              {
                icon: Lock,
                title: "آمن وخاص",
                desc: "ملفاتك لا تغادر جهازك أبداً - خصوصية كاملة 100%",
              },
              {
                icon: Globe,
                title: "يدعم العربية",
                desc: "واجهة عربية كاملة مع دعم OCR للنصوص العربية والإنجليزية",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 items-center justify-center mb-4">
                  <f.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-brand-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              جاهز للبدء؟
            </h2>
            <p className="text-lg opacity-90 mb-8">
              انضم لآلاف المستخدمين يومياً واستفد من أدواتنا المجانية
            </p>
            <Link
              href="/merge-pdf"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 rounded-xl font-medium hover:scale-105 transition shadow-lg"
            >
              جرّب الآن مجاناً
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl">PDF Smart Hub</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              منصة متكاملة لمعالجة ملفات PDF والصور بخصوصية تامة وسرعة فائقة.
              كل المعالجة تتم داخل متصفحك.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">الأدوات</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <Link href="/merge-pdf" className="hover:text-brand-600">
                  دمج PDF
                </Link>
              </li>
              <li>
                <Link href="/split-pdf" className="hover:text-brand-600">
                  تقسيم PDF
                </Link>
              </li>
              <li>
                <Link href="/compress-pdf" className="hover:text-brand-600">
                  ضغط PDF
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-image" className="hover:text-brand-600">
                  PDF إلى صورة
                </Link>
              </li>
              <li>
                <Link href="/image-to-pdf" className="hover:text-brand-600">
                  صورة إلى PDF
                </Link>
              </li>
              <li>
                <Link href="/protect-pdf" className="hover:text-brand-600">
                  حماية PDF
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">الشركة</h4>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-600">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-600">
                  الأسعار
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-600">
                  الخصوصية
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-600">
                  الشروط
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500">
          © 2026 PDF Smart Hub. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}