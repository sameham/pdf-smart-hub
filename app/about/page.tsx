import Link from "next/link";
import { FileText, Shield, Zap, Globe, Heart, Code } from "lucide-react";

export const metadata = {
  title: "عن التطبيق",
  description: "تعرف على PDF Smart Hub - منصة معالجة PDF مجانية وخاصة",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">عن PDF Smart Hub</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          منصة عربية متكاملة لمعالجة ملفات PDF بسرعة وبخصوصية تامة
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">مهمتنا</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            نسعى لتوفير أدوات PDF احترافية ومجانية للجميع، مع التركيز على
            الخصوصية التامة. كل المعالجة تتم داخل متصفحك، مما يعني أن ملفاتك
            لا تغادر جهازك أبداً. نؤمن بأن الأدوات الأساسية يجب أن تكون متاحة
            للجميع بدون حواجز أو اشتراكات.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {[
            {
              icon: Shield,
              title: "الخصوصية أولاً",
              desc: "لا نخزن ملفاتك على سيرفراتنا. كل شيء يحدث في متصفحك.",
            },
            {
              icon: Zap,
              title: "سرعة فائقة",
              desc: "معالجة فورية بدون انتظار لرفع أو تنزيل الملفات.",
            },
            {
              icon: Globe,
              title: "دعم عربي كامل",
              desc: "واجهة عربية أصيلة مع دعم RTL وخط Tajawal.",
            },
            {
              icon: Code,
              title: "مفتوح المصدر",
              desc: "كود نظيف وقابل للمراجعة من قبل الجميع.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <f.icon className="w-8 h-8 text-brand-600 mb-3" />
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <Heart className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">صنع بشغف</h2>
          <p className="opacity-90">
            نطور هذا المشروع بشغف لنقدم لك أفضل تجربة ممكنة
          </p>
        </div>

        <div className="text-center mt-12">
          <Link
            href="/merge-pdf"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition shadow-lg"
          >
            <FileText className="w-5 h-5" />
            ابدأ باستخدام الأدوات
          </Link>
        </div>
      </div>
    </div>
  );
}