import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "حماية PDF بكلمة مرور | PDF Smart Hub",
  description: "أضف حماية لملف PDF بكلمة مرور لتأمين محتواك من الوصول غير المصرح.",
  alternates: { canonical: "https://www.pdfsmarthub.com/protect-pdf" },
  openGraph: {
    title: "حماية PDF بكلمة مرور | PDF Smart Hub",
    description: "أضف حماية لملف PDF بكلمة مرور لتأمين محتواك من الوصول غير المصرح.",
    url: "https://www.pdfsmarthub.com/protect-pdf",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Smart Hub" }],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
