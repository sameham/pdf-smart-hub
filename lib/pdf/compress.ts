import { PDFDocument } from "pdf-lib";

/**
 * ضغط ملف PDF عن طريق إعادة حفظه بإعدادات محسّنة
 */
export async function compressPDF(file: File): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
    objectsPerTick: 100,
  });

  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}