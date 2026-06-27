import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تدوير صفحات PDF | PDF Smart Hub",
  description: "دوّر صفحات PDF بزاوية 90 أو 180 أو 270 درجة بسهولة وبدون رفع الملف.",
  alternates: { canonical: "https://www.pdfsmarthub.com/rotate-pdf" },
  openGraph: {
    title: "تدوير صفحات PDF | PDF Smart Hub",
    description: "دوّر صفحات PDF بزاوية 90 أو 180 أو 270 درجة بسهولة وبدون رفع الملف.",
    url: "https://www.pdfsmarthub.com/rotate-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
