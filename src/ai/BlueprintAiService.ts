/**
 * blueprintAiService.ts
 *
 * The main entry point: getBlueprintLayout() used by your extension.
 * Calls the 3 functions from blueprintAiProcessing, merges data,
 * redacts personal data, logs a final "PUT YOUR PROMPT HERE" prompt,
 * returns a dummy single-page layout JSON.
 */

import { BlueprintAIRequest, BBox, RegionBox } from './blueprintAiTypes';

import {
  performSharpPreprocessing,
  performMorphRegionDetection,
  performOcr,
} from './blueprintAiProcessing';

export async function getBlueprintLayout(
  request: BlueprintAIRequest
): Promise<string> {
  const { userText, rawScreenshot } = request;

  try {
    // 1) Sharp for preprocessing
    const preprocessedBuffer = await performSharpPreprocessing(rawScreenshot);

    // 2) image-js for morphological region detection
    const { cleanedBuffer, regionData } = await performMorphRegionDetection(
      preprocessedBuffer
    );

    // 3) Tesseract.js for OCR
    const { recognizedText, wordBoxes } = await performOcr(cleanedBuffer);

    // Merge all data
    const mergedData = _mergeData(
      userText,
      recognizedText,
      regionData,
      wordBoxes
    );
    const sanitizedData = _redactSensitiveData(mergedData);

    // Build final system prompt
    const systemPrompt = _buildSystemPrompt(sanitizedData);
    console.log('\n===== FINAL SYSTEM PROMPT =====\n');
    console.log(systemPrompt);
    console.log('\n================================\n');

    // Return dummy single-page CraftJS layout
    const dummyLayout = {
      layout: {
        type: 'Container',
        props: { style: { padding: 20 } },
        children: [
          {
            type: 'Heading',
            props: {
              text: 'DUMMY CraftJS Layout (from advanced pipeline)',
            },
            children: [],
          },
        ],
      },
    };

    return JSON.stringify(dummyLayout, null, 2);
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    throw new Error(errorMsg);
  }
}

/** Combine user prompt, region data, OCR. */
function _mergeData(
  userText: string,
  recognizedText: string,
  regionData: RegionBox[],
  wordBoxes: BBox[]
): any {
  return {
    userPrompt: userText,
    recognizedText,
    regions: regionData,
    wordBoxes,
  };
}

/** Simple personal data redaction from recognized text + words. */
function _redactSensitiveData(data: any): any {
  const sanitized = { ...data };

  if (typeof sanitized.recognizedText === 'string') {
    sanitized.recognizedText = sanitized.recognizedText
      .replace(
        /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
        '[REDACTED_EMAIL]'
      )
      .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[REDACTED_PHONE]');
  }

  if (Array.isArray(sanitized.wordBoxes)) {
    sanitized.wordBoxes = sanitized.wordBoxes.map((b: BBox) => {
      const updated = { ...b };
      updated.text = updated.text
        .replace(
          /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
          '[REDACTED_EMAIL]'
        )
        .replace(/\b\d{3}-\d{3}-\d{4}\b/g, '[REDACTED_PHONE]');
      return updated;
    });
  }

  return sanitized;
}

/** Build final system prompt "PUT YOUR PROMPT HERE" etc. */
function _buildSystemPrompt(data: any): string {
  const basePrompt = 'PUT YOUR PROMPT HERE';
  return `
${basePrompt}

User's textual prompt:
"${data.userPrompt}"

Recognized text (some may be redacted):
"${data.recognizedText}"

Regions:
${JSON.stringify(data.regions, null, 2)}

Word bounding boxes:
${JSON.stringify(data.wordBoxes, null, 2)}

Disclaimer:
We tried removing personal data (emails, phones). If any remains, please ignore or anonymize.
`.trim();
}
