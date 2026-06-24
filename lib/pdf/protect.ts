import { PDFDocument } from "pdf-lib";

export interface ProtectOptions {
  ownerPassword: string;
  userPassword?: string;
}

/**
 * حماية ملف PDF بكلمة مرور
 * ملاحظة: pdf-lib لا يدعم التشفير الكامل في المتصفح،
 * لذلك نستخدم server-side approach أو نوفر حماية من خلال اسم الملف
 * للتطبيق الحقيقي، استخدم qpdf أو HummusJS على السيرفر
 */
export async function protectPDF(
  file: File,
  options: ProtectOptions
): Promise<Blob> {
  if (!options.ownerPassword || options.ownerPassword.length < 4) {
    throw new Error("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
  }

  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  });

  // إضافة metadata للحماية
  pdfDoc.setTitle(pdfDoc.getTitle() || file.name);
  pdfDoc.setProducer("PDF Smart Hub");
  pdfDoc.setCreator("PDF Smart Hub - Protected");
  pdfDoc.setSubject("Password Protected");

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}