// BlueprintAiService.ts

import { getSummariesFromScreenshot } from './getSummariesFromScreenshot';
import { getFinalCraftJsLayout } from './blueprintAiClient';

/**
 * Main AI entrypoint for generating a final CraftJS layout.
 *
 * 1. Runs OCR + summarizations to get uiSummary and guiSummary.
 * 2. Calls getFinalCraftJsLayout to produce final JSON string.
 */
export async function getBlueprintLayout(params: {
  userText: string;
  rawScreenshot?: Buffer; // Mark optional if needed
}): Promise<string> {
  // 1) Gather UI + GUI summaries
  const { uiSummary, guiSummary } = await getSummariesFromScreenshot({
    rawScreenshot: params.rawScreenshot,
  });

  // 2) Ask ChatGPT to combine them (and userText) into a CraftJS layout
  const craftJsJson = await getFinalCraftJsLayout({
    userText: params.userText,
    uiSummary,
    guiSummary,
  });

  return craftJsJson;
}
