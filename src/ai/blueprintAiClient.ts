// blueprintAiClient.tsx
import OpenAI from 'openai';
import {
  UI_SUMMARY_META_PROMPT,
  GUI_SUMMARY_META_PROMPT,
  FINAL_CRAFTJS_META_PROMPT,
} from './blueprintAiPrompts';
import { ACTUAL_FINAL_CRAFTJS_META_PROMPT } from '../testingComponents';

/** Truncates a base64 string if it's too large. */
function maybeTruncateBase64(base64?: string): string | undefined {
  if (!base64) {
    return undefined;
  }
  const maxLength = 25_000; // ~25k characters
  if (base64.length > maxLength) {
    return base64.slice(0, maxLength) + '...[TRUNCATED BASE64]';
  }
  return base64;
}

/** Converts a screenshot Buffer to a data URL (truncated) for the prompt. */
function screenshotToDataUrl(screenshot?: Buffer): string | undefined {
  if (!screenshot) {
    return undefined;
  }
  const truncatedBase64 = maybeTruncateBase64(screenshot.toString('base64'));
  return truncatedBase64
    ? `data:image/png;base64,${truncatedBase64}`
    : undefined;
}

/**
 * Low-level function to call OpenAI chat completions.
 * Uses different models depending on whether we have a screenshot or not.
 */
async function callOpenAiChat(params: {
  systemPrompt: string;
  userContent: string;
  openAiKey: string;
  hasScreenshot: boolean;
}): Promise<string> {
  const { systemPrompt, userContent, openAiKey, hasScreenshot } = params;

  // Instantiate the OpenAI client
  const openai = new OpenAI({ apiKey: openAiKey });

  // Model selection
  // "gpt-4o" if we have a screenshot, otherwise "o3-mini-2025-01-31"
  const model = hasScreenshot ? 'gpt-4o' : 'o3-mini-2025-01-31';

  // Build the messages (must be ChatCompletionMessageParam)
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: systemPrompt,
    },
    {
      role: 'user',
      content: userContent,
    },
  ];

  // Make the request
  const response = await openai.chat.completions.create({
    model,
    messages,
    // "store" is not officially documented in the new library; remove or keep if needed
    // store: !hasScreenshot,
  });

  // Return the text of the first choice
  return response.choices?.[0]?.message?.content?.trim() ?? '';
}

/**
 * Summarizes OCR text as a short, structured list of UI lines.
 * If a screenshot is provided, we use the "gpt-4o" model.
 */
export async function getUiSummary(params: {
  text: string;
  screenshot?: Buffer;
  openAiKey: string;
}): Promise<string> {
  const { text, screenshot, openAiKey } = params;

  const dataUrl = screenshotToDataUrl(screenshot);
  const hasScreenshot = Boolean(dataUrl);

  // Build a single string for the user's content
  let userContent = `Below is the recognized text:\n\n${text}\n`;

  if (hasScreenshot) {
    userContent += `\n[Image data (base64)]:\n${dataUrl}\n`;
  }

  return callOpenAiChat({
    systemPrompt: UI_SUMMARY_META_PROMPT,
    userContent,
    openAiKey,
    hasScreenshot,
  });
}

/**
 * Extracts or summarizes the GUI structure from a screenshot.
 * If no screenshot is provided, it returns a minimal text response.
 */
export async function getGuiSummary(params: {
  screenshot?: Buffer;
  openAiKey: string;
}): Promise<string> {
  const { screenshot, openAiKey } = params;

  const dataUrl = screenshotToDataUrl(screenshot);
  const hasScreenshot = Boolean(dataUrl);

  let userContent: string;

  if (hasScreenshot) {
    userContent = `Please analyze the GUI in this screenshot:\n${dataUrl}`;
  } else {
    userContent = 'No screenshot provided for GUI analysis.';
  }

  return callOpenAiChat({
    systemPrompt: GUI_SUMMARY_META_PROMPT,
    userContent,
    openAiKey,
    hasScreenshot,
  });
}

/**
 * Generates a single-page CraftJS layout JSON using the final meta prompt.
 * Typically no screenshot is passed here => uses the "o3-mini-2025-01-31" model.
 */
export async function getFinalCraftJsLayout(params: {
  userText: string;
  uiSummary: string;
  guiSummary: string;
  openAiKey: string;
}) {
  const { userText, uiSummary, guiSummary, openAiKey } = params;

  // Combine the user instructions with any UI/GUI summaries
  const userContent = `
  USER INSTRUCTIONS:
  ${userText}

  GUI SUMMARY (IF ANY):
  ${guiSummary}

  UI / OCR TEXT SUMMARY (IF ANY):
  ${uiSummary}
  `;

  // No screenshot => text-only model
  return callOpenAiChat({
    systemPrompt: ACTUAL_FINAL_CRAFTJS_META_PROMPT,
    userContent,
    openAiKey,
    hasScreenshot: false,
  });
}
