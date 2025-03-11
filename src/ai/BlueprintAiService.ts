// getSummariesFromScreenshot.tsx

import { runPythonOcr } from './pythonBridge';
import { getUiSummary, getGuiSummary } from './blueprintAiClient';

interface OcrResult {
  text: string;
  confidence: number;
  bbox: [number, number, number, number];
}

interface SummariesRequest {
  // The screenshot is optional.
  rawScreenshot?: Buffer;
}

interface SummariesResponse {
  uiSummary: string;
  guiSummary: string;
}

/**
 * Main exported function for producing summaries from a screenshot.
 *
 * - If a screenshot is provided:
 *    1. Runs OCR to extract text.
 *    2. Calls UI extraction with both the recognized text and the screenshot.
 *    3. Calls GUI extraction with the screenshot only.
 *
 * - If no screenshot is provided:
 *    1. UI extraction is still performed using the (possibly empty) recognized text.
 *    2. GUI extraction is skipped.
 */
export async function getSummariesFromScreenshot(
  request: SummariesRequest
): Promise<SummariesResponse> {
  const { rawScreenshot } = request;

  try {
    let recognizedText = '';

    // If a screenshot is provided, perform OCR.
    if (rawScreenshot) {
      const ocrResults: OcrResult[] = await runPythonOcr(rawScreenshot);
      recognizedText = ocrResults
        .map((item) => item.text)
        .filter(Boolean)
        .join('\n');
    }

    // UI extraction needs both text and the screenshot (if available).
    const uiSummary = await getUiSummary({
      text: recognizedText,
      screenshot: rawScreenshot,
    });

    // GUI extraction requires a screenshot only. Skip if not available.
    let guiSummary = '';
    if (rawScreenshot) {
      guiSummary = await getGuiSummary({ screenshot: rawScreenshot });
    }

    return { uiSummary, guiSummary };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('BlueprintAiService error:', errorMsg);

    return {
      uiSummary: `Error producing UI summary: ${errorMsg}`,
      guiSummary: `Error producing GUI summary: ${errorMsg}`,
    };
  }
}
