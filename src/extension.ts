import * as vscode from 'vscode';
import { MainWebviewPanel } from './panels/MainWebViewPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Blueprint AI extension is now active!');

  let disposable = vscode.commands.registerCommand(
    'blueprint-ai.openWebview',
    () => {
      MainWebviewPanel.render(context.extensionUri, context);
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
