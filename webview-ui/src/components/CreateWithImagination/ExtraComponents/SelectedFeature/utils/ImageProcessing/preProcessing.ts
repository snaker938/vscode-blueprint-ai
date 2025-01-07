import sharp from 'sharp';

/**
 * Optionally apply grayscale, threshold, or other transformations
 * to reduce background noise in a busy screenshot.
 * Return a data URL again for Tesseract.
 */
export async function preprocessImage(
  dataUrl: string,
  threshold = false
): Promise<string> {
  // Convert dataUrl to Buffer
  const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  // Use Sharp transformations
  let pipeline = sharp(buffer).grayscale(); // convert to grayscale

  if (threshold) {
    // apply a simple threshold to create black/white image
    pipeline = pipeline.threshold(128);
  }

  // Output as PNG or JPEG for Tesseract
  const outBuf = await pipeline
    .png() // or .jpeg()
    .toBuffer();

  const final64 = outBuf.toString('base64');
  return `data:image/png;base64,${final64}`;
}
