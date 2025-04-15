// panels/MainWebViewPanel.ts

import * as vscode from 'vscode';
import * as fs from 'fs';
import { getBlueprintLayout } from '../ai/BlueprintAiService';
import { getOpenAiApiKey, setOpenAiApiKey } from '../utils/extensionContext';

/**
 * Helper function to prompt the user to set or update the OpenAI API key in memory.
 */
async function promptUserToSetApiKey(): Promise<void> {
  const enteredKey = await vscode.window.showInputBox({
    prompt: 'Enter your OpenAI API Key',
    placeHolder: 'sk-...',
    ignoreFocusOut: true,
  });

  if (enteredKey) {
    // Store the key in memory only
    setOpenAiApiKey(enteredKey);
    vscode.window.showInformationMessage(
      'OpenAI API key set in memory. It will be cleared when VS Code is closed.'
    );
  } else {
    vscode.window.showWarningMessage(
      'No API key entered. Blueprint AI features will not work until you set one.'
    );
  }
}

export class MainWebViewPanel {
  public static currentPanel: MainWebViewPanel | undefined;
  public static readonly viewType = 'blueprintAI';

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (MainWebViewPanel.currentPanel) {
      MainWebViewPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      MainWebViewPanel.viewType,
      'Blueprint AI',
      column || vscode.ViewColumn.One,
      getWebviewOptions(extensionUri)
    );

