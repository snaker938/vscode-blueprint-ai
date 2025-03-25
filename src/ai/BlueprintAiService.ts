// ai/blueprintAiService.ts

import { getSummariesFromScreenshot } from './getSummariesFromScreenshot';
import { getFinalCraftJsLayout } from './blueprintAiClient';

/**
 * Main AI entrypoint for generating a final CraftJS layout.
 *
 * 1. If a screenshot is provided, run OCR + summarizations to get uiSummary and guiSummary.
 * 2. Calls getFinalCraftJsLayout to produce final JSON string.
 */
export async function getBlueprintLayout(params: {
  userText: string;
  rawScreenshot?: Buffer;
  openAiKey: string;
}): Promise<string> {
  const { userText, rawScreenshot, openAiKey } = params;

  let uiSummary = '';
  let guiSummary = '';

  // 1) Gather UI + GUI summaries only if a screenshot is provided
  if (rawScreenshot) {
    const summaries = await getSummariesFromScreenshot({
      rawScreenshot,
      openAiKey,
    });
    uiSummary = summaries.uiSummary;
    guiSummary = summaries.guiSummary;
  }

  // 2) Ask ChatGPT (or GPT-4) to combine them (and userText) into a CraftJS layout
  const craftJsJson = await getFinalCraftJsLayout({
    userText, // same as userText: userText
    uiSummary, // possibly empty if no screenshot
    guiSummary, // possibly empty if no screenshot
    openAiKey, // pass the key along
  });

  return craftJsJson;
}
