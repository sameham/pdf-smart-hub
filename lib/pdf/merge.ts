import { PDFDocument } from "pdf-lib";

/**
 * دمج عدة ملفات PDF في ملف واحد
 */
export async function mergePDFs(files: File[]): Promise<Blob> {
  if (files.length < 2) {
    throw new Error("يجب توفير ملفين على الأقل للدمج");
  }

  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
    });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}