import { PDFDocument } from "pdf-lib";

export interface SplitRange {
  from: number;
  to: number;
  name?: string;
}

export interface SplitResult {
  blob: Blob;
  filename: string;
}

/**
 * تقسيم ملف PDF إلى عدة ملفات بناءً على نطاقات الصفحات
 */
export async function splitPDF(
  file: File,
  ranges: SplitRange[]
): Promise<SplitResult[]> {
  if (ranges.length === 0) {
    throw new Error("يجب تحديد نطاق واحد على الأقل");
  }

  const arrayBuffer = await file.arrayBuffer();
  const sourcePdf = await PDFDocument.load(arrayBuffer);
  const totalPages = sourcePdf.getPageCount();
  const results: SplitResult[] = [];

  for (const range of ranges) {
    const from = Math.max(0, range.from - 1);
    const to = Math.min(totalPages, range.to);

    if (from >= to || from < 0 || to > totalPages) {
      continue;
    }

    const newPdf = await PDFDocument.create();
    const indices = Array.from({ length: to - from }, (_, i) => from + i);
    const pages = await newPdf.copyPages(sourcePdf, indices);
    pages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    const baseName = file.name.replace(/\.pdf$/i, "");
    const filename = range.name
      ? `${baseName}_${range.name}.pdf`
      : `${baseName}_pages_${range.from}-${range.to}.pdf`;

    results.push({
      blob: new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" }),
      filename,
    });
  }

  if (results.length === 0) {
    throw new Error("لم يتم إنشاء أي ملف - تحقق من النطاقات");
  }

  return results;
}