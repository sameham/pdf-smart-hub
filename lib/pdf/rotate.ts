import { PDFDocument, degrees } from "pdf-lib";

/**
 * تدوير صفحات ملف PDF
 */
export async function rotatePDF(
  file: File,
  rotation: 90 | 180 | 270
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  pdfDoc.getPages().forEach((page) => {
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + rotation) % 360));
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}