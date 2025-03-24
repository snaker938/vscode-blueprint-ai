// webview-ui/src/AI/Parser.ts

/**
 * Post a message to the VS Code extension asking for an AI layout.
 * Wait for the "blueprintAI.result" response, then resolve with the layout JSON.
 * If there's an error, reject the promise.
 */
export async function GetBlueprintLayoutClientSide(
  userText: string,
  rawScreenshot: number[]
): Promise<{ status: string; layout: any }> {
  // 1. Acquire reference to VS Code's API
  const vscode = acquireVsCodeApi();

  // 2. Return a promise that resolves (or rejects) when we get the extension's response
  return new Promise((resolve, reject) => {
    // Handler for messages coming back from the extension
    function handleMessage(event: MessageEvent) {
      const { command, payload } = event.data;
      if (command === 'blueprintAI.result') {
        // Stop listening once we receive the "result"
        window.removeEventListener('message', handleMessage);

        if (payload.error) {
          reject(payload.error);
        } else {
          // The extension sends back layoutJson in payload.layoutJson
          resolve({
            status: 'success',
            layout: payload.layoutJson,
          });
        }
      }
    }

    window.addEventListener('message', handleMessage);

    // 3. Send the request to the extension
    vscode.postMessage({
      command: 'blueprintAI.generateLayout',
      payload: {
        userText,
        arrayBuffer: rawScreenshot,
      },
    });
  });
}
