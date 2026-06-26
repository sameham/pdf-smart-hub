import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية لموقع PDF Smart Hub - نحمي بياناتك ولا نشاركها مع أي طرف ثالث.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">سياسة الخصوصية</h1>
          <p className="text-gray-500">آخر تحديث: يناير 2025</p>
        </div>

        <div className="prose prose-gray max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">مقدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              مرحباً بك في PDF Smart Hub. نحن نأخذ خصوصيتك على محمل الجد. 
              تشرح هذه السياسة كيفية تعاملنا مع بياناتك ومعلوماتك الشخصية.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">المعالجة داخل المتصفح</h2>
            <p className="text-gray-600 leading-relaxed">
              الميزة الرئيسية لـ PDF Smart Hub هي أن <strong>جميع عمليات معالجة الملفات تتم داخل متصفحك</strong> مباشرةً. 
              ملفاتك لا تُرفع إلى أي خادم خارجي، مما يعني أنها لا تغادر جهازك أبداً خلال عمليات الضغط، التحويل، الدمج، والتقسيم.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">البيانات التي نجمعها</h2>
            <p className="text-gray-600 leading-relaxed">نجمع فقط:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
              <li>بيانات الاستخدام المجهولة (عدد الزيارات، الصفحات المزارة)</li>
              <li>معلومات تقنية كنوع المتصفح وبيانات الجلسة</li>
              <li>في حالة إنشاء حساب: الاسم وعنوان البريد الإلكتروني فقط</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">كيف نستخدم البيانات</h2>
            <p className="text-gray-600 leading-relaxed">نستخدم البيانات المجمعة لـ:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
              <li>تحسين تجربة المستخدم</li>
              <li>تحليل استخدام الأدوات لتطويرها</li>
              <li>إرسال تحديثات المنتج (إذا اشتركت)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم ملفات تعريف الارتباط الضرورية للأداء الوظيفي للموقع فقط. 
              يمكنك إلغاء تفعيلها من خلال إعدادات متصفحك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">مشاركة البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              <strong>لا نبيع ولا نشارك بياناتك الشخصية مع أي طرف ثالث</strong>. 
              قد نستخدم خدمات تحليلية مجهولة الهوية (مثل Google Analytics) لفهم كيفية استخدام الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">أمان البيانات</h2>
            <p className="text-gray-600 leading-relaxed">
              نستخدم تقنيات التشفير الحديثة (HTTPS) لحماية بياناتك أثناء نقلها. 
              نظراً لأن معالجة الملفات تتم على جهازك، لا توجد مخاطر تتعلق بتسريب محتوى ملفاتك.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">حقوقك</h2>
            <p className="text-gray-600 leading-relaxed">لك الحق في:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
              <li>طلب الاطلاع على بياناتك الشخصية</li>
              <li>طلب تصحيح أو حذف بياناتك</li>
              <li>إلغاء الاشتراك في الرسائل التسويقية</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">التواصل معنا</h2>
            <p className="text-gray-600 leading-relaxed">
              إذا كان لديك أي استفسار حول سياسة الخصوصية، يمكنك التواصل معنا على:{" "}
              <a href="mailto:privacy@pdfsmarthub.com" className="text-blue-600 hover:underline">
                privacy@pdfsmarthub.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <Link href="/" className="text-blue-600 hover:underline text-sm">
            ← العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
