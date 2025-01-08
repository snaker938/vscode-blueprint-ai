/**
 * blueprintAiProcessing.ts
 *
 * 1) Sharp-based image preprocessing (PNG, upscale, grayscale, threshold).
 * 2) image-js morphological ops + connectedComponents for region detection.
 * 3) Tesseract.js@4.0.2 OCR for recognized text + bounding boxes.
 *
 * Exports functions used by blueprintAiService.ts
 */

import sharp from 'sharp';
import { createWorker } from 'tesseract.js';
import { Image } from 'image-js';
// Import type definitions from blueprintAiTypes.ts
import { TesseractWord, BBox, RegionBox } from './blueprintAiTypes';

/**
 * 1) Sharp-based image preprocessing:
 *    - Check metadata().width => if <1200 => 2x upscale
 *    - grayscale() + threshold(128)
 *    - Output as PNG(quality=100)
 */
export async function performSharpPreprocessing(
  rawBuffer: Buffer
): Promise<Buffer> {
  // 1. Read metadata, especially width
  const meta = await sharp(rawBuffer).metadata();
  let targetWidth = meta.width ?? 1200;

  // 2. If <1200, do a naive ~2x upscale
  if (targetWidth < 1200) {
    targetWidth = Math.round(targetWidth * 2);
  }

  // 3. Sharp pipeline: resize -> grayscale -> threshold(128) -> png(quality=100)
  const outBuf = await sharp(rawBuffer, { limitInputPixels: false })
    .resize({
      width: targetWidth,
      withoutEnlargement: true,
    })
    .grayscale() // convert to grayscale
    .threshold(128) // simple binarization
    .png({ quality: 100 })
    .toBuffer();

  return outBuf;
}

/**
 * 2) image-js morphological ops + connectedComponents => region detection
 *    - close({ iterations: 1 }) => remove holes
 *    - open({ iterations: 1 }) => remove specks
 *    - connectedComponents => bounding boxes => region naming
 */
export async function performMorphRegionDetection(
  inputBuffer: Buffer
): Promise<{ cleanedBuffer: Buffer; regionData: RegionBox[] }> {
  // 1. Load the input buffer as an image-js Image
  const jsImage = await Image.load(inputBuffer);

  // 2. morphological close + open
  const closed = jsImage.close({ iterations: 1 });
  const opened = closed.open({ iterations: 1 });

  // 3. Convert to grey => mask => connectedComponents
  const grey = opened.grey();
  const mask = grey.mask({ threshold: 0.5 });
  const components = mask.connectedComponents({ allowCorners: false });

  const regionData: RegionBox[] = [];
  const { width: totalW, height: totalH } = opened;

  for (const comp of components) {
    const { minX, minY, maxX, maxY } = comp;
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    // Basic region naming heuristic
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

  // 4. Convert final "opened" image to PNG => cast to Buffer
  const pngBytes = opened.toBuffer({ format: 'png' });
  const cleanedBuffer = Buffer.from(pngBytes);

  return { cleanedBuffer, regionData };
}

/**
 * 3) Tesseract.js@4.0.2 OCR for recognized text + bounding boxes.
 *    - createWorker => load() => loadLanguage('eng') => initialize('eng')
 *    - setParameters => recognize => data.words => BBox
 */
export async function performOcr(
  finalCleanedBuffer: Buffer
): Promise<{ recognizedText: string; wordBoxes: BBox[] }> {
  // 1. create Tesseract.js worker
  const worker = createWorker();

  // 2. Load + setup English
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  // 3. engine= LSTM_ONLY, psm=7 => SPARSE_TEXT, user_defined_dpi=300
  await worker.setParameters({
    tessedit_ocr_engine_mode: '1', // LSTM_ONLY
    tessedit_pageseg_mode: '7', // SPARSE_TEXT
    user_defined_dpi: '300',
  });

  // 4. Recognize
  const { data } = await worker.recognize(finalCleanedBuffer);
  await worker.terminate();

  // 5. Build recognizedText + wordBoxes from data.words
  const recognizedText: string = data.text || '';
  const words = data.words || [];

  const wordBoxes: BBox[] = words.map((w: TesseractWord) => ({
    text: w.text,
    confidence: w.confidence,
    bbox: [w.bbox.x0, w.bbox.y0, w.bbox.x1, w.bbox.y1],
  }));

  return { recognizedText, wordBoxes };
}
