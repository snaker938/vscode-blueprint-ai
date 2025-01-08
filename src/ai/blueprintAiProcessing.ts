/**
 * blueprintAiProcessing.ts
 *
 * 1) Sharp-based image preprocessing (PNG, upscaled if width < 1200, grayscale).
 *    - We'll remove the overly aggressive .threshold(128) from Sharp so Tesseract sees more detail.
 * 2) image-js morphological ops + ROI manager for region detection.
 *    - We'll do morphological close/open, then produce a mask (with an internal threshold).
 *    - We'll also filter out small ROIs with minSurface: e.g. 100 or 200 to drop noise.
 * 3) Tesseract.js OCR for recognized text + bounding boxes.
 */

import sharp from 'sharp';
import { createWorker, PSM } from 'tesseract.js';
import { Image } from 'image-js';

// Type definitions
import { TesseractWord, BBox, RegionBox } from './blueprintAiTypes';

/**
 * Step 1) Sharp-based preprocessing:
 *  - If width < 1200, ~2x upscale
 *  - Convert to grayscale (but skip the harsh threshold here to keep detail).
 *  - Output as PNG(quality=100).
 */
export async function performSharpPreprocessing(
  rawBuffer: Buffer
): Promise<Buffer> {
  // 1. Read metadata
  const meta = await sharp(rawBuffer).metadata();
  let targetWidth = meta.width ?? 1200;
  if (targetWidth < 1200) {
    targetWidth = Math.round(targetWidth * 2);
  }

  // 2. Sharp pipeline: resize -> grayscale -> png
  //    (No threshold(128) here to preserve text details for Tesseract.)
  const outBuf = await sharp(rawBuffer, { limitInputPixels: false })
    .resize({ width: targetWidth, withoutEnlargement: true })
    .grayscale()
    .png({ quality: 100 })
    .toBuffer();

  return outBuf;
}

/**
 * Step 2) image-js morphological ops => region detection.
 *  - Convert to grey() if needed for morphological close/open
 *  - mask() with an internal threshold => we keep biggish shapes
 *  - fromMask -> getRois({ positive:true, minSurface: ??? }) to skip tiny noise
 */
export async function performMorphRegionDetection(
  inputBuffer: Buffer
): Promise<{ cleanedBuffer: Buffer; regionData: RegionBox[] }> {
  // 1. Load into image-js
  const jsImage = await Image.load(inputBuffer);

  // 2. Morphological ops require grayscale
  const grey = jsImage.grey();

  // 3. close + open
  const closed = grey.close({ iterations: 1 });
  const opened = closed.open({ iterations: 1 });

  // 4. Create binary mask from the "opened" result
  //    Let image-js internally threshold. The default method is a simple 0.5 cutoff
  const mask = opened.mask({
    algorithm: 'threshold', // or e.g. "li", "otsu", etc. for auto-threshold
    threshold: 0.5,
  });

  // 5. ROI manager to label bounding boxes
  const manager = opened.getRoiManager();
  manager.fromMask(mask);

  // 6. Retrieve only larger ROIs to avoid hundreds of small specks
  //    Try minSurface=200 (tweak up/down as needed)
  const rois = manager.getRois({
    positive: true,
    minSurface: 200,
  });

  const regionData: RegionBox[] = [];
  const { width: totalW, height: totalH } = opened;

  for (const roi of rois) {
    const { minX, minY, maxX, maxY } = roi;
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    // Very naive naming logic
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

    regionData.push({
      name,
      x: minX,
      y: minY,
      width: w,
      height: h,
    });
  }

  // 7. Convert final "opened" image to PNG => Buffer
  const pngBytes = opened.toBuffer({ format: 'png' });
  const cleanedBuffer = Buffer.from(pngBytes);

  return { cleanedBuffer, regionData };
}

/**
 * Step 3) Tesseract.js@4.0.2 OCR
 *  - createWorker('eng'...) => worker
 *  - setParameters(PSM, user_defined_dpi, etc.)
 *  - recognize() => parse data.words => BBox
 */
export async function performOcr(
  finalCleanedBuffer: Buffer
): Promise<{ recognizedText: string; wordBoxes: BBox[] }> {
  // 1. Create Tesseract worker with e.g. English
  const worker = await createWorker('eng', 1, {
    logger: (m) => console.log(m),
  });

  // 2. Some doc pages benefit from e.g. SPARSE_TEXT to grab partial text
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SPARSE_TEXT, // or SINGLE_BLOCK
    user_defined_dpi: '300',
  });

  // 3. Recognize
  const { data } = await worker.recognize(finalCleanedBuffer);

  // 4. Terminate
  await worker.terminate();

  // 5. Build recognized text + bounding boxes
  const recognizedText = data.text || '';
  // "words" may not be typed => cast to any
  const words = (data as any).words || [];

  const wordBoxes: BBox[] = words.map((w: TesseractWord) => ({
    text: w.text,
    confidence: w.confidence,
    bbox: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1],
  }));

  return { recognizedText, wordBoxes };
}
