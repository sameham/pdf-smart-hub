import { PDFDocument } from "pdf-lib";

export interface ImageToPDFOptions {
  pageSize: "A4" | "A3" | "Letter" | "Fit";
  orientation: "portrait" | "landscape";
  margin: number;
}

const PAGE_SIZES = {
  A4: { portrait: [595, 842], landscape: [842, 595] },
  A3: { portrait: [842, 1191], landscape: [1191, 842] },
  Letter: { portrait: [612, 792], landscape: [792, 612] },
} as const;

/**
 * تحويل مجموعة صور إلى ملف PDF واحد
 */
export async function imagesToPDF(
  files: File[],
  options: ImageToPDFOptions
): Promise<Blob> {
  if (files.length === 0) {
    throw new Error("يجب اختيار صورة واحدة على الأقل");
  }

  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();

    let image;
    if (file.type === "image/jpeg" || file.type === "image/jpg") {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === "image/png") {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      throw new Error(`نوع الصورة غير مدعوم: ${file.type}`);
    }

    const { width: imgW, height: imgH } = image;
    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === "Fit") {
      pageWidth = options.orientation === "landscape" ? Math.max(imgW, imgH) : imgW;
      pageHeight = options.orientation === "landscape" ? Math.min(imgW, imgH) : imgH;
    } else {
      const dims = PAGE_SIZES[options.pageSize][options.orientation];
      pageWidth = dims[0];
      pageHeight = dims[1];
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // حساب الأبعاد مع الهامش
    const maxW = pageWidth - options.margin * 2;
    const maxH = pageHeight - options.margin * 2;
    const ratio = Math.min(maxW / imgW, maxH / imgH, 1);
    const drawW = imgW * ratio;
    const drawH = imgH * ratio;
    const x = (pageWidth - drawW) / 2;
    const y = (pageHeight - drawH) / 2;

    page.drawImage(image, {
      x,
      y,
      width: drawW,
      height: drawH,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
}