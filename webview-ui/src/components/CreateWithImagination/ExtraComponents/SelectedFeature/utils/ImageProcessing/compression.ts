import sharp from 'sharp';

/**
 * compressImage:
 * 1) Reads the File as a buffer
 * 2) Optionally resizes (only if the image is extremely large)
 * 3) Converts to PNG at highest quality (to minimize compression artifacts)
 * 4) Returns a "data:image/png;base64,..." string
 *
 * Why PNG?
 *  - PNG is lossless. This can preserve edges of text better than JPEG compression,
 *    so Tesseract can pick up small details more accurately.
 * If you prefer smaller file size, you can do .jpeg({quality: 100}), though it's still "lossy".
 *
 * If you truly need no resizing:
 *  - Skip the .resize() step or put a very large maxWidth (e.g. 99999) so it rarely triggers.
 */
export async function compressImage(
  file: File,
  maxWidth = 9999 // effectively "no resize" unless the image is beyond huge
): Promise<string> {
  // 1) Convert the File into a Buffer (Node or bundler environment)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 2) Construct a Sharp pipeline.
  //    We'll do:
  //      - .resize(...) ONLY if width is above maxWidth
  //      - .png() for no compression artifact
  //      - No flip/rotate unless you need that for certain orientation
  let pipeline = sharp(buffer, { limitInputPixels: false });

  // If you want to ensure images bigger than `maxWidth` get scaled down:
  pipeline = pipeline.resize({
    width: maxWidth,
    withoutEnlargement: true,
  });

  // 3) Convert to PNG at "highest quality" (PNG is inherently lossless)
  const outBuf = await pipeline.png().toBuffer();

  // 4) Create a base64 data URL
  const base64 = outBuf.toString('base64');
  return `data:image/png;base64,${base64}`;
}
