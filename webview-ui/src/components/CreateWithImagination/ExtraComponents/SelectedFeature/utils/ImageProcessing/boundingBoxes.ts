import { BoundingBox } from './types';

export function buildLineBoundingBoxes(data: any) {
  const lines = data.lines || [];
  let maxX = 0;
  let maxY = 0;

  const boundingBoxes: BoundingBox[] = [];
  const lineTexts: string[] = [];

  for (const line of lines) {
    const x0 = line.bbox.x0;
    const y0 = line.bbox.y0;
    const x1 = line.bbox.x1;
    const y1 = line.bbox.y1;

    if (x1 > maxX) maxX = x1;
    if (y1 > maxY) maxY = y1;

    boundingBoxes.push({
      text: line.text.trim(),
      confidence: line.confidence,
      bbox: [x0, y0, x1, y1],
    });
    lineTexts.push(line.text.trim());
  }

  // Combine all line text
  const recognizedFullText = lineTexts.join('\n');

  return { boundingBoxes, maxX, maxY, recognizedFullText };
}

/**
 * Summarize bounding boxes if we exceed a threshold.
 */
export function summarizeBoundingBoxes(
  bboxes: BoundingBox[],
  maxCount: number
): BoundingBox[] {
  // Sort by confidence descending
  const sorted = [...bboxes].sort((a, b) => b.confidence - a.confidence);

  // Keep top (maxCount - 1)
  const top = sorted.slice(0, maxCount - 1);

  // Combine the rest into a single bounding box with merged text
  const rest = sorted.slice(maxCount - 1);
  if (rest.length > 0) {
    const combinedText = rest.map((r) => r.text).join(' ');
    const avgConfidence =
      rest.reduce((acc, r) => acc + r.confidence, 0) / rest.length;

    const minX = Math.min(...rest.map((r) => r.bbox[0]));
    const minY = Math.min(...rest.map((r) => r.bbox[1]));
    const maxX = Math.max(...rest.map((r) => r.bbox[2]));
    const maxY = Math.max(...rest.map((r) => r.bbox[3]));

    top.push({
      text: `[SUMMARY of ${rest.length} lines]: ${combinedText}`,
      confidence: avgConfidence,
      bbox: [minX, minY, maxX, maxY],
    });
  }
  return top;
}
