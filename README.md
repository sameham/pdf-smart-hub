# 📄 PDF Smart Hub

> منصة عربية متكاملة لمعالجة ملفات PDF والصور بسرعة وبخصوصية تامة.

![Status](https://img.shields.io/badge/status-ready-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ المميزات

- 🖇️ **دمج PDF** — ادمج عدة ملفات في ملف واحد
- ✂️ **تقسيم PDF** — قسّم ملف لصفحات منفصلة بنطاقات مرنة
- 📦 **ضغط PDF** — قلّل حجم الملف بكفاءة
- 🖼️ **PDF إلى صورة** — حوّل الصفحات لصور JPG/PNG
- 📷 **صورة إلى PDF** — ادمج الصور بصفحات A4/A3/Letter
- 🔐 **حماية PDF** — احمِ ملفاتك بكلمة مرور
- 🌙 **وضع داكن** — راحة للعين
- 🇸🇦 **دعم عربي كامل** — RTL + خط Tajawal
- 🔒 **خصوصية تامة** — كل المعالجة داخل المتصفح
- ⚡ **بدون رفع للسيرفر** — لا توجد تكلفة سيرفر

## 🛠️ التقنيات

| الطبقة | التقنية |
|--------|---------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| UI Icons | Lucide React |
| Auth + DB | Supabase |
| PDF Processing | pdf-lib + pdfjs-dist |
| Toasts | Sonner |
| Deploy | Vercel |

## 🚀 التشغيل محلياً

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-username/pdf-smart-hub.git
cd pdf-smart-hub
```

### 2. تثبيت المكتبات

```bash
npm install
```

### 3. إعداد البيئة

```bash
cp .env.example .env.local
```

ثم عدّل `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. إعداد Supabase

1. أنشئ مشروع جديد في [supabase.com](https://supabase.com)
2. اذهب لـ **SQL Editor**
3. انسخ محتوى `supabase/schema.sql` وشغّله
4. انسخ `Project URL` و `anon public key` إلى `.env.local`

### 5. تشغيل خادم التطوير

```bash
npm run dev
```

التطبيق يعمل على `http://localhost:3000`

### 6. بناء للإنتاج

```bash
npm run build
npm run start
```

## 📦 النشر على Vercel

### الطريقة الأولى: عبر GitHub

1. ارفع المشروع على GitHub
2. اذهب لـ [vercel.com](https://vercel.com)
3. اضغط **New Project** → Import repo
4. Framework Preset: **Next.js**
5. أضف Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. اضغط **Deploy**

### الطريقة الثانية: عبر Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

## 📂 هيكل المشروع

```
pdf-smart-hub/
├── app/                      # Next.js App Router
│   ├── auth/                 # صفحات المصادقة
│   ├── merge-pdf/            # صفحة دمج PDF
│   ├── split-pdf/            # صفحة تقسيم PDF
│   ├── compress-pdf/         # صفحة ضغط PDF
│   ├── pdf-to-image/         # صفحة PDF → صورة
│   ├── image-to-pdf/         # صفحة صورة → PDF
│   ├── protect-pdf/          # صفحة حماية PDF
│   ├── dashboard/            # لوحة التحكم
│   ├── about/                # صفحة "عن التطبيق"
│   ├── pricing/              # صفحة الأسعار
│   ├── layout.tsx
│   ├── page.tsx              # Landing Page
│   └── globals.css
├── components/               # مكونات مشتركة
│   ├── FileUploader.tsx
│   ├── Navbar.tsx
│   ├── ProcessingStatus.tsx
│   └── ToolLayout.tsx
├── lib/
│   ├── pdf/                  # معالجات PDF
│   │   ├── merge.ts
│   │   ├── split.ts
│   │   ├── compress.ts
│   │   ├── rotate.ts
│   │   ├── protect.ts
│   │   ├── pdf-to-image.ts
│   │   └── image-to-pdf.ts
│   ├── supabase.ts
│   └── utils.ts
├── hooks/
│   └── usePDFProcessor.ts
├── supabase/
│   └── schema.sql
├── .env.example
├── .gitignore
├── tailwind.config.ts
├── postcss.config.js
├── next.config.js
├── tsconfig.json
└── package.json
```

## 🎨 الصفحات

| الصفحة | المسار | الوصف |
|--------|-------|-------|
| Landing | `/` | الصفحة الرئيسية |
| Merge PDF | `/merge-pdf` | دمج ملفات |
| Split PDF | `/split-pdf` | تقسيم ملف |
| Compress PDF | `/compress-pdf` | ضغط ملف |
| PDF to Image | `/pdf-to-image` | تحويل لصور |
| Image to PDF | `/image-to-pdf` | دمج صور |
| Protect PDF | `/protect-pdf` | حماية بكلمة مرور |
| Dashboard | `/dashboard` | سجل العمليات |
| About | `/about` | عن التطبيق |
| Pricing | `/pricing` | الأسعار |
| Login | `/auth/login` | تسجيل دخول |
| Signup | `/auth/signup` | حساب جديد |

## 🔮 تحسينات مستقبلية

- [ ] OCR عربي وإنجليزي (Tesseract.js)
- [ ] اشتراك مدفوع بـ Stripe
- [ ] API عام للمطورين
- [ ] Desktop app (Tauri)
- [ ] Chrome Extension
- [ ] Watermark
- [ ] eSignature
- [ ] Batch processing
- [ ] Multi-language support (EN/FR)

## 🧪 الاختبار

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Build
npm run build
```

## 📝 الترخيص

MIT License - استخدمه بحرية في مشاريعك الشخصية أو التجارية.

## 🤝 المساهمة

المساهمات مرحب بها! افتح Issue أو Pull Request.

## 📧 التواصل

- الموقع: [pdfsmarthub.com](https://pdfsmarthub.com)
- البريد: hello@pdfsmarthub.com

---

صنع بـ ❤️ للمجتمع العربي