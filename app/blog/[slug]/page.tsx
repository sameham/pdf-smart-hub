import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Calendar } from "lucide-react";

type Props = { params: { slug: string } };

const blogPosts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  category: string;
  content: string;
}> = {
  "compress-pdf-guide": {
    title: "كيفية ضغط ملفات PDF بدون فقدان الجودة",
    date: "15 يناير 2025",
    readTime: "5 دقائق",
    category: "أدلة",
    content: `
ضغط ملفات PDF هو عملية تقليل حجم الملف مع الحفاظ على جودة المحتوى قدر الإمكان. 
في هذا الدليل، سنشرح أفضل الطرق لتحقيق ذلك.

## لماذا تضغط ملفات PDF؟

- تسهيل مشاركة الملفات عبر البريد الإلكتروني
- توفير مساحة التخزين
- تسريع تحميل الملفات على المواقع
- تحسين تجربة المستخدم

## طرق ضغط PDF

### 1. الضغط عبر المتصفح
أسهل طريقة هي استخدام أدوات مثل PDF Smart Hub التي تعمل مباشرة في متصفحك دون رفع الملف لأي سيرفر.

### 2. تقليل دقة الصور
معظم حجم ملف PDF يأتي من الصور. تقليل دقتها من 300 DPI إلى 150 DPI يقلل الحجم بشكل كبير.

### 3. إزالة البيانات الزائدة
الملفات تحتوي أحياناً على بيانات مخفية غير ضرورية يمكن إزالتها.

## نصائح للحصول على أفضل نتيجة

1. جرب مستويات ضغط مختلفة وقارن النتائج
2. للمستندات النصية، يمكن الضغط بقوة دون فقدان الجودة
3. للمستندات المصورة، استخدم ضغطاً معتدلاً

## الخلاصة

ضغط PDF بشكل صحيح يوفر عليك مساحة وجهداً دون التأثير على قراءة المحتوى.
    `,
  },
  "pdf-to-word-tips": {
    title: "تحويل PDF إلى Word: الدليل الكامل",
    date: "10 يناير 2025",
    readTime: "7 دقائق",
    category: "تحويل",
    content: `
تحويل PDF إلى Word يتيح لك تحرير المحتوى بسهولة. إليك كل ما تحتاج معرفته.

## متى تحتاج تحويل PDF إلى Word؟

- عند الحاجة لتعديل محتوى الملف
- لاستخراج النصوص للاستخدام في مستند آخر
- لإعادة تنسيق المحتوى

## أنواع ملفات PDF وتأثيرها على التحويل

### PDF نصي
هذا النوع يحتوي على نصوص فعلية ويُحوَّل بسهولة وجودة عالية.

### PDF مصور (Scanned)
هذا النوع عبارة عن صور، ويحتاج OCR لاستخراج النصوص.

## نصائح للحصول على أفضل تحويل

1. تأكد أن الملف نصي وليس مصوراً
2. ابحث عن ملفات غير محمية
3. راجع الملف المحوَّل وصحح أي أخطاء

## الخلاصة

التحويل الجيد يتطلب ملفاً بجودة عالية ونصوصاً قابلة للاستخراج.
    `,
  },
  "ocr-arabic-pdf": {
    title: "استخراج النصوص العربية من PDF باستخدام OCR",
    date: "5 يناير 2025",
    readTime: "6 دقائق",
    category: "OCR",
    content: `
تقنية OCR (التعرف البصري على الحروف) تتيح استخراج النصوص من الصور وملفات PDF الممسوحة ضوئياً.

## ما هي تقنية OCR؟

OCR هي تقنية تحليل الصور لاستخراج النصوص منها. تعمل بتحليل أشكال الحروف والكلمات.

## تحديات اللغة العربية

اللغة العربية تُكتب من اليمين لليسار وتتصل حروفها، مما يجعل OCR أكثر تعقيداً.

## كيفية الحصول على أفضل نتائج

1. استخدم مستندات بدقة عالية (300 DPI أو أكثر)
2. تأكد من وضوح الصورة وعدم إمالتها
3. تجنب الصور الفوتوغرافية ذات الخلفية المعقدة

## الخلاصة

OCR أداة قوية لرقمنة المستندات الورقية وجعلها قابلة للبحث والتحرير.
    `,
  },
};

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts[params.slug];
  if (!post) return { title: "مقال غير موجود" };
  return {
    title: post.title,
    description: post.content.slice(0, 160).trim(),
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = blogPosts[params.slug];
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 text-sm font-medium">
          <ArrowRight className="w-4 h-4" />
          العودة للمدونة
        </Link>

        {/* Header */}
        <div className="mb-8">
          <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">{post.category}</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{post.title}</h1>
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime} قراءة
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-gray max-w-none">
          {post.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>;
            } else if (line.startsWith("### ")) {
              return <h3 key={i} className="text-lg font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>;
            } else if (line.match(/^\d+\. /)) {
              return <p key={i} className="text-gray-600 leading-relaxed my-1 mr-4">{line}</p>;
            } else if (line.trim()) {
              return <p key={i} className="text-gray-600 leading-relaxed my-3">{line}</p>;
            }
            return null;
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-blue-50 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">جرب أدوات PDF Smart Hub</h3>
          <p className="text-gray-600 text-sm mb-4">أدوات PDF مجانية تعمل مباشرة في متصفحك</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors">
            استكشف الأدوات
          </Link>
        </div>
      </div>
    </div>
  );
}
