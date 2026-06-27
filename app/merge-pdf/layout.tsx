import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "دمج ملفات PDF مجاناً | PDF Smart Hub",
  description: "ادمج ملفات PDF متعددة في ملف واحد بسرعة وبخصوصية تامة داخل متصفحك.",
  alternates: { canonical: "https://www.pdfsmarthub.com/merge-pdf" },
  openGraph: {
    title: "دمج ملفات PDF مجاناً | PDF Smart Hub",
    description: "ادمج ملفات PDF متعددة في ملف واحد بسرعة وبخصوصية تامة داخل متصفحك.",
    url: "https://www.pdfsmarthub.com/merge-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
