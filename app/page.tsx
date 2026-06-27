// Updated homepage
import Link from "next/link";
import {
  ArrowLeft, Zap, Lock, Shield, Sparkles, MessageCircle, Star, Users, Globe,
  FilePlus2, Scissors, Minimize2, Image, FileImage, ShieldCheck,
  FileText, FileType2, ScanText, RotateCw, Stamp, Unlock,
} from "lucide-react";

const TOOLS = [
  {
    id: "merge-pdf", nameAr: "دمج PDF", nameEn: "Merge PDF",
    description: "ادمج عدة ملفات PDF في ملف واحد بسهولة",
    icon: FilePlus2,
    gradient: "from-blue-500 to-blue-700",
    glow: "shadow-blue-500/30",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-100 dark:border-blue-900/40",
    hover: "hover:border-blue-400 hover:shadow-blue-500/20",
    iconBg: "bg-blue-100 dark:bg-blue-900/50",
    iconColor: "text-blue-600 dark:text-blue-400",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
  },
  {
    id: "split-pdf", nameAr: "تقسيم PDF", nameEn: "Split PDF",
    description: "قسّم ملف PDF لصفحات أو أجزاء منفصلة",
    icon: Scissors,
    gradient: "from-violet-500 to-purple-700",
    glow: "shadow-purple-500/30",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-100 dark:border-purple-900/40",
    hover: "hover:border-purple-400 hover:shadow-purple-500/20",
    iconBg: "bg-purple-100 dark:bg-purple-900/50",
    iconColor: "text-purple-600 dark:text-purple-400",
    badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300",
  },
  {
    id: "compress-pdf", nameAr: "ضغط PDF", nameEn: "Compress PDF",
    description: "قلّل حجم ملف PDF بدون فقدان الجودة",
    icon: Minimize2,
    gradient: "from-emerald-500 to-green-700",
    glow: "shadow-green-500/30",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-100 dark:border-green-900/40",
    hover: "hover:border-green-400 hover:shadow-green-500/20",
    iconBg: "bg-green-100 dark:bg-green-900/50",
    iconColor: "text-green-600 dark:text-green-400",
    badge: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
  },
  {
    id: "pdf-to-image", nameAr: "PDF إلى صورة", nameEn: "PDF to Image",
    description: "حوّل صفحات PDF إلى صور JPG أو PNG",
    icon: Image,
    gradient: "from-orange-500 to-amber-600",
    glow: "shadow-orange-500/30",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-100 dark:border-orange-900/40",
    hover: "hover:border-orange-400 hover:shadow-orange-500/20",
    iconBg: "bg-orange-100 dark:bg-orange-900/50",
    iconColor: "text-orange-600 dark:text-orange-400",
    badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300",
  },
  {
    id: "image-to-pdf", nameAr: "صورة إلى PDF", nameEn: "Image to PDF",
    description: "ادمج الصور في ملف PDF واحد",
    icon: FileImage,
    gradient: "from-pink-500 to-rose-600",
    glow: "shadow-pink-500/30",
    bg: "bg-pink-50 dark:bg-pink-950/30",
    border: "border-pink-100 dark:border-pink-900/40",
    hover: "hover:border-pink-400 hover:shadow-pink-500/20",
    iconBg: "bg-pink-100 dark:bg-pink-900/50",
    iconColor: "text-pink-600 dark:text-pink-400",
    badge: "bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300",
  },
  {
    id: "protect-pdf", nameAr: "حماية PDF", nameEn: "Protect PDF",
    description: "احمِ ملف PDF بكلمة مرور قوية",
    icon: ShieldCheck,
    gradient: "from-red-500 to-rose-700",
    glow: "shadow-red-500/30",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-100 dark:border-red-900/40",
    hover: "hover:border-red-400 hover:shadow-red-500/20",
    iconBg: "bg-red-100 dark:bg-red-900/50",
    iconColor: "text-red-600 dark:text-red-400",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  },
  {
    id: "word-to-pdf", nameAr: "Word إلى PDF", nameEn: "Word to PDF",
    description: "حوّل ملفات Word إلى PDF بدقة عالية",
    icon: FileText,
    gradient: "from-sky-500 to-blue-600",
    glow: "shadow-sky-500/30",
    bg: "bg-sky-50 dark:bg-sky-950/30",
    border: "border-sky-100 dark:border-sky-900/40",
    hover: "hover:border-sky-400 hover:shadow-sky-500/20",
    iconBg: "bg-sky-100 dark:bg-sky-900/50",
    iconColor: "text-sky-600 dark:text-sky-400",
    badge: "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300",
  },
  {
    id: "pdf-to-word", nameAr: "PDF إلى Word", nameEn: "PDF to Word",
    description: "استخرج النص من PDF وحوّله لـ Word",
    icon: FileType2,
    gradient: "from-indigo-500 to-violet-600",
    glow: "shadow-indigo-500/30",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
    border: "border-indigo-100 dark:border-indigo-900/40",
    hover: "hover:border-indigo-400 hover:shadow-indigo-500/20",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
  },
  {
    id: "ocr", nameAr: "استخراج نص OCR", nameEn: "OCR Text",
    description: "استخرج النصوص من الصور والـ PDF الممسوحة",
    icon: ScanText,
    gradient: "from-yellow-500 to-amber-600",
    glow: "shadow-yellow-500/30",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    border: "border-yellow-100 dark:border-yellow-900/40",
    hover: "hover:border-yellow-400 hover:shadow-yellow-500/20",
    iconBg: "bg-yellow-100 dark:bg-yellow-900/50",
    iconColor: "text-yellow-600 dark:text-yellow-500",
    badge: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
  },
  {
    id: "rotate-pdf", nameAr: "تدوير PDF", nameEn: "Rotate PDF",
    description: "دوّر صفحات PDF بالاتجاه الذي تريده",
    icon: RotateCw,
    gradient: "from-teal-500 to-cyan-600",
    glow: "shadow-teal-500/30",
    bg: "bg-teal-50 dark:bg-teal-950/30",
    border: "border-teal-100 dark:border-teal-900/40",
    hover: "hover:border-teal-400 hover:shadow-teal-500/20",
    iconBg: "bg-teal-100 dark:bg-teal-900/50",
    iconColor: "text-teal-600 dark:text-teal-400",
    badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300",
  },
  {
    id: "watermark-pdf", nameAr: "علامة مائية", nameEn: "Watermark PDF",
    description: "أضف علامة مائية نصية على جميع الصفحات",
    icon: Stamp,
    gradient: "from-cyan-500 to-teal-600",
    glow: "shadow-cyan-500/30",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
    border: "border-cyan-100 dark:border-cyan-900/40",
    hover: "hover:border-cyan-400 hover:shadow-cyan-500/20",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/50",
    iconColor: "text-cyan-600 dark:text-cyan-400",
    badge: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
  },
  {
    id: "unlock-pdf", nameAr: "فتح PDF", nameEn: "Unlock PDF",
    description: "أزل كلمة المرور من ملفات PDF المحمية",
    icon: Unlock,
    gradient: "from-amber-500 to-orange-600",
    glow: "shadow-amber-500/30",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-100 dark:border-amber-900/40",
    hover: "hover:border-amber-400 hover:shadow-amber-500/20",
    iconBg: "bg-amber-100 dark:bg-amber-900/50",
    iconColor: "text-amber-600 dark:text-amber-400",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  },
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
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 mb-4">
            12 أداة مجانية
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white">
            الأدوات المتاحة
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            كل ما تحتاجه لملفات PDF في مكان واحد — بدون رفع للسيرفر
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={`/${tool.id}`}
                className={`
                  group relative overflow-hidden rounded-2xl border p-5
                  ${tool.bg} ${tool.border} ${tool.hover}
                  hover:shadow-xl hover:-translate-y-1.5
                  transition-all duration-300 ease-out
                  backdrop-blur-sm
                `}
              >
                {/* Glass shimmer overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                </div>

                {/* Gradient glow on hover */}
                <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${tool.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`
                  inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
                  ${tool.iconBg} group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon className={`w-6 h-6 ${tool.iconColor}`} strokeWidth={1.8} />
                </div>

                {/* Badge */}
                <div className="mb-3">
                  <span className={`text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full ${tool.badge}`}>
                    {tool.nameEn}
                  </span>
                </div>

                {/* Text */}
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1.5 group-hover:translate-x-0.5 transition-transform">
                  {tool.nameAr}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {tool.description}
                </p>

                {/* Arrow CTA */}
                <div className={`mt-4 flex items-center gap-1 text-sm font-semibold ${tool.iconColor} translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300`}>
                  ابدأ الآن
                  <ArrowLeft className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
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
