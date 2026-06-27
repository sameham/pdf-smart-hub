import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تحويل PDF إلى صور PNG وJPG | PDF Smart Hub",
  description: "حوّل كل صفحة من ملف PDF إلى صورة PNG أو JPG بجودة عالية.",
  alternates: { canonical: "https://www.pdfsmarthub.com/pdf-to-image" },
  openGraph: {
    title: "تحويل PDF إلى صور PNG وJPG | PDF Smart Hub",
    description: "حوّل كل صفحة من ملف PDF إلى صورة PNG أو JPG بجودة عالية.",
    url: "https://www.pdfsmarthub.com/pdf-to-image",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
