// ai/getSummariesFromScreenshot.ts

import { getUiSummary, getGuiSummary } from './blueprintAiClient';

/**
 * Runs OCR + summarization on the screenshot, returning:
 *   - uiSummary
 *   - guiSummary
 *
 * Replace the OCR logic with your actual code if needed.
 */
export async function getSummariesFromScreenshot(params: {
  rawScreenshot?: Buffer;
  openAiKey: string;
}): Promise<{ uiSummary: string; guiSummary: string }> {
  const { rawScreenshot, openAiKey } = params;
  let uiSummary = '';
  let guiSummary = '';

  // EXAMPLE: do your OCR here. We'll just pretend:
  let recognizedText = '';
  if (rawScreenshot) {
    // ... call your OCR library or something ...
    recognizedText = 'Detected text from screenshot here.';
  } else {
    recognizedText = '[No screenshot provided]';
  }

  // 1) UI summary (requires recognized text + optional screenshot)
  uiSummary = await getUiSummary({
    text: recognizedText,
    screenshot: rawScreenshot,
    openAiKey,
  });

  // 2) GUI summary (only if we have a screenshot)
  if (rawScreenshot) {
    guiSummary = await getGuiSummary({
      screenshot: rawScreenshot,
      openAiKey,
    });
  }

  return { uiSummary, guiSummary };
}
