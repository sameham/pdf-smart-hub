import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فتح وإزالة حماية PDF | PDF Smart Hub",
  description: "أزل كلمة مرور ملف PDF وافتحه بحرية داخل متصفحك بدون برامج.",
  alternates: { canonical: "https://www.pdfsmarthub.com/unlock-pdf" },
  openGraph: {
    title: "فتح وإزالة حماية PDF | PDF Smart Hub",
    description: "أزل كلمة مرور ملف PDF وافتحه بحرية داخل متصفحك بدون برامج.",
    url: "https://www.pdfsmarthub.com/unlock-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
