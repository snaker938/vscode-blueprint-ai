import * as vscode from 'vscode';
import { MainWebViewPanel } from './panels/MainWebViewPanel';

export function activate(context: vscode.ExtensionContext) {
  console.log('Blueprint AI extension is now active!');

  // Create a status bar item and make it visible immediately
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = `$(rocket) Blueprint AI`;
  statusBarItem.tooltip = 'Open Blueprint AI';
  statusBarItem.command = 'blueprint-ai.openWebview';
  statusBarItem.show();

  // Push the status bar item to context so it's disposed of on deactivate
  context.subscriptions.push(statusBarItem);

  // Register the command to open the webview
  const disposable = vscode.commands.registerCommand(
    'blueprint-ai.openWebview',
    () => {
      MainWebViewPanel.createOrShow(context.extensionUri);
    }
  );

  // Push the command to context so it's disposed of on deactivate
  context.subscriptions.push(disposable);
}

export function deactivate() {}
