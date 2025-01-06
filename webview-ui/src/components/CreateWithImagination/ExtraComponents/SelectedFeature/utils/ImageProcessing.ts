/**
 * imageProcessing.ts
 *
 * Handles image compression, Tesseract OCR, line-level bounding box extraction,
 * filtering, summarization, and final structured output.
 */

import Tesseract from 'tesseract.js';

/**
 * Options for processing
 */
interface ProcessingOptions {
  maxWidth: number; // e.g., 1200
  maxBBoxes: number; // summarization threshold, e.g., 80
  minConfidence: number; // discard lines below this confidence
}

export interface BoundingBox {
  text: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x0, y0, x1, y1]
}

export interface ProcessResult {
  compressedBase64: string; // Compressed image data (minus dataURL prefix)
  boundingBoxes: BoundingBox[]; // The array of line bounding boxes
  imageWidth: number; // Approx. width from bounding boxes
  imageHeight: number; // Approx. height from bounding boxes
}

/**
 * Main function that:
 * 1) Compresses the image via canvas
 * 2) Runs Tesseract at line level
 * 3) Filters out low-confidence lines
 * 4) Summarizes lines if too many
 * 5) Returns final base64 + bounding box data
 */
export async function processImageAndOcr(
  file: File,
  opts: ProcessingOptions
): Promise<ProcessResult> {
  // 1) Compress the image
  const dataUrl = await compressImage(file, opts.maxWidth);
  // dataUrl includes the "data:image/*;base64," prefix
  const compressedBase64 = dataUrl.split(',')[1] || '';

  // 2) OCR (line level)
  const { boundingBoxes, width, height } = await extractLineBoundingBoxes(
    dataUrl
  );

  // 3) Filter by confidence
  const filtered = boundingBoxes.filter(
    (b) => b.confidence >= opts.minConfidence
  );

  // 4) Summarize if we exceed maxBBoxes
  let finalBBoxes = filtered;
  if (filtered.length > opts.maxBBoxes) {
    finalBBoxes = summarizeBoundingBoxes(filtered, opts.maxBBoxes);
  }

  // Return everything
  return {
    compressedBase64,
    boundingBoxes: finalBBoxes,
    imageWidth: width,
    imageHeight: height,
  };
}

/**
 * Compress the image using a canvas-based approach.
 * Returns a dataURL of the compressed result (JPEG).
 */
async function compressImage(file: File, maxWidth: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        // scale if needed
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const w = img.width * scale;
        const h = img.height * scale;

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas not supported for compression.'));
        }
        // Draw the image into canvas
        ctx.drawImage(img, 0, 0, w, h);

        // Convert to data URL at ~80% quality
        const outputUrl = canvas.toDataURL('image/jpeg', 0.8);
        resolve(outputUrl);
      };
      img.onerror = () => {
        reject(new Error('Failed to load image for compression.'));
      };

      if (ev.target?.result) {
        img.src = ev.target.result as string;
      } else {
        reject(new Error('FileReader result empty.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file for compression.'));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Use Tesseract to get line-level bounding boxes.
 * We also compute approximate image width/height by scanning line bboxes.
 */
async function extractLineBoundingBoxes(dataUrl: string) {
  const { data } = await Tesseract.recognize(dataUrl, 'eng');

  // Tesseract lines array
  const lines = data.lines || [];

  let maxX = 0;
  let maxY = 0;

  // Map each line to a bounding box
  const boundingBoxes: BoundingBox[] = lines.map((line) => {
    const x0 = line.bbox.x0;
    const y0 = line.bbox.y0;
    const x1 = line.bbox.x1;
    const y1 = line.bbox.y1;

    // Track max extents for width, height
    if (x1 > maxX) maxX = x1;
    if (y1 > maxY) maxY = y1;

    return {
      text: line.text.trim(),
      confidence: line.confidence,
      bbox: [x0, y0, x1, y1],
    };
  });

  // The approximate "image" dimension is the furthest extent of any line
  return {
    boundingBoxes,
    width: maxX,
    height: maxY,
  };
}

/**
 * Summarize bounding boxes if we exceed a threshold.
 * For example, if we have 200 lines but want a max of 80,
 * we keep top (maxCount - 1) by confidence,
 * then combine the rest into a single line.
 */
function summarizeBoundingBoxes(
  bboxes: BoundingBox[],
  maxCount: number
): BoundingBox[] {
  // Sort by confidence descending
  const sorted = [...bboxes].sort((a, b) => b.confidence - a.confidence);

  // Keep top (maxCount - 1)
  const top = sorted.slice(0, maxCount - 1);

  // Combine the rest into a single bounding box with merged text
  const rest = sorted.slice(maxCount - 1);

  if (rest.length > 0) {
    const combinedText = rest.map((r) => r.text).join(' ');
    const avgConfidence =
      rest.reduce((acc, r) => acc + r.confidence, 0) / rest.length;

    const minX = Math.min(...rest.map((r) => r.bbox[0]));
    const minY = Math.min(...rest.map((r) => r.bbox[1]));
    const maxX = Math.max(...rest.map((r) => r.bbox[2]));
    const maxY = Math.max(...rest.map((r) => r.bbox[3]));

    top.push({
      text: `[SUMMARY of ${rest.length} lines]: ${combinedText}`,
      confidence: avgConfidence,
      bbox: [minX, minY, maxX, maxY],
    });
  }

  return top;
}
