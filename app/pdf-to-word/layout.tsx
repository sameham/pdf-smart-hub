import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تحويل PDF إلى Word | PDF Smart Hub",
  description: "استخرج نصوص PDF وحوّلها إلى ملف قابل للتحرير مجاناً وبسرعة.",
  alternates: { canonical: "https://www.pdfsmarthub.com/pdf-to-word" },
  openGraph: {
    title: "تحويل PDF إلى Word | PDF Smart Hub",
    description: "استخرج نصوص PDF وحوّلها إلى ملف قابل للتحرير مجاناً وبسرعة.",
    url: "https://www.pdfsmarthub.com/pdf-to-word",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
