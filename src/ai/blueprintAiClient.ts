/**
 * blueprintAiClient.ts
 *
 * Provides utility functions to call your AI endpoint (OpenAI) for:
 *   1) UI Summarization
 *   2) GUI Extraction
 *   3) Final CraftJS Layout
 *
 * Each function includes a meta prompt + the relevant text/screenshot.
 * Uses Axios for ChatGPT calls.
 */

import axios from 'axios';
import {
  UI_SUMMARY_META_PROMPT,
  GUI_SUMMARY_META_PROMPT,
  FINAL_CRAFTJS_META_PROMPT,
} from './blueprintAiPrompts';

/**
 * Simple helper to call OpenAI ChatGPT with Axios.
 * - Expects process.env.OPENAI_API_KEY to be defined.
 * - Uses the gpt-3.5-turbo (or gpt-4 if you have access).
 */
async function callChatGPT(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable.');
  }

  // Example: using GPT-3.5-Turbo
  const model = 'gpt-3.5-turbo';

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const rawText = response.data.choices?.[0]?.message?.content;
    return rawText ? rawText.trim() : '';
  } catch (error: any) {
    console.error('Error calling ChatGPT:', error?.response?.data || error);
    throw new Error(
      `OpenAI API error: ${
        error?.response?.data?.error?.message || error.message
      }`
    );
  }
}

/**
 * If needed, convert the screenshot to a truncated base64 string.
 * Helps avoid huge prompts that might exceed token limits.
 */
function maybeBase64EncodeScreenshot(screenshot?: Buffer): string | undefined {
  if (!screenshot) {
    return undefined;
  }
  const base64 = screenshot.toString('base64');

  // Truncate the base64 string if it's too large.
  // E.g. limit to 100k characters (arbitrary).
  const maxLength = 100_000;
  if (base64.length > maxLength) {
    return base64.slice(0, maxLength) + '...[TRUNCATED BASE64]';
  }

  return base64;
}

/**
 * Summarizes OCR text as a short, structured list of UI lines.
 * Uses the UI_SUMMARY_META_PROMPT plus optional screenshot data.
 */
export async function getUiSummary(params: {
  text: string;
  screenshot?: Buffer;
}): Promise<string> {
  const { text, screenshot } = params;
  const base64Screenshot = maybeBase64EncodeScreenshot(screenshot);

  // We'll treat UI_SUMMARY_META_PROMPT as the "system" role for guidance,
  // and the user content includes both the OCR text and optional base64 data.
  const systemPrompt = UI_SUMMARY_META_PROMPT;
  const userPrompt = `
Screenshot (base64, optional): 
${base64Screenshot ? base64Screenshot : '[No screenshot provided]'}

=== RAW OCR TEXT ===
${text}
`;

  return await callChatGPT(systemPrompt, userPrompt);
}

/**
 * Extracts or summarizes the GUI structure from a screenshot only.
 * Uses the GUI_SUMMARY_META_PROMPT plus the screenshot in base64 form.
 */
export async function getGuiSummary(params: {
  screenshot: Buffer;
}): Promise<string> {
  const { screenshot } = params;
  const base64Screenshot = maybeBase64EncodeScreenshot(screenshot);

  const systemPrompt = GUI_SUMMARY_META_PROMPT;
  const userPrompt = `
Screenshot (base64):
${base64Screenshot}

[No OCR text provided for GUI extraction—just the screenshot structure.]
`;

  return await callChatGPT(systemPrompt, userPrompt);
}

/**
 * Generates a single-page CraftJS layout JSON using the final meta prompt.
 * Combines user instructions + the extracted UI & GUI summaries (if any).
 * - userText: the user's own instructions
 * - uiSummary: result from getUiSummary (possibly empty)
 * - guiSummary: result from getGuiSummary (possibly empty)
 */
export async function getFinalCraftJsLayout(params: {
  userText: string;
  uiSummary: string;
  guiSummary: string;
}): Promise<string> {
  const { userText, uiSummary, guiSummary } = params;

  // We'll treat FINAL_CRAFTJS_META_PROMPT as the "system" role again.
  // Then pass in the placeholders via the user prompt.
  const systemPrompt = FINAL_CRAFTJS_META_PROMPT;

  // Insert the relevant data into the "user" content:
  const userPrompt = `
USER’S TEXTUAL INSTRUCTIONS:
"${userText}"

GUI SUMMARY (IF ANY):
${guiSummary}

OCR TEXT SUMMARY (IF ANY):
${uiSummary}
`;

  return await callChatGPT(systemPrompt, userPrompt);
}
