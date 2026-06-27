// Updated homepage
import Link from "next/link";
import { ArrowLeft, FileText, Zap, Lock, Shield, Sparkles, MessageCircle, Star, Users, Globe } from "lucide-react";

const TOOLS = [
  { id: "merge-pdf", nameAr: "دمج PDF", nameEn: "Merge PDF", description: "ادمج عدة ملفات PDF في ملف واحد بسهولة", color: "blue", icon: "📎" },
  { id: "split-pdf", nameAr: "تقسيم PDF", nameEn: "Split PDF", description: "قسّم ملف PDF لصفحات أو أجزاء منفصلة", color: "purple", icon: "✂️" },
  { id: "compress-pdf", nameAr: "ضغط PDF", nameEn: "Compress PDF", description: "قلّل حجم ملف PDF بدون فقدان الجودة", color: "green", icon: "🗜️" },
  { id: "pdf-to-image", nameAr: "PDF إلى صورة", nameEn: "PDF to Image", description: "حوّل صفحات PDF إلى صور JPG أو PNG", color: "orange", icon: "🖼️" },
  { id: "image-to-pdf", nameAr: "صورة إلى PDF", nameEn: "Image to PDF", description: "ادمج الصور في ملف PDF واحد", color: "pink", icon: "📸" },
  { id: "protect-pdf", nameAr: "حماية PDF", nameEn: "Protect PDF", description: "احمِ ملف PDF بكلمة مرور قوية", color: "red", icon: "🔒" },
  { id: "word-to-pdf", nameAr: "Word إلى PDF", nameEn: "Word to PDF", description: "حوّل ملفات Word إلى PDF بدقة عالية", color: "blue", icon: "📝" },
  { id: "pdf-to-word", nameAr: "PDF إلى Word", nameEn: "PDF to Word", description: "استخرج النص من PDF وحوّله لـ Word", color: "indigo", icon: "📄" },
  { id: "ocr", nameAr: "استخراج نص OCR", nameEn: "OCR", description: "استخرج النصوص من الصور والـ PDF الممسوحة", color: "yellow", icon: "🔍" },
  { id: "rotate-pdf", nameAr: "تدوير PDF", nameEn: "Rotate PDF", description: "دوّر صفحات PDF بالاتجاه الذي تريده", color: "teal", icon: "🔄" },
  { id: "watermark-pdf", nameAr: "علامة مائية", nameEn: "Watermark PDF", description: "أضف علامة مائية نصية أو صورة على PDF", color: "cyan", icon: "💧" },
  { id: "unlock-pdf", nameAr: "فتح PDF", nameEn: "Unlock PDF", description: "أزل كلمة المرور من ملفات PDF المحمية", color: "amber", icon: "🔓" },
];

const STATS = [
  { value: "+50,000", label: "مستخدم شهرياً", icon: Users },
  { value: "12", label: "أداة احترافية", icon: Zap },
  { value: "100%", label: "معالجة محلية آمنة", icon: Shield },
  { value: "مجاناً", label: "بدون تسجيل", icon: Star },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                مجاني بالكامل • بدون تسجيل
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              كل أدوات الـ{" "}
              <span className="text-blue-600">PDF</span>
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-lg shadow-blue-500/20 hover:scale-105"
              >
                ابدأ الآن مجاناً
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium transition border border-gray-200 dark:border-gray-700"
              >
                <MessageCircle className="w-5 h-5 text-blue-600" />
                تحدّث مع PDF بالذكاء الاصطناعي
              </Link>
            </div>

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
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-purple-600" />
                <span>يدعم العربية</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">الأدوات المتاحة</h2>
          <p className="text-gray-600 dark:text-gray-400">
            12 أداة احترافية لتلبية كل احتياجاتك
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.id}`}
              className="group p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 transition-all"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white">{tool.nameAr}</h3>
              <p className="text-xs text-gray-400 mb-2">{tool.nameEn}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{tool.description}</p>
              <div className="mt-3 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition">
                ابدأ الآن
                <ArrowLeft className="w-4 h-4 mr-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Chat with PDF CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-10 text-center text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <MessageCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold mb-3">تحدّث مع PDF بالذكاء الاصطناعي</h2>
          <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto">
            ارفع أي ملف PDF واسأل عنه بالعربية — سيجيبك الذكاء الاصطناعي فوراً
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold transition"
          >
            جرّب الآن مجاناً
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">لماذا PDF Smart Hub؟</h2>
            <p className="text-gray-600 dark:text-gray-400">نقدم تجربة استثنائية في معالجة ملفات PDF</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: "⚡", title: "سريع جداً", desc: "معالجة فورية داخل المتصفح بدون رفع للسيرفر أو انتظار" },
              { icon: "🔒", title: "آمن وخاص", desc: "ملفاتك لا تغادر جهازك أبداً - خصوصية كاملة 100%" },
              { icon: "🌐", title: "يدعم العربية", desc: "واجهة عربية كاملة مع دعم OCR للنصوص العربية والإنجليزية" },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-800">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">جاهز للبدء؟</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          انضم لآلاف المستخدمين يومياً واستفد من أدواتنا المجانية
        </p>
        <Link
          href="/merge-pdf"
          className="inline-flex items-center gap-2 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition shadow-lg shadow-blue-500/20"
        >
          جرّب الآن مجاناً
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </section>
    </>
  );
}
