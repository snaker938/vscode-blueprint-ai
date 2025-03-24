// ai/blueprintAiService.ts

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
  openAiKey: string; // <-- your in-memory key here
}): Promise<string> {
  const { userText, rawScreenshot, openAiKey } = params;

  // 1) Gather UI + GUI summaries
  const { uiSummary, guiSummary } = await getSummariesFromScreenshot({
    rawScreenshot,
    openAiKey,
  });

  // 2) Ask ChatGPT (or GPT-4) to combine them (and userText) into a CraftJS layout
  const craftJsJson = await getFinalCraftJsLayout({
    userText, // same as userText: userText
    uiSummary, // same as uiSummary: uiSummary
    guiSummary, // same as guiSummary: guiSummary
    openAiKey, // pass the key along
  });

  return craftJsJson;
}
