import Tesseract, { PSM } from 'tesseract.js';

/**
 * Tesseract config if you want advanced page segmentation
 * or multiple languages: e.g. "eng+fra"
 */
export const OCR_LANG = 'eng';
export const OCR_PSM = PSM.AUTO;
// or PSM.SPARSE_TEXT. Try different modes for complex layouts

/**
 * lineLevelOCR
 * Uses Tesseract "recognize" in line-level approach, returning { lines }.
 */
export async function lineLevelOCR(dataUrl: string) {
  // We can create a worker if you want advanced usage. Or just call Tesseract.recognize directly.
  const { data } = await Tesseract.recognize(dataUrl, OCR_LANG, {
    // Optionally pass logger: (m) => console.log(m),
    // or pass "psm": OCR_PSM. For direct approach:
    //   Tesseract.setParameters({ tessedit_pageseg_mode: OCR_PSM })
  });
  return data;
}
