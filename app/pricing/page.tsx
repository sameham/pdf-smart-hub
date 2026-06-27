'use client'

import { useState } from 'react'
import { Check, X, Zap, Crown, Building2, HelpCircle, Star, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    id: 'free',
    name: 'مجاني',
    nameEn: 'Free',
    icon: Zap,
    color: 'gray',
    price: { monthly: 0, annual: 0 },
    description: 'مثالي للاستخدام الشخصي البسيط',
    cta: 'ابدأ مجاناً',
    ctaLink: '/sign-up',
    popular: false,
    features: [
      { text: '5 ملفات يومياً', included: true },
      { text: 'حجم ملف حتى 10 ميجابايت', included: true },
      { text: 'جميع أدوات PDF الأساسية', included: true },
      { text: 'معالجة في المتصفح (خصوصية كاملة)', included: true },
      { text: 'سجل العمليات (7 أيام)', included: true },
      { text: 'دعم عبر البريد الإلكتروني', included: false },
      { text: 'بدون علامة مائية', included: false },
      { text: 'حجم ملف حتى 100 ميجابايت', included: false },
      { text: 'Chat مع PDF بالذكاء الاصطناعي', included: false },
      { text: 'API للمطورين', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'احترافي',
    nameEn: 'Pro',
    icon: Crown,
    color: 'brand',
    price: { monthly: 29, annual: 17 },
    description: 'للمحترفين والفرق الصغيرة',
    cta: 'ابدأ تجربة 7 أيام مجاناً',
    ctaLink: '/sign-up?plan=pro',
    popular: true,
    features: [
      { text: 'ملفات غير محدودة يومياً', included: true },
      { text: 'حجم ملف حتى 100 ميجابايت', included: true },
      { text: 'جميع أدوات PDF المتقدمة', included: true },
      { text: 'معالجة في المتصفح (خصوصية كاملة)', included: true },
      { text: 'سجل العمليات (30 يوم)', included: true },
      { text: 'دعم ذو أولوية عبر البريد', included: true },
      { text: 'بدون علامة مائية', included: true },
      { text: 'حجم ملف حتى 100 ميجابايت', included: true },
      { text: 'Chat مع PDF بالذكاء الاصطناعي', included: true },
      { text: 'API للمطورين', included: false },
    ],
  },
  {
    id: 'enterprise',
    name: 'مؤسسي',
    nameEn: 'Enterprise',
    icon: Building2,
    color: 'purple',
    price: { monthly: null, annual: null },
    description: 'API + إدارة الفريق + فوترة مركزية. تواصل معنا للحصول على عرض مخصص.',
    cta: 'تواصل معنا',
    ctaLink: '/contact',
    popular: false,
    features: [
      { text: 'كل مميزات الخطة الاحترافية', included: true },
      { text: 'API كاملة للمطورين', included: true },
      { text: 'إدارة الفريق والمستخدمين', included: true },
      { text: 'فوترة مركزية للمؤسسة', included: true },
      { text: 'SLA مضمون 99.9% uptime', included: true },
      { text: 'مدير حساب مخصص', included: true },
      { text: 'تدريب وإعداد مخصص', included: true },
      { text: 'تكامل مع أنظمة المؤسسة', included: true },
      { text: 'أمان وامتثال متقدم', included: true },
      { text: 'دعم على مدار الساعة', included: true },
    ],
  },
]

const faqs = [
  {
    q: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
    a: 'نعم، يمكنك إلغاء اشتراكك في أي وقت دون أي رسوم إضافية. ستبقى مميزات الخطة الاحترافية فعالة حتى نهاية فترة الفوترة الحالية.',
  },
  {
    q: 'هل هناك تجربة مجانية للخطة الاحترافية؟',
    a: 'نعم! نقدم تجربة مجانية لمدة 7 أيام على الخطة الاحترافية دون الحاجة لإدخال بيانات بطاقة الائتمان. استمتع بجميع المميزات المتقدمة وقرر بعدها.',
  },
  {
    q: 'ما طرق الدفع المقبولة؟',
    a: 'نقبل جميع بطاقات الائتمان والخصم الرئيسية (Visa, Mastercard, American Express)، بالإضافة إلى Apple Pay وGoogle Pay.',
  },
  {
    q: 'هل ملفاتي آمنة؟',
    a: 'نعم! جميع معالجة الملفات تتم داخل متصفحك مباشرة ولا يتم رفع ملفاتك إلى خوادمنا. خصوصيتك هي أولويتنا القصوى.',
  },
  {
    q: 'ما الفرق بين الفوترة الشهرية والسنوية؟',
    a: 'الفوترة السنوية توفر لك 40% مقارنة بالفوترة الشهرية. مع الفوترة السنوية تدفع فقط 17 ريال/شهر بدلاً من 29 ريال/شهر.',
  },
  {
    q: 'هل يدعم PDF Smart Hub اللغة العربية؟',
    a: 'نعم! PDF Smart Hub مصمم من البداية لدعم اللغة العربية واتجاه RTL. جميع أدواتنا تعمل مع الملفات العربية بكفاءة كاملة.',
  },
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950" dir="rtl">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4" />
            خطط بسيطة وشفافة
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            اختر الخطة المناسبة لك
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            ابدأ مجاناً وطوّر اشتراكك عند الحاجة. لا عقود مطولة، لا مفاجآت.
          </p>
          <div className="inline-flex items-center gap-4 bg-gray-100 dark:bg-gray-800 rounded-full p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isAnnual ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            >
              شهري
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-400'}`}
            >
              سنوي
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-semibold">وفّر 40%</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            const price = isAnnual ? plan.price.annual : plan.price.monthly
            const isPro = plan.id === 'pro'
            const isEnterprise = plan.id === 'enterprise'
            return (
              <div key={plan.id} className={`relative bg-white dark:bg-gray-900 rounded-2xl border-2 overflow-hidden transition-all hover:shadow-xl ${isPro ? 'border-blue-500 shadow-lg shadow-blue-500/10' : 'border-gray-200 dark:border-gray-800'}`}>
                {isPro && (
                  <div className="absolute top-0 left-0 right-0 bg-blue-500 text-white text-center text-sm font-semibold py-1.5">
                    ⭐ الأكثر شعبية
                  </div>
                )}
                <div className={`p-8 ${isPro ? 'pt-12' : ''}`}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${isPro ? 'bg-blue-100 dark:bg-blue-900/30' : isEnterprise ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className={`w-6 h-6 ${isPro ? 'text-blue-600 dark:text-blue-400' : isEnterprise ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{plan.description}</p>
                  <div className="mb-6">
                    {isEnterprise ? (
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">حسب الطلب</div>
                    ) : (
                      <>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-bold text-gray-900 dark:text-white">{price === 0 ? 'مجاناً' : price}</span>
                          {price !== 0 && (<><span className="text-gray-500 text-lg mb-1">ريال</span><span className="text-gray-400 text-sm mb-1">/شهر</span></>)}
                        </div>
                        {isAnnual && price !== 0 && (<p className="text-sm text-green-600 mt-1">يُدفع سنوياً ({((price as number) * 12).toLocaleString('ar')} ريال/سنة)</p>)}
                        {!isAnnual && isPro && (<p className="text-sm text-gray-400 mt-1">أو 17 ريال/شهر مع الفوترة السنوية</p>)}
                      </>
                    )}
                  </div>
                  <Link href={plan.ctaLink} className={`flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${isPro ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/30' : isEnterprise ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white'}`}>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isPro ? 'text-blue-500' : isEnterprise ? 'text-purple-500' : 'text-green-500'}`} />
                        ) : (
                          <X className="w-5 h-5 mt-0.5 flex-shrink-0 text-gray-300 dark:text-gray-600" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-600'}`}>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-center text-gray-500 text-sm mt-8">جميع الأسعار بالريال السعودي (SAR) وتشمل ضريبة القيمة المضافة.</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-10">أسئلة شائعة حول الأسعار</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-right hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-semibold text-gray-900 dark:text-white text-sm">{faq.q}</span>
                <HelpCircle className={`w-5 h-5 flex-shrink-0 transition-colors ${openFaq === i ? 'text-blue-500' : 'text-gray-400'}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-100 dark:border-gray-800 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">جاهز للبدء؟</h3>
          <p className="text-blue-100 mb-6">انضم إلى آلاف المستخدمين الذين يثقون بـ PDF Smart Hub يومياً</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/sign-up" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-colors">ابدأ مجاناً</Link>
            <Link href="/sign-up?plan=pro" className="bg-blue-600 hover:bg-blue-800 border border-blue-400 px-8 py-3 rounded-xl font-semibold transition-colors">جرّب الخطة الاحترافية</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
