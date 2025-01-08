/**
 * blueprintAiProcessing.ts
 *
 * 1) Sharp-based image preprocessing (PNG, upscale, grayscale, threshold).
 * 2) image-js morphological ops + label() for region detection.
 * 3) Tesseract.js@4.0.2 OCR for recognized text + bounding boxes,
 *    referencing your custom doc.
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
  // Check input width
  const meta = await sharp(rawBuffer).metadata();
  let targetWidth = meta.width ?? 1200;

  // If <1200, do approximate 2x upscale
  if (targetWidth < 1200) {
    targetWidth = Math.round(targetWidth * 2);
  }

  // Sharp pipeline: resize -> grayscale -> threshold -> png
  const outBuf = await sharp(rawBuffer, { limitInputPixels: false })
    .resize({
      width: targetWidth,
      withoutEnlargement: true,
    })
    .grayscale()
    .threshold(128)
    .png({ quality: 100 })
    .toBuffer();

  return outBuf;
}

/**
 * Step 2) image-js morphological ops + label() => region detection
 *  - close({ iterations: 1 }) => fill small holes
 *  - open({ iterations: 1 }) => remove specks
 *  - grey() => mask() => label({ allowCorners: false })
 *  - iterate all labeled ROIs => bounding boxes => region naming
 */
export async function performMorphRegionDetection(
  inputBuffer: Buffer
): Promise<{ cleanedBuffer: Buffer; regionData: RegionBox[] }> {
  // 1. Load the image via image-js
  const jsImage = await Image.load(inputBuffer);

  // 2. Morphological close + open
  const closed = jsImage.close({ iterations: 1 }); // fill small holes
  const opened = closed.open({ iterations: 1 }); // remove small specks

  // 3. Convert to grey => produce a 1-bit mask => threshold ~0.5
  const grey = opened.grey();
  const mask = grey.mask({ threshold: 0.5 });

  // 4. Use the ROI manager on the "opened" image (so bounding boxes refer back to it)
  const manager = opened.getRoiManager();
  manager.fromMask(mask);

  // Retrieve all ROIs
  // e.g., { positive: true, minSurface: 1 } can filter out too-small regions
  const rois = manager.getRois({ positive: true });

  const regionData: RegionBox[] = [];
  const { width: totalW, height: totalH } = opened;

  // Each ROI has minX, minY, maxX, maxY, among other properties
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

    regionData.push({
      name,
      x: minX,
      y: minY,
      width: w,
      height: h,
    });
  }

  // 5. Convert final "opened" image back to PNG => cast to Buffer
  //    This "cleaned" image is your morphological output
  const pngBytes = opened.toBuffer({ format: 'png' });
  const cleanedBuffer = Buffer.from(pngBytes);

  return { cleanedBuffer, regionData };
}

/**
 * Step 3) Tesseract.js@4.0.2 OCR:
 *  - createWorker('eng'...) => worker
 *  - setParameters to set PSM (via PSM enum) + DPI
 *  - recognize(...) => parse data.words => BBox
 */
export async function performOcr(
  finalCleanedBuffer: Buffer
): Promise<{ recognizedText: string; wordBoxes: BBox[] }> {
  // createWorker from Tesseract.js, specifying English
  // Note: v4.0.2 syntax might differ from newer versions
  const worker = await createWorker('eng', 1, {
    logger: (m) => console.log(m),
  });

  // Set Tesseract parameters
  // Use PSM.SINGLE_LINE or PSM.SPARSE_TEXT to avoid type errors
  await worker.setParameters({
    tessedit_pageseg_mode: PSM.SINGLE_LINE,
    user_defined_dpi: '300',
  });

  // Perform OCR
  const { data } = await worker.recognize(finalCleanedBuffer);

  // Terminate worker
  await worker.terminate();

  // Build recognizedText + wordBoxes
  const recognizedText: string = data.text || '';
  // In older Tesseract.js, "words" might not be typed, so cast to "any"
  const words = (data as any).words || [];

  const wordBoxes: BBox[] = words.map((w: TesseractWord) => ({
    text: w.text,
    confidence: w.confidence,
    bbox: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1],
  }));

  return { recognizedText, wordBoxes };
}
