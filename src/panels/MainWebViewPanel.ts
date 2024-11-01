import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class MainWebviewPanel {
  public static currentPanel: MainWebviewPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static render(
    extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    if (MainWebviewPanel.currentPanel) {
      MainWebviewPanel.currentPanel._panel.reveal(vscode.ViewColumn.One);
    } else {
      const panel = vscode.window.createWebviewPanel(
        'blueprintAI',
        'Blueprint AI',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true,
          localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, 'webview', 'build'),
          ],
        }
      );

      MainWebviewPanel.currentPanel = new MainWebviewPanel(
        panel,
        extensionUri,
        context
      );
    }
  }

  private constructor(
    panel: vscode.WebviewPanel,
    extensionUri: vscode.Uri,
    context: vscode.ExtensionContext
  ) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._setWebviewContent();
  }

  public dispose() {
    MainWebviewPanel.currentPanel = undefined;

    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  private _setWebviewContent() {
    const webview = this._panel.webview;
    const nonce = this._getNonce();

    const manifestPath = path.join(
      this._extensionUri.fsPath,
      'webview',
      'build',
      'asset-manifest.json'
    );
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    const scriptPath = manifest['files']['main.js'];
    const cssPath = manifest['files']['main.css'];

    const scriptUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._extensionUri.fsPath, 'webview', 'build', scriptPath)
      )
    );
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.file(
        path.join(this._extensionUri.fsPath, 'webview', 'build', cssPath)
      )
    );

    const html = `<!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy"
                content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}' ${webview.cspSource}; font-src ${webview.cspSource} https: data:; img-src ${webview.cspSource} data:;">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blueprint AI</title>
        <link rel="stylesheet" type="text/css" href="${stylesUri}">
        </head>
        <body>
        <div id="root"></div>
        <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;

    webview.html = html;
  }

  private _getNonce() {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }
}
