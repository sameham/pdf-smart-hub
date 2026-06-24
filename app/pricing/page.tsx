import Link from "next/link";
import { Check, Sparkles, Crown } from "lucide-react";

export const metadata = {
  title: "الأسعار",
  description: "خطط وأسعار PDF Smart Hub",
};

const PLANS = [
  {
    name: "مجاني",
    nameEn: "Free",
    price: "0",
    description: "للاستخدام الشخصي",
    icon: Sparkles,
    color: "gray",
    features: [
      "جميع الأدوات الأساسية",
      "حد أقصى 50 ميجا لكل ملف",
      "10 عمليات يومياً",
      "بدون تسجيل",
      "دعم المجتمع",
    ],
    cta: "ابدأ مجاناً",
    href: "/merge-pdf",
  },
  {
    name: "احترافي",
    nameEn: "Pro",
    price: "29",
    period: "ريال/شهر",
    description: "للمستخدمين المتقدمين",
    icon: Crown,
    color: "brand",
    popular: true,
    features: [
      "كل مميزات المجاني",
      "حد أقصى 500 ميجا لكل ملف",
      "عمليات غير محدودة",
      "OCR عربي وإنجليزي",
      "دعم بالبريد الإلكتروني",
      "بدون إعلانات",
    ],
    cta: "اشترك الآن",
    href: "/auth/signup",
  },
];

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          خطط بسيطة وشفافة
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          ابدأ مجاناً، ورقّي متى احتجت
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative p-8 bg-white dark:bg-gray-900 rounded-2xl border-2 ${
              plan.popular
                ? "border-brand-500 shadow-2xl shadow-brand-500/20"
                : "border-gray-200 dark:border-gray-800"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-sm font-medium rounded-full">
                الأكثر شعبية
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-12 h-12 rounded-xl bg-${plan.color}-100 dark:bg-${plan.color}-900/30 flex items-center justify-center`}
              >
                <plan.icon className={`w-6 h-6 text-${plan.color}-600`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-sm text-gray-500">{plan.nameEn}</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {plan.description}
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                )}
                {!plan.period && (
                  <span className="text-gray-500 text-sm">مجاني</span>
                )}
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className={`block w-full text-center px-6 py-3 rounded-xl font-medium transition ${
                plan.popular
                  ? "bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/20"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-gray-500">
          هل تحتاج خطة مخصصة لشركتك؟{" "}
          <Link href="#" className="text-brand-600 hover:underline">
            تواصل معنا
          </Link>
        </p>
      </div>
    </div>
  );
}