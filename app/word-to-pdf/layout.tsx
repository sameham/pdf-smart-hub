import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تحويل Word إلى PDF مجاناً | PDF Smart Hub",
  description: "حوّل ملفات Word (doc, docx) إلى PDF مجاناً وبسرعة داخل المتصفح.",
  alternates: { canonical: "https://www.pdfsmarthub.com/word-to-pdf" },
  openGraph: {
    title: "تحويل Word إلى PDF مجاناً | PDF Smart Hub",
    description: "حوّل ملفات Word (doc, docx) إلى PDF مجاناً وبسرعة داخل المتصفح.",
    url: "https://www.pdfsmarthub.com/word-to-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
