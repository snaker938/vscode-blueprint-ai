import { compressImage } from './compression';
import { preprocessImage } from './preProcessing';
import { lineLevelOCR } from './ocr';
import {
  buildLineBoundingBoxes,
  summarizeBoundingBoxes,
} from './boundingBoxes';
import { BoundingBox, ProcessResult } from './types';

interface ProcessingOptions {
  maxWidth: number; // e.g. 1200
  maxBBoxes: number; // e.g. 80
  minConfidence: number; // discard lines below this
}

/**
 * processImageAndOcr:
 * 1) Compress (using Sharp)
 * 2) (Optional) Preprocess (grayscale, threshold)
 * 3) Tesseract OCR (line level)
 * 4) Extract bounding boxes, filter by confidence
 * 5) Summarize if too many
 * 6) Return final result (base64, boundingBoxes, recognizedText, etc.)
 */
export async function processImageAndOcr(
  file: File,
  opts: ProcessingOptions,
  doThreshold = false // extra param if you want threshold
): Promise<ProcessResult> {
  // 1) Compress
  const dataUrl = await compressImage(file, opts.maxWidth);

  // 2) Preprocess (optional)
  const preprocessed = await preprocessImage(dataUrl, doThreshold);

  // 3) OCR
  const ocrData = await lineLevelOCR(preprocessed);

  // 4) Extract bounding boxes
  const { boundingBoxes, maxX, maxY, recognizedFullText } =
    buildLineBoundingBoxes(ocrData);

  // 5) Filter by confidence
  const filtered = boundingBoxes.filter(
    (b) => b.confidence >= opts.minConfidence
  );

  // 6) Summarize if we exceed maxBBoxes
  let finalBBoxes: BoundingBox[] = filtered;
  if (filtered.length > opts.maxBBoxes) {
    finalBBoxes = summarizeBoundingBoxes(filtered, opts.maxBBoxes);
  }

  return {
    compressedBase64: dataUrl.replace(/^data:image\/\w+;base64,/, ''),
    boundingBoxes: finalBBoxes,
    imageWidth: maxX,
    imageHeight: maxY,
    recognizedText: recognizedFullText,
  };
}