    MainWebViewPanel.currentPanel = new MainWebViewPanel(panel, extensionUri);
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    MainWebViewPanel.currentPanel = new MainWebViewPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible) {
          this._update();
        }
      },
      null,
      this._disposables
    );

    /**
     * Listen for messages from the webview.
     * This file acts purely as a middleman:
     *  - We take userText + raw screenshot bytes
     *  - Pass them to getBlueprintLayout (in BlueprintAiService)
     *  - Return the AI result or an error to the webview
     */
    this._panel.webview.onDidReceiveMessage(async (message) => {
      const { command, payload } = message;

      switch (command) {
        case 'blueprintAI.generateLayout':
          try {
            // Check if we have an API key in memory
            let openAiKey = getOpenAiApiKey();
            if (!openAiKey) {
              // Prompt user to set the key
              await this._handleTwoButtonError(
                'You have not set an API key for Blueprint AI. AI features will not work until you do so.',
                'Close',
                'Set API Key',
                promptUserToSetApiKey
              );

              // After prompting, check again
              openAiKey = getOpenAiApiKey();
              if (!openAiKey) {
                // If still no key, stop here
                throw new Error('OpenAI API key not found. Cannot continue.');
              }
            }

            // Convert raw array of bytes to a Node Buffer
            const arrayOfBytes: number[] = payload.arrayBuffer || [];
            const buffer = Buffer.from(arrayOfBytes);

            // The main AI call: get CraftJS layout from text + screenshot
            const layoutJson = await getBlueprintLayout({
              userText: payload.userText,
              rawScreenshot: buffer,
              openAiKey, // Pass the in-memory key to the AI call
            });

            // Return the final layout JSON to the webview
            this._panel.webview.postMessage({
              command: 'blueprintAI.result',
              payload: { layoutJson },
            });
          } catch (error: any) {
            console.error('Error in blueprintAI.generateLayout:', error);

            const errorMsg = error.message || String(error);

            // Handle missing/invalid key or general error
            if (
              errorMsg.includes('not set') ||
              errorMsg.includes('not found')
            ) {
              await this._handleTwoButtonError(
                'OpenAI API key is missing or invalid. Please set a valid key.',
                'Close',
                'Set API Key',
                promptUserToSetApiKey
              );
            } else {
              vscode.window.showErrorMessage(errorMsg);
            }

            // Notify webview of the error so it can stop the spinner
            this._panel.webview.postMessage({
              command: 'blueprintAI.result',
              payload: { error: errorMsg },
            });
          }
          break;

        case 'alert':
          // Display an alert from the webview
          vscode.window.showErrorMessage(payload?.text || 'Unknown error');
          break;
      }
    });

    // Additional message handling if needed
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        // No extra commands at this time
      },
      null,
      this._disposables
    );
  }

  /**
   * Cleanup
   */
  public dispose() {
    MainWebViewPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  /**
   * Called when panel is shown or becomes visible
   */
  private _update() {
    const webview = this._panel.webview;
    this._panel.title = 'Blueprint AI';
    this._updateWebviewContent(webview);
  }

  private async _updateWebviewContent(webview: vscode.Webview) {
    const html = await this._getHtmlForWebview(webview);
    this._panel.webview.html = html;
  }

  private async _getHtmlForWebview(webview: vscode.Webview) {
    const distUri = vscode.Uri.joinPath(
      this._extensionUri,
      'webview-ui',
      'dist'
    );
    const indexPath = vscode.Uri.joinPath(distUri, 'index.html');
    let html = await fs.promises.readFile(indexPath.fsPath, 'utf8');

    // The rest is your existing _fixHtml
    html = this._fixHtml(html, webview, distUri);
    return html;
  }

  private _fixHtml(
    html: string,
    webview: vscode.Webview,
    distUri: vscode.Uri
  ): string {
    const nonce = getNonce();

    // 1. Remove any <base> elements or existing CSP meta tags
    html = html.replace(/<base[^>]*>/gi, '');
    html = html.replace(
      /<meta.*?http-equiv="Content-Security-Policy".*?>/gi,
      ''
    );

    // 2. Insert our own CSP
    html = html.replace(
      /<head>/,
      `<head>
        <meta http-equiv="Content-Security-Policy" content="
          default-src 'none';
          img-src ${webview.cspSource} vscode-webview: https: data:;
          script-src
            'nonce-${nonce}'
            ${webview.cspSource}
            'unsafe-eval'
            https://cdn.jsdelivr.net
            https://www.youtube.com
            https://*.youtube.com
            https://www.youtube-nocookie.com;
          style-src
            'self'
            'unsafe-inline'
            ${webview.cspSource}
            https://*.vscode-cdn.net
            https://cdn.jsdelivr.net;
          font-src
            ${webview.cspSource}
            https:
            data:;
          connect-src
            ${webview.cspSource}
            https:
            data:
            https://*.youtube.com
            https://*.googlevideo.com
            https://www.youtube-nocookie.com
            https://cdn.jsdelivr.net;
          frame-src
            https://www.youtube.com
            https://*.youtube.com
            https://*.googlevideo.com
            https://www.youtube-nocookie.com;
          worker-src 'self' blob:;
          media-src https://*.youtube.com https://*.googlevideo.com;
        ">
      `
    );

    // 3. Inject window.vscode at top of <body>
    html = html.replace(
      /<body[^>]*>/,
      `<body>
        <script nonce="${nonce}">
          (function() {
            window.vscode = acquireVsCodeApi();
          })();
        </script>`
    );

    // 4. Rewrite <script> tags
    html = html.replace(
      /<script\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, src) => {
        const scriptPathOnDisk = vscode.Uri.joinPath(distUri, src);
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        return `<script nonce="${nonce}" src="${scriptUri}">`;
      }
    );
    // Add nonce to inline <script>
    html = html.replace(/<script(?![^>]*\bsrc=)[^>]*>/gi, (match) => {
      return match.replace('<script', `<script nonce="${nonce}"`);
    });

    // 5. Rewrite <link> tags (CSS)
    html = html.replace(
      /<link\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, href) => {
        const stylePathOnDisk = vscode.Uri.joinPath(distUri, href);
        const styleUri = webview.asWebviewUri(stylePathOnDisk);
        return `<link ${attributes.replace(href, styleUri.toString())}>`;
      }
    );

    // 6. Rewrite <img> tags
    html = html.replace(
      /<img\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, src) => {
        const imgPathOnDisk = vscode.Uri.joinPath(distUri, src);
        const imgUri = webview.asWebviewUri(imgPathOnDisk);
        return `<img ${attributes.replace(src, imgUri.toString())}>`;
      }
    );

    // update <a> tags
    html = html.replace(
      /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, href) => {
        if (href.startsWith('/')) {
          const linkPathOnDisk = vscode.Uri.joinPath(distUri, href);
          const linkUri = webview.asWebviewUri(linkPathOnDisk);
          return `<a ${attributes.replace(href, linkUri.toString())}>`;
        }
        return match;
      }
    );

    return html;
  }

  /**
   * Two-button error popup for missing or invalid API keys.
   */
  private async _handleTwoButtonError(
    errorMessage: string,
    buttonLabelLeft: string,
    buttonLabelRight: string,
    rightButtonCallback: () => Promise<void>
  ): Promise<void> {
    const choice = await vscode.window.showErrorMessage(
      errorMessage,
      buttonLabelLeft,
      buttonLabelRight
    );

    if (choice === buttonLabelRight) {
      await rightButtonCallback();
    }
    // If user picks left or dismisses, do nothing
  }
}

/**
 * Returns the webview options for local resource loading
 */
function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist'),
    ],
  };
}

/**
 * Generates a random nonce for CSP
 */
function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
