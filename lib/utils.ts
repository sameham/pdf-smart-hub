import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 بايت";
  const k = 1024;
  const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadMultipleBlobs(blobs: { blob: Blob; filename: string }[]): void {
  blobs.forEach(({ blob, filename }) => downloadBlob(blob, filename));
}

export const TOOLS = [
  {
    id: "merge-pdf",
    nameAr: "دمج PDF",
    nameEn: "Merge PDF",
    description: "ادمج عدة ملفات PDF في ملف واحد",
    icon: "Combine",
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    id: "split-pdf",
    nameAr: "تقسيم PDF",
    nameEn: "Split PDF",
    description: "قسّم ملف PDF لصفحات منفصلة",
    icon: "Split",
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    id: "compress-pdf",
    nameAr: "ضغط PDF",
    nameEn: "Compress PDF",
    description: "قلّل حجم ملف PDF بدون فقدان الجودة",
    icon: "Minimize2",
    color: "green",
    gradient: "from-green-500 to-green-600",
  },
  {
    id: "pdf-to-image",
    nameAr: "PDF إلى صورة",
    nameEn: "PDF to Image",
    description: "حوّل صفحات PDF إلى صور JPG أو PNG",
    icon: "Image",
    color: "orange",
    gradient: "from-orange-500 to-orange-600",
  },
  {
    id: "image-to-pdf",
    nameAr: "صورة إلى PDF",
    nameEn: "Image to PDF",
    description: "ادمج الصور في ملف PDF واحد",
    icon: "FileImage",
    color: "pink",
    gradient: "from-pink-500 to-pink-600",
  },
  {
    id: "protect-pdf",
    nameAr: "حماية PDF",
    nameEn: "Protect PDF",
    description: "احمِ ملف PDF بكلمة مرور",
    icon: "Lock",
    color: "red",
    gradient: "from-red-500 to-red-600",
  },
] as const;

export type ToolId = (typeof TOOLS)[number]["id"];

export function getTool(id: string) {
  return TOOLS.find((t) => t.id === id);
}