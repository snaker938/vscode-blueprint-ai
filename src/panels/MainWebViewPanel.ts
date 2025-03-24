import * as vscode from 'vscode';
import * as fs from 'fs';
import { getBlueprintLayout } from '../ai/BlueprintAiService';

/**
 * Helper function to prompt the user to set/update the OpenAI API key.
 */
async function promptUserToSetApiKey(): Promise<void> {
  const config = vscode.workspace.getConfiguration('blueprintAI');
  const enteredKey = await vscode.window.showInputBox({
    prompt: 'Enter your OpenAI API Key',
    placeHolder: 'sk-...',
    ignoreFocusOut: true,
  });

  if (enteredKey) {
    await config.update(
      'openaiApiKey',
      enteredKey,
      vscode.ConfigurationTarget.Global
    );
    vscode.window.showInformationMessage(
      'OpenAI API key saved. You can now use Blueprint AI features.'
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
            // Convert raw array of bytes to a Node Buffer
            const arrayOfBytes: number[] = payload.arrayBuffer || [];
            const buffer = Buffer.from(arrayOfBytes);

            // The main AI call: get CraftJS layout from text + screenshot
            const layoutJson = await getBlueprintLayout({
              userText: payload.userText,
              rawScreenshot: buffer,
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
            if (errorMsg.includes('OpenAI API key not found')) {
              await this._handleTwoButtonError(
                'You have not set an API key for Blueprint AI. AI features will not work until you do so.',
                'Close',
                'Set API Key',
                promptUserToSetApiKey
              );
            } else if (errorMsg.includes('Invalid OpenAI API key')) {
              await this._handleTwoButtonError(
                'Your OpenAI API key appears to be invalid. Please set a valid key.',
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

    html = this._fixHtml(html, webview, distUri);
    return html;
  }

  private _fixHtml(
    html: string,
    webview: vscode.Webview,
    distUri: vscode.Uri
  ): string {
    const nonce = getNonce();

    // Remove any <base> element
    html = html.replace(/<base[^>]+>/, '');

    // Remove existing CSP meta tag
    html = html.replace(
      /<meta.*?http-equiv="Content-Security-Policy".*?>/gi,
      ''
    );

    // Set the Content-Security-Policy
    html = html.replace(
      /<head>/,
      `<head>
        <meta http-equiv="Content-Security-Policy" content="
        default-src 'none';
        img-src ${webview.cspSource} https: data:;
        script-src 'nonce-${nonce}' ${webview.cspSource} 'self' 'unsafe-eval' https://cdn.jsdelivr.net;
        style-src ${webview.cspSource} 'unsafe-inline' https://use.typekit.net;
        font-src ${webview.cspSource} https: data:;
        connect-src ${webview.cspSource} https: data:;
        worker-src 'self' blob:;
        ">
      `
    );

    // Inject acquireVsCodeApi at top of <body>
    html = html.replace(
      /<body[^>]*>/,
      `<body>
        <script nonce="${nonce}">
          (function() {
            window.vscode = acquireVsCodeApi();
          })();
        </script>`
    );

    // Update script tags (add nonce, fix src)
    html = html.replace(
      /<script\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, src) => {
        const scriptPathOnDisk = vscode.Uri.joinPath(distUri, src);
        const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
        return `<script nonce="${nonce}" src="${scriptUri}">`;
      }
    );

    // Add nonce to inline scripts
    html = html.replace(/<script(?![^>]*\bsrc=)[^>]*>/gi, (match) => {
      return match.replace('<script', `<script nonce="${nonce}"`);
    });

    // Update link tags
    html = html.replace(
      /<link\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, href) => {
        const stylePathOnDisk = vscode.Uri.joinPath(distUri, href);
        const styleUri = webview.asWebviewUri(stylePathOnDisk);
        return `<link ${attributes.replace(href, styleUri.toString())}>`;
      }
    );

    // Update img tags
    html = html.replace(
      /<img\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, src) => {
        const imgPathOnDisk = vscode.Uri.joinPath(distUri, src);
        const imgUri = webview.asWebviewUri(imgPathOnDisk);
        return `<img ${attributes.replace(src, imgUri.toString())}>`;
      }
    );

    // Optional: update <a> tags if needed
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
