import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تحويل صور إلى PDF | PDF Smart Hub",
  description: "اجمع صور JPG و PNG في ملف PDF واحد مع التحكم في الحجم والاتجاه.",
  alternates: { canonical: "https://www.pdfsmarthub.com/image-to-pdf" },
  openGraph: {
    title: "تحويل صور إلى PDF | PDF Smart Hub",
    description: "اجمع صور JPG و PNG في ملف PDF واحد مع التحكم في الحجم والاتجاه.",
    url: "https://www.pdfsmarthub.com/image-to-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
