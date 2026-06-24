import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PDF Smart Hub - أدوات PDF مجانية",
    template: "%s | PDF Smart Hub",
  },
  description:
    "دمج، تقسيم، ضغط وتحويل ملفات PDF مجاناً وبخصوصية تامة. كل المعالجة تتم داخل متصفحك بدون رفع للسيرفر.",
  keywords: [
    "PDF",
    "دمج PDF",
    "ضغط PDF",
    "تحويل PDF",
    "أدوات PDF عربية",
    "PDF Smart Hub",
  ],
  authors: [{ name: "PDF Smart Hub" }],
  creator: "PDF Smart Hub",
  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://pdfsmarthub.com",
    title: "PDF Smart Hub",
    description: "أدوات PDF مجانية وسريعة بخصوصية تامة",
    siteName: "PDF Smart Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Smart Hub",
    description: "أدوات PDF مجانية وسريعة",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="font-sans antialiased min-h-screen">
        <Navbar />
        <main>{children}</main>
        <Toaster position="top-center" richColors dir="rtl" />
      </body>
    </html>
  );
}