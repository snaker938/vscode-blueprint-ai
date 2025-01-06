import axios from 'axios';
import * as vscode from 'vscode';

/**
 * The request shape for Blueprint AI's layout generation, possibly including:
 *  - userText: the user’s textual instructions
 *  - base64Image: the compressed screenshot as base64
 *  - recognizedText: textual content extracted via OCR
 *  - boundingBoxes: array of line-level bounding boxes with coordinates & confidence
 *  - imageDimensions: approximate width & height of the screenshot
 */
interface BlueprintAIRequest {
  userText: string;
  base64Image?: string;
  recognizedText?: string;
  boundingBoxes?: any[];
  imageDimensions?: {
    width: number;
    height: number;
  };
}

/**
 * Calls OpenAI to generate a SINGLE-PAGE layout in JSON format,
 * referencing your exact CraftJS components by name.
 */
export async function getBlueprintLayout(
  request: BlueprintAIRequest
): Promise<string> {
  const {
    userText,
    base64Image,
    recognizedText,
    boundingBoxes,
    imageDimensions,
  } = request;

  // 1. Retrieve API key from user settings or environment
  const configuration = vscode.workspace.getConfiguration('blueprintAI');
  const openaiApiKey =
    configuration.get<string>('openaiApiKey') || process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error(
      'OpenAI API key not found. Please set blueprintAI.openaiApiKey in your VSCode settings or use an environment variable.'
    );
  }

  /**
   * We combine EVERYTHING into a single system prompt so ChatGPT/GPT-4
   * has full context: user instructions, bounding boxes, recognized text,
   * single-page constraints, and the strict CraftJS JSON format.
   */
  let systemPrompt = `
YOU ARE "BLUEPRINT AI," A HIGHLY ADVANCED SYSTEM FOR CRAFTJS LAYOUT GENERATION.

OBJECTIVE:
Produce a SINGLE-PAGE layout for CraftJS as strictly valid JSON. The JSON **must** use only the following CraftJS components (exact names):

  Button,
  Container,
  Textbox,
  Heading,
  IconComponent,
  LinkComponent,
  ButtonGroup,
  InputBox,
  Dropdown,
  Checkbox,
  RadioButtons,
  Slider,
  StarRating,
  SearchBox,
  BarChart,
  PieChart,
  LineChart

STRUCTURE:
{
  "layout": {
    "type": "<CraftJSComponentName>",
    "props": {
      // e.g. style, text, color, data, etc.
    },
    "children": [
      // zero or more child objects, each with the same structure
    ]
  }
}

CRITICAL REQUIREMENTS:
1) **Strictly Valid JSON** — No extra commentary, no code fences, no additional keys.
2) **Single Static Page** — No multi-page references, no external site navigation.
3) **Text / Data** — No placeholders. If bounding boxes or recognized text indicate partial content, guess or invent suitable completions in English (e.g., “Summer Sale 2024,” “Inbox,” “Drafts,” “Sent Mail,” etc.). Similarly, for charts, **invent** realistic numbers, axis labels, or headers if not fully specified. 
4) **Color & Style** — Must reflect the color scheme or general design references gleaned from the user’s prompt or the uploaded image. If no explicit color is given, derive it logically from recognized text or bounding boxes; do not default to placeholders.
5) **User Prompt is Highest Priority** — If user instructions conflict with bounding boxes or recognized text, follow the user instructions.
6) **Bounding Boxes** (x0,y0,x1,y1) — If provided, treat them as possible columns/sidebars/top bars. For instance, if many lines cluster at x < 200, interpret that as a left nav. If bounding boxes appear near the top, that might be a header. 
7) **Recognized Text** (Multi-Language) — Translate everything into English if needed. If the recognized text is partial or truncated, guess the missing parts to maintain coherence.
8) **Images or Icons** — If bounding boxes mention them but the user excludes them, do **not** add them. Otherwise, you may create (invent) an icon name or a generic image reference if relevant.
9) **No Extra Output** — Absolutely no commentary, disclaimers, or code fences. Only valid JSON with a single top-level "layout" key.

IF NO USER TEXT IS PROVIDED:
- You can still produce a suitable single-page layout by deducing structure from bounding boxes, recognized text, and color/design references from the screenshot.

----------------------------------------------------------------
USER’S TEXTUAL INSTRUCTIONS:
"${userText}"
----------------------------------------------------------------
BOUNDED LINES (IF ANY):
If boundingBoxes + imageDimensions are provided, interpret them for layout columns or sidebars.

RECOGNIZED TEXT (IF ANY):
Translate or guess missing parts if incomplete, then incorporate into the layout.

SCREENSHOT (IF ANY):
Derive color theme or design references from it; do **not** produce placeholders.

REMEMBER:
- The final JSON is your entire output. Nothing else.
- No placeholders or Lorem ipsum. Invent data realistically if unspecified.
- Everything must be in English in the final layout.
`;

  if (recognizedText && recognizedText.trim().length > 0) {
    systemPrompt += `
RECOGNIZED TEXT (FROM OCR, MAY BE MULTI-LANGUAGE):
"${recognizedText}"

This text might indicate headings, paragraphs, or UI labels. Translate to English if needed,
and place it logically in the final layout.
`;
  }

  if (boundingBoxes && boundingBoxes.length > 0 && imageDimensions) {
    systemPrompt += `
DETECTED LINE-LEVEL BOUNDING BOXES (COULD INDICATE UI REGIONS):
Image approx width: ${imageDimensions.width}, height: ${imageDimensions.height}
Boxes: [x0,y0,x1,y1], text, confidence
${JSON.stringify(boundingBoxes, null, 2)}

Use these to infer columns, sidebars, or top/bottom bars if patterns emerge.
`;
  }

  if (base64Image) {
    systemPrompt += `
A BASE64 SCREENSHOT IS PROVIDED. 
Assume it might match the bounding boxes and recognized text.
Replicate any major color themes or structural elements implied by this screenshot.
`;
  }

  try {
    const endpointUrl = 'https://api.openai.com/v1/chat/completions';
    const requestBody = {
      model: 'gpt-4', // or 'gpt-3.5-turbo'
      temperature: 0.7,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: '', // We combine everything in 'system' to unify instructions
        },
      ],
    };

    const response = await axios.post(endpointUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
    });

    if (response.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }

    const aiText = response.data.choices?.[0]?.message?.content || '';
    return aiText.trim();
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }
    console.error('Blueprint AI error:', error?.message || error);
    throw error;
  }
}
