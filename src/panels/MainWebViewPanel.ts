// MainWebViewPanel.ts

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

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

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'alert':
            vscode.window.showErrorMessage(message.text);
            return;
        }
      },
      null,
      this._disposables
    );
  }

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

  private _update() {
    const webview = this._panel.webview;
    this._panel.title = 'Blueprint AI';
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const distPath = vscode.Uri.joinPath(
      this._extensionUri,
      'webview-ui',
      'dist'
    );
    const indexPath = vscode.Uri.joinPath(distPath, 'index.html');

    let html = fs.readFileSync(indexPath.fsPath, 'utf8');

    html = this._updateHtmlForWebview(html, webview, distPath);

    return html;
  }

  private _updateHtmlForWebview(
    html: string,
    webview: vscode.Webview,
    distPath: vscode.Uri
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
          img-src ${webview.cspSource} https:;
          script-src 'nonce-${nonce}' ${webview.cspSource};
          style-src ${webview.cspSource} 'unsafe-inline';
          font-src ${webview.cspSource};
          connect-src ${webview.cspSource} https:;
      ">`
    );

    // Helper function to fix resource URIs
    const fixUri = (match: string, uri: string) => {
      const resourcePath = uri.replace(/^\//, '');
      const resourceUri = webview.asWebviewUri(
        vscode.Uri.joinPath(distPath, resourcePath)
      );
      return match.replace(uri, resourceUri.toString());
    };

    // Update script tags and add nonce
    html = html.replace(
      /<script\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, src) => {
        const scriptPathOnDisk = vscode.Uri.joinPath(distPath, src);
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
        const stylePathOnDisk = vscode.Uri.joinPath(distPath, href);
        const styleUri = webview.asWebviewUri(stylePathOnDisk);
        return `<link ${attributes.replace(href, styleUri.toString())}>`;
      }
    );

    // Update img tags
    html = html.replace(/<img\s+([^>]*src=["']([^"']+)["'][^>]*)>/gi, fixUri);

    // Update a tags
    html = html.replace(
      /<a\s+([^>]*href=["']([^"']+)["'][^>]*)>/gi,
      (match, attributes, href) => {
        if (href.startsWith('/')) {
          const linkPathOnDisk = vscode.Uri.joinPath(distPath, href);
          const linkUri = webview.asWebviewUri(linkPathOnDisk);
          return `<a ${attributes.replace(href, linkUri.toString())}>`;
        }
        return match;
      }
    );

    return html;
  }
}

function getWebviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [
      vscode.Uri.joinPath(extensionUri, 'webview-ui', 'dist'),
    ],
    enableCommandUris: true,
  };
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
