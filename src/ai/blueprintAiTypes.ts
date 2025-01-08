/**
 * blueprintAiTypes.ts
 *
 * Type definitions for the rest of the AI files.
 */

// Tesseract 'Word' shape from tesseract.js@4.0.2
export interface TesseractWord {
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
}

/** The request shape: user’s textual prompt + raw screenshot bytes. */
export interface BlueprintAIRequest {
  userText: string;
  rawScreenshot: Buffer;
}

/** A bounding box for recognized words. */
export interface BBox {
  text: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x0, y0, x1, y1]
}

/** A region structure from morphological connectedComponents. */
export interface RegionBox {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}
