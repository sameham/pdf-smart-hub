import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "استخراج نصوص OCR من PDF وصور | PDF Smart Hub",
  description: "استخرج النصوص من ملفات PDF والصور الممسوحة ضوئياً بدعم العربية والإنجليزية.",
  alternates: { canonical: "https://www.pdfsmarthub.com/ocr" },
  openGraph: {
    title: "استخراج نصوص OCR من PDF وصور | PDF Smart Hub",
    description: "استخرج النصوص من ملفات PDF والصور الممسوحة ضوئياً بدعم العربية والإنجليزية.",
    url: "https://www.pdfsmarthub.com/ocr",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
