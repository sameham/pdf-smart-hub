import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تقسيم PDF إلى صفحات | PDF Smart Hub",
  description: "قسّم ملف PDF إلى ملفات منفصلة حسب نطاقات الصفحات. مجاني وسريع وخاص.",
  alternates: { canonical: "https://www.pdfsmarthub.com/split-pdf" },
  openGraph: {
    title: "تقسيم PDF إلى صفحات | PDF Smart Hub",
    description: "قسّم ملف PDF إلى ملفات منفصلة حسب نطاقات الصفحات. مجاني وسريع وخاص.",
    url: "https://www.pdfsmarthub.com/split-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
