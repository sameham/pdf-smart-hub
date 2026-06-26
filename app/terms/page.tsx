import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "شروط الاستخدام",
  description: "شروط وأحكام استخدام موقع PDF Smart Hub.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">شروط الاستخدام</h1>
          <p className="text-gray-500">آخر تحديث: يناير 2025</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">قبول الشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              باستخدامك لموقع PDF Smart Hub، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
              إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">وصف الخدمة</h2>
            <p className="text-gray-600 leading-relaxed">
              PDF Smart Hub هي منصة مجانية لمعالجة ملفات PDF تشمل: الضغط، التحويل، الدمج، التقسيم، 
              الدوران، إضافة العلامات المائية، استخراج النصوص، وغيرها. 
              جميع العمليات تتم داخل متصفحك دون رفع الملفات لخوادمنا.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">الاستخدام المقبول</h2>
            <p className="text-gray-600 leading-relaxed">توافق على استخدام الخدمة فقط لـ:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
              <li>معالجة الملفات التي تملكها أو لديك صلاحية قانونية للوصول إليها</li>
              <li>الأغراض القانونية والمشروعة فقط</li>
              <li>الاستخدام الشخصي أو التجاري المشروع</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">الاستخدام المحظور</h2>
            <p className="text-gray-600 leading-relaxed">يُحظر عليك:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 mt-2">
              <li>معالجة ملفات محمية بحقوق الملكية الفكرية دون إذن</li>
              <li>استخدام الخدمة لأغراض غير قانونية</li>
              <li>محاولة اختراق أو تعطيل المنصة</li>
              <li>إنشاء حسابات وهمية متعددة</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">إخلاء المسؤولية</h2>
            <p className="text-gray-600 leading-relaxed">
              تُقدَّم الخدمة "كما هي" دون أي ضمانات صريحة أو ضمنية. 
              لا نتحمل مسؤولية أي خسارة في البيانات أو أضرار ناتجة عن استخدام الخدمة. 
              ننصح دائماً بالاحتفاظ بنسخ احتياطية من ملفاتك المهمة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">الملكية الفكرية</h2>
            <p className="text-gray-600 leading-relaxed">
              جميع حقوق الملكية الفكرية لمنصة PDF Smart Hub محفوظة. 
              لا يحق لك نسخ أو إعادة توزيع محتوى الموقع أو كوده المصدري دون إذن مسبق.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">الخدمات المجانية والمدفوعة</h2>
            <p className="text-gray-600 leading-relaxed">
              توفر المنصة مستوى مجاني مع حدود استخدام معقولة، ومستويات مدفوعة تتيح استخداماً غير محدود. 
              نحتفظ بحق تعديل خطط الأسعار مع إشعار مسبق للمشتركين.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">تعديل الشروط</h2>
            <p className="text-gray-600 leading-relaxed">
              نحتفظ بحق تعديل هذه الشروط في أي وقت. 
              استمرار استخدامك للموقع بعد التعديلات يعني موافقتك على الشروط الجديدة.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">التواصل</h2>
            <p className="text-gray-600 leading-relaxed">
              للاستفسار عن شروط الاستخدام:{" "}
              <a href="mailto:legal@pdfsmarthub.com" className="text-blue-600 hover:underline">
                legal@pdfsmarthub.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 flex gap-6">
          <Link href="/" className="text-blue-600 hover:underline text-sm">← العودة للرئيسية</Link>
          <Link href="/privacy" className="text-blue-600 hover:underline text-sm">سياسة الخصوصية</Link>
        </div>
      </div>
    </div>
  );
}
