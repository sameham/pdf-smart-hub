# 🚀 نشر PDF Smart Hub على Vercel

## الطريقة الأسرع: بنقرة واحدة

اضغط الزر ده:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sameham/pdf-smart-hub&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY&envDescription=Supabase%20credentials%20needed&envLink=https://github.com/sameham/pdf-smart-hub)

## الطريقة الكاملة خطوة بخطوة

### 1️⃣ إنشاء Vercel Account
- روح [vercel.com](https://vercel.com/signup)
- سجّل بـ GitHub

### 2️⃣ Import المشروع
- افتح [vercel.com/new](https://vercel.com/new)
- اضغط **Import Git Repository**
- اختار `sameham/pdf-smart-hub`
- اضغط **Import**

### 3️⃣ Environment Variables
أضف المتغيرات دي:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |

### 4️⃣ Deploy
- اضغط **Deploy** ✨
- استنى 2-3 دقايق
- مبروك! 🎉 موقعك شغال

---

## 🔧 إعداد Supabase (مطلوب قبل النشر)

### 1. إنشاء مشروع
- افتح [supabase.com](https://supabase.com)
- **New Project**
- سمّيه `pdf-smart-hub`
- احفظ الـ Database Password في مكان آمن

### 2. تشغيل Database Schema
- روح **SQL Editor** في Supabase Dashboard
- انسخ محتوى [`supabase/schema.sql`](./supabase/schema.sql)
- الصقه في الـ Editor
- اضغط **Run**

### 3. الحصول على Credentials
- **Settings** → **API**
- انسخ:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. تفعيل Authentication
- **Authentication** → **Providers**
- فعّل **Email**
- **URL Configuration**:
  - Site URL: `https://your-app.vercel.app`
  - Redirect URLs: `https://your-app.vercel.app/**`

---

## 🤖 نشر تلقائي عبر GitHub Actions

بعد ما تعمل أول deploy:

1. **Vercel Dashboard** → Project Settings → **Git**
2. تأكد إن **Production Branch** = `main`
3. كل push لـ `main` هيعمل deploy تلقائي

### إضافة Vercel Token للـ CI/CD (اختياري):
1. [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create Token → سمّيه `github-actions`
3. **GitHub Repo** → Settings → Secrets → **New Secret**:
   - Name: `VERCEL_TOKEN`
   - Value: الـ token من Vercel

---

## 🌐 Custom Domain

### إضافة Domain خاص:
1. **Vercel Dashboard** → Project → **Settings** → **Domains**
2. اكتب الـ domain (مثلاً `pdfsmarthub.com`)
3. أضف الـ DNS records عند مزود الـ domain:
   ```
   A    @    76.76.21.21
   CNAME www  cname.vercel-dns.com
   ```

---

## 🐛 Troubleshooting

### Build Failed
- تأكد إن `NEXT_PUBLIC_SUPABASE_URL` صحيح
- شوف الـ logs في Vercel Dashboard

### Supabase Connection Error
- تأكد إن الـ anon key صحيح
- تأكد إن Supabase project مش paused

### Routes مش شغالة
- امسح الـ `.next` cache
- اعمل Redeploy من Vercel

---

## 📊 Performance Monitoring

### Vercel Analytics (مجاني):
1. **Project** → **Analytics** → **Enable**

### Speed Insights:
1. **Project** → **Speed Insights** → **Enable**

---

صنع بـ ❤️ للمجتمع العربي