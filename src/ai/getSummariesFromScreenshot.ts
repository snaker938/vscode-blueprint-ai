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
  // The OpenAI key is required to call the AI client.
  openAiKey: string;
}

interface SummariesResponse {
  uiSummary: string;
  guiSummary: string;
}

/**
 * Main exported function for producing summaries from a screenshot.
 *
 * If a screenshot is provided:
 *    1. Runs OCR to extract text.
 *    2. Calls UI extraction with both the recognized text and the screenshot.
 *    3. Calls GUI extraction with the screenshot only.
 * If no screenshot is provided, returns empty summaries.
 */
export async function getSummariesFromScreenshot(
  request: SummariesRequest
): Promise<SummariesResponse> {
  const { rawScreenshot, openAiKey } = request;

  // If no screenshot is provided, skip extraction and return empty summaries
  if (!rawScreenshot) {
    return {
      uiSummary: '',
      guiSummary: '',
    };
  }

  try {
    // 1) Perform OCR on the screenshot
    const ocrResults: OcrResult[] = await runPythonOcr(rawScreenshot);
    const recognizedText = ocrResults
      .map((item) => item.text)
      .filter(Boolean)
      .join('\n');

    // 2) UI extraction needs recognized text and the screenshot.
    const uiSummary = await getUiSummary({
      text: recognizedText,
      screenshot: rawScreenshot,
      openAiKey,
    });

    // 3) GUI extraction requires the screenshot only.
    const guiSummary = await getGuiSummary({
      screenshot: rawScreenshot,
      openAiKey,
    });

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
