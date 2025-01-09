/**
 * BlueprintAiService.ts
 *
 * Main AI entry point for your extension:
 *  - Accepts user text + raw screenshot
 *  - Performs OCR to extract text
 *  - Builds a system prompt with "INSERT BASE PROMPT" placeholder
 *  - Logs prompt to the console (no actual AI request yet)
 *  - Returns a dummy CraftJS-style JSON layout as a string
 */

import { runPythonOcr } from './pythonBridge'; // Adjust this import to match where you placed your OCR bridge
// Or wherever you have your "runPythonOcr" or "pythonOcrBridge" function

/**
 * Data shape for requests to getBlueprintLayout
 */
interface BlueprintAIRequest {
  userText: string;
  rawScreenshot: Buffer;
}

/**
 * The main exported function that your MainWebViewPanel calls.
 */
export async function getBlueprintLayout(
  request: BlueprintAIRequest
): Promise<string> {
  const { userText, rawScreenshot } = request;

  try {
    // 1. Perform Python-based OCR on the screenshot
    //    runPythonOcr is a function that spawns your "ocr_service.py" script
    //    and returns an array of { text, confidence, bbox } objects
    const ocrResults = await runPythonOcr(rawScreenshot);

    // 2. Combine all recognized text into a single string
    //    (If you prefer a more advanced approach, preserve bounding boxes, etc.)
    const recognizedText = ocrResults
      .map((item) => item.text)
      .filter(Boolean)
      .join('\n');

    // 3. Build the system prompt
    const systemPrompt = `
INSERT BASE PROMPT

User's textual prompt:
"${userText}"

OCR recognized text:
"${recognizedText}"
`;

    // 4. Log the final system prompt to the console
    console.log('\n===== FINAL SYSTEM PROMPT =====\n');
    console.log(systemPrompt.trim());
    console.log('\n================================\n');

    // 5. For now, we return a dummy single-page layout.
    //    Later, you'll replace this with your AI-based layout generation.
    const dummyLayout = {
      layout: {
        type: 'Container',
        props: { style: { padding: 20 } },
        children: [
          {
            type: 'Heading',
            props: { text: 'DUMMY CraftJS Layout (from BlueprintAiService)' },
            children: [],
          },
        ],
      },
    };

    // Return the dummy layout as a string
    return JSON.stringify(dummyLayout, null, 2);
  } catch (err: unknown) {
    // Error handling
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('BlueprintAiService error:', errorMsg);

    // Return (or re-throw) a minimal fallback layout so the UI doesn't break
    const fallbackLayout = {
      layout: {
        type: 'Container',
        props: { style: { padding: 20, backgroundColor: '#fcc' } },
        children: [
          {
            type: 'Heading',
            props: {
              text: `Error in BlueprintAiService: ${errorMsg}`,
            },
            children: [],
          },
        ],
      },
    };
    return JSON.stringify(fallbackLayout, null, 2);
  }
}
