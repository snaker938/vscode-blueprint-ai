/**
 * blueprintAiProcessing.ts
 *
 * 1) Sharp-based image preprocessing (PNG, upscale, grayscale, threshold).
 * 2) image-js morphological ops + ROI manager for region detection.
 * 3) Tesseract.js@4.0.2 OCR for recognized text + bounding boxes.
 *
 * Exports functions used by blueprintAiService.ts
 */

import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';
import { Image } from 'image-js';

// Type definitions from blueprintAiTypes.ts
import { TesseractWord, BBox, RegionBox } from './blueprintAiTypes';

/**
 * Step 1) Sharp-based preprocessing:
 *  - Check metadata().width => if <1200 => ~2x upscale
 *  - grayscale() + threshold(128)
 *  - Output as PNG(quality=100)
 */
export async function performSharpPreprocessing(
  rawBuffer: Buffer
): Promise<Buffer> {
  // 1. Read metadata to see the current width
  const meta = await sharp(rawBuffer).metadata();
  let targetWidth = meta.width ?? 1200;

  // 2. If <1200, naive ~2x upscale
  if (targetWidth < 1200) {
    targetWidth = Math.round(targetWidth * 2);
  }

  // 3. Sharp pipeline: resize -> grayscale -> threshold -> png
  const outBuf = await sharp(rawBuffer, { limitInputPixels: false })
    .resize({ width: targetWidth, withoutEnlargement: true })
    .grayscale()
    .threshold(128)
    .png({ quality: 100 })
    .toBuffer();

  return outBuf;
}

/**
 * Step 2) image-js morphological ops => region detection
 *  - Convert to grey() before morphological close/open
 *  - close({ iterations: 1 }) => fill holes
 *  - open({ iterations: 1 }) => remove specks
 *  - mask({ threshold: 0.5 }) => ROI manager => getRois()
 *  - produce RegionBox[]
 */
export async function performMorphRegionDetection(
  inputBuffer: Buffer
): Promise<{ cleanedBuffer: Buffer; regionData: RegionBox[] }> {
  // 1. Load with image-js
  const jsImage = await Image.load(inputBuffer);

  // 2. Convert to greyscale (required for morphological ops on image-js)
  const grey = jsImage.grey();

  // 3. Morphological close + open on the grayscale image
  const closed = grey.close({ iterations: 1 });
  const opened = closed.open({ iterations: 1 });

  // 4. Create a binary mask from the opened image
  const mask = opened.mask({ threshold: 0.5 });

  // 5. Use the ROI manager to find bounding boxes
  const manager = opened.getRoiManager();
  manager.fromMask(mask);

  // 6. Retrieve the ROIs
  const rois = manager.getRois({ positive: true });

  const regionData: RegionBox[] = [];
  const { width: totalW, height: totalH } = opened;

  for (const roi of rois) {
    const { minX, minY, maxX, maxY } = roi;
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    // Simple naming heuristic
    let name = 'bodyRegion';
    if (minX < 50 && w >= 150 && w <= 300) {
      name = 'sidebar';
    } else if (minY < 50 && h < 200) {
      name = 'topNav';
    } else if (maxX > totalW - 50 && w >= 100 && w <= 300) {
      name = 'rightSidebar';
    } else if (maxY > totalH - 100 && h < 200) {
      name = 'footer';
    }

    regionData.push({ name, x: minX, y: minY, width: w, height: h });
  }

  // 7. Convert final "opened" image to PNG => Buffer
  const pngBytes = opened.toBuffer({ format: 'png' });
  const cleanedBuffer = Buffer.from(pngBytes);

  return { cleanedBuffer, regionData };
}

/**
 * Step 3) Tesseract.js@4.0.2 OCR:
 *  - createWorker('eng', 1, options)
 *  - setParameters to set PSM + DPI
 *  - recognize() => parse data.words => BBox
 */
export async function performOcr(
  finalCleanedBuffer: Buffer
): Promise<{ recognizedText: string; wordBoxes: BBox[] }> {
  // 1. Create Tesseract worker
  const worker = await createWorker('eng', 1, {
    logger: (m) => console.log(m),
  });

  // 2. Set Tesseract parameters
  await worker.setParameters({
    // Use e.g. SINGLE_LINE or SPARSE_TEXT to avoid type errors
    tessedit_pageseg_mode: PSM.SINGLE_LINE,
    user_defined_dpi: '300',
  });

  // 3. Recognize
  const { data } = await worker.recognize(finalCleanedBuffer);

  // 4. Terminate worker
  await worker.terminate();

  // 5. Build recognizedText + wordBoxes
  const recognizedText: string = data.text || '';
  // "words" might not be typed, so cast to 'any'
  const words = (data as any).words || [];

  const wordBoxes: BBox[] = words.map((w: TesseractWord) => ({
    text: w.text,
    confidence: w.confidence,
    bbox: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1],
  }));

  return { recognizedText, wordBoxes };
}
