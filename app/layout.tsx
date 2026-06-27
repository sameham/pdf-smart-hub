import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/footer";
import { BackToTop } from "@/components/BackToTop";
import Script from "next/script";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pdfsmarthub.com"),
  title: {
    default: "PDF Smart Hub - أدوات PDF مجانية",
    template: "%s | PDF Smart Hub",
  },
  description:
    "أدوات PDF مجانية وذكية: ضغط، تحويل، دمج، تقسيم، OCR، وأكثر. جميع المعالجات تتم داخل متصفحك بدون رفع للسيرفر، كل المعالجة تتم داخل متصفحك بدون رفع وتحويل ملفاتك.",
  keywords: [
    "PDF",
    "أدوات PDF",
    "ضغط PDF",
    "تحويل PDF",
    "دمج PDF",
    "تقسيم PDF",
    "PDF مجاني",
    "OCR",
    "Word to PDF",
    "PDF to Word",
  ],
  authors: [{ name: "PDF Smart Hub" }],
  creator: "PDF Smart Hub",
  publisher: "PDF Smart Hub",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://www.pdfsmarthub.com",
    siteName: "PDF Smart Hub",
    title: "PDF Smart Hub - أدوات PDF مجانية",
    description:
      "أدوات PDF مجانية وذكية: ضغط، تحويل، دمج، تقسيم، OCR، وأكثر. جميع المعالجات تتم داخل متصفحك.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDF Smart Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Smart Hub - أدوات PDF مجانية",
    description:
      "أدوات PDF مجانية وذكية: ضغط، تحويل، دمج، تقسيم، OCR، وأكثر.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.pdfsmarthub.com",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PDF Smart Hub",
  url: "https://www.pdfsmarthub.com",
  description:
    "أدوات PDF مجانية وذكية للمعالجة داخل المتصفح",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate:
        "https://www.pdfsmarthub.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="google-site-verification" content="your-verification-code" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={`${tajawal.className} antialiased min-h-screen bg-background text-foreground`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
        <Navbar />
        <main className="min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Footer />
        <BackToTop />
        <Toaster
          position="top-center"
          richColors
          duration={3000}
          closeButton
        />
      </body>
    </html>
  );
}
