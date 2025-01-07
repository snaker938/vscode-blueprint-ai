export interface BoundingBox {
  text: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x0, y0, x1, y1]
}

export interface ProcessResult {
  compressedBase64: string;
  boundingBoxes: BoundingBox[];
  imageWidth: number;
  imageHeight: number;
  recognizedText: string;
}
