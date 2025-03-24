import axios from 'axios';
import {
  UI_SUMMARY_META_PROMPT,
  GUI_SUMMARY_META_PROMPT,
  FINAL_CRAFTJS_META_PROMPT,
} from './blueprintAiPrompts';

/**
 * Core helper to call OpenAI ChatGPT with Axios.
 * Expects an `openAiKey` param rather than relying on environment variables.
 * The optional parameter `useImageModel` determines which model and settings to use.
 */
async function callChatGPT(
  systemPrompt: string,
  userPrompt: string,
  openAiKey: string,
  useImageModel: boolean = false
): Promise<string> {
  if (!openAiKey) {
    throw new Error('OpenAI API key not provided.');
  }

  // Choose model based on whether an image is included:
  const model = useImageModel ? 'gpt-4o-2024-08-06' : 'o3-mini-2025-01-31';

  // Build the request body. Only include temperature for image-based requests.
  const requestBody: any = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  };

  if (useImageModel) {
    requestBody.temperature = 0.7;
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openAiKey}`,
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
 * Converts the screenshot to a truncated base64 string (if provided)
 * to avoid huge prompts that might exceed token limits.
 */
function maybeBase64EncodeScreenshot(screenshot?: Buffer): string | undefined {
  if (!screenshot) {
    return undefined;
  }
  const base64 = screenshot.toString('base64');

  // Example: limit to 100k characters (arbitrary).
  const maxLength = 100_000;
  if (base64.length > maxLength) {
    return base64.slice(0, maxLength) + '...[TRUNCATED BASE64]';
  }

  return base64;
}

/**
 * Summarizes OCR text as a short, structured list of UI lines.
 * Uses the UI_SUMMARY_META_PROMPT plus optional screenshot data.
 * If a screenshot is provided, the image model is used.
 */
export async function getUiSummary(params: {
  text: string;
  screenshot?: Buffer;
  openAiKey: string;
}): Promise<string> {
  const { text, screenshot, openAiKey } = params;
  const base64Screenshot = maybeBase64EncodeScreenshot(screenshot);

  const systemPrompt = UI_SUMMARY_META_PROMPT;
  const userPrompt = `
Screenshot (base64, optional): 
${base64Screenshot ? base64Screenshot : '[No screenshot provided]'}

=== RAW OCR TEXT ===
${text}
`;

  // If a screenshot is provided, use the image model (GPT‑4o); otherwise, the text-only model.
  const useImageModel = Boolean(screenshot);
  return await callChatGPT(systemPrompt, userPrompt, openAiKey, useImageModel);
}

/**
 * Extracts or summarizes the GUI structure from a screenshot only.
 * Uses the GUI_SUMMARY_META_PROMPT plus the screenshot in base64 form.
 */
export async function getGuiSummary(params: {
  screenshot: Buffer;
  openAiKey: string;
}): Promise<string> {
  const { screenshot, openAiKey } = params;
  const base64Screenshot = maybeBase64EncodeScreenshot(screenshot);

  const systemPrompt = GUI_SUMMARY_META_PROMPT;
  const userPrompt = `
Screenshot (base64):
${base64Screenshot}

[No OCR text provided for GUI extraction—just the screenshot structure.]
`;

  // This function always includes a screenshot; use the GPT‑4o model.
  return await callChatGPT(systemPrompt, userPrompt, openAiKey, true);
}

/**
 * Generates a single-page CraftJS layout JSON using the final meta prompt.
 * Combines user instructions with the extracted UI & GUI summaries (if any).
 *
 *  - userText: the user's own instructions
 *  - uiSummary: result from getUiSummary (possibly empty)
 *  - guiSummary: result from getGuiSummary (possibly empty)
 */
export async function getFinalCraftJsLayout(params: {
  userText: string;
  uiSummary: string;
  guiSummary: string;
  openAiKey: string;
}): Promise<string> {
  const { userText, uiSummary, guiSummary, openAiKey } = params;

  const systemPrompt = FINAL_CRAFTJS_META_PROMPT;
  const userPrompt = `
USER’S TEXTUAL INSTRUCTIONS:
"${userText}"

GUI SUMMARY (IF ANY):
${guiSummary}

OCR TEXT SUMMARY (IF ANY):
${uiSummary}
`;

  // No screenshot here, so use the text-only model.
  return await callChatGPT(systemPrompt, userPrompt, openAiKey, false);
}
