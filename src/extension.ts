import * as vscode from 'vscode';
import { MainWebViewPanel } from './panels/MainWebViewPanel';
import { setExtensionContext } from './utils/extensionContext';

export function activate(context: vscode.ExtensionContext) {
  // 1) Save the context globally
  setExtensionContext(context);

  console.log('Blueprint AI extension is now active!');

  // 2) Example: Create status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = `$(rocket) Blueprint AI`;
  statusBarItem.tooltip = 'Open Blueprint AI';
  statusBarItem.command = 'blueprint-ai.openWebview';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 3) Register command
  const disposable = vscode.commands.registerCommand(
    'blueprint-ai.openWebview',
    () => {
      MainWebViewPanel.createOrShow(context.extensionUri);
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {
  // optional cleanup
}
