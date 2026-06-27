import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ضغط PDF بدون فقدان الجودة | PDF Smart Hub",
  description: "قلّل حجم ملفات PDF مجاناً مع الحفاظ على الجودة. يعمل داخل المتصفح بدون رفع الملف.",
  alternates: { canonical: "https://www.pdfsmarthub.com/compress-pdf" },
  openGraph: {
    title: "ضغط PDF بدون فقدان الجودة | PDF Smart Hub",
    description: "قلّل حجم ملفات PDF مجاناً مع الحفاظ على الجودة. يعمل داخل المتصفح بدون رفع الملف.",
    url: "https://www.pdfsmarthub.com/compress-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
