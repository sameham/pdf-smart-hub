import { MetadataRoute } from "next";

const BASE_URL = "https://www.pdfsmarthub.com";

const tools = [
  "compress-pdf",
  "merge-pdf",
  "split-pdf",
  "pdf-to-image",
  "image-to-pdf",
  "word-to-pdf",
  "pdf-to-word",
  "ocr",
  "rotate-pdf",
  "watermark-pdf",
  "unlock-pdf",
  "protect-pdf",
];

const staticPages = [
  "",
  "/pricing",
  "/chat",
  "/blog",
  "/privacy",
  "/terms",
  "/dashboard",
  "/about",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolUrls = tools.map((tool) => ({
    url: `${BASE_URL}/${tool}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const staticUrls = staticPages.map((page) => ({
    url: `${BASE_URL}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? ("daily" as const) : ("monthly" as const),
    priority: page === "" ? 1.0 : 0.6,
  }));

  return [...staticUrls, ...toolUrls];
}
