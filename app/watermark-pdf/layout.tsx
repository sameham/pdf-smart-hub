import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إضافة علامة مائية لـ PDF | PDF Smart Hub",
  description: "أضف علامة مائية نصية مخصصة لكل صفحات ملف PDF لحماية محتواك.",
  alternates: { canonical: "https://www.pdfsmarthub.com/watermark-pdf" },
  openGraph: {
    title: "إضافة علامة مائية لـ PDF | PDF Smart Hub",
    description: "أضف علامة مائية نصية مخصصة لكل صفحات ملف PDF لحماية محتواك.",
    url: "https://www.pdfsmarthub.com/watermark-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
