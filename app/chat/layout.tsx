import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "محادثة مع PDF بالذكاء الاصطناعي | PDF Smart Hub",
  description: "اسأل أسئلة وتحدث مع محتوى أي ملف PDF باستخدام الذكاء الاصطناعي.",
  alternates: { canonical: "https://www.pdfsmarthub.com/chat" },
  openGraph: {
    title: "محادثة مع PDF بالذكاء الاصطناعي | PDF Smart Hub",
    description: "اسأل أسئلة وتحدث مع محتوى أي ملف PDF باستخدام الذكاء الاصطناعي.",
    url: "https://www.pdfsmarthub.com/chat",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
