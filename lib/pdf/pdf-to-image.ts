export interface PDFToImageOptions {
  format: "png" | "jpeg";
  scale: number;
  quality?: number;
}

export interface PDFToImageResult {
  blob: Blob;
  filename: string;
}

/**
 * تحويل صفحات PDF إلى صور باستخدام pdf.js
 */
export async function pdfToImages(
  file: File,
  options: PDFToImageOptions,
  onProgress?: (progress: number) => void
): Promise<PDFToImageResult[]> {
  // Dynamic import to avoid SSR issues
  const pdfjsLib = await import("pdfjs-dist");

  // Configure worker
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const results: PDFToImageResult[] = [];
  const baseName = file.name.replace(/\.pdf$/i, "");

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: options.scale });

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("فشل تهيئة Canvas");

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error("فشل تحويل الصفحة لصورة"));
        },
        `image/${options.format}`,
        options.quality ?? 0.92
      );
    });

    results.push({
      blob,
      filename: `${baseName}_page_${pageNum}.${options.format === "jpeg" ? "jpg" : "png"}`,
    });

    onProgress?.(Math.round((pageNum / pdf.numPages) * 100));
  }

  return results;
}