// extension.ts

import * as vscode from 'vscode';
import { MainWebViewPanel } from './panels/MainWebViewPanel';
import {
  setExtensionContext,
  setOpenAiApiKey,
  getOpenAiApiKey,
  clearOpenAiApiKey,
} from './utils/extensionContext';
import { validateOpenAiApiKey } from './utils/validateApiKey';

export function activate(context: vscode.ExtensionContext) {
  // 1) Save the context globally
  setExtensionContext(context);

  console.log('Blueprint AI extension is now active!');

  // 2) Create a status bar icon (toolbar item) always (as soon as extension is activated)
  createStatusBarItem(context);

  // 3) Register the command for "Open Blueprint AI"
  const disposable = vscode.commands.registerCommand(
    'blueprint-ai.openWebview',
    async () => {
      const hasKey = await promptForApiKeyIfNone();
      if (!hasKey) {
        // If user cancelled or did not provide a valid key, do not continue
        vscode.window.showErrorMessage(
          'Blueprint AI requires a valid OpenAI API key. The extension will not function without it.'
        );
        return;
      }

      // If we have a valid key, show the main webview
      MainWebViewPanel.createOrShow(context.extensionUri);
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Deactivate cleans up: we clear out the in-memory API key here.
 */
export function deactivate() {
  clearOpenAiApiKey();
}

/**
 * Prompts the user to enter an API key if one is not already set in memory.
 * Returns true if we have a valid key afterward, false otherwise.
 */
async function promptForApiKeyIfNone(): Promise<boolean> {
  const existingKey = getOpenAiApiKey();
  if (existingKey) {
    // Already in memory
    return true;
  }

  const enteredKey = await vscode.window.showInputBox({
    prompt: 'Enter your OpenAI API Key to continue using Blueprint AI',
    placeHolder: 'sk-...',
    ignoreFocusOut: true,
  });

  if (!enteredKey) {
    return false; // user cancelled or provided an empty key
  }

  // Validate the key before storing it
  const isValid = await validateOpenAiApiKey(enteredKey);
  if (!isValid) {
    vscode.window.showErrorMessage(
      'The provided OpenAI API key is invalid. Please enter a valid key.'
    );
    return false;
  }

  // Store in memory
  setOpenAiApiKey(enteredKey);
  vscode.window.showInformationMessage(
    'OpenAI API key set in memory. It will be cleared on VSCode shutdown.'
  );

  return true;
}

/**
 * Creates and shows a status bar item that can re-open the extension.
 * This is displayed as a "rocket" icon in the lower-left (or wherever the user’s status bar is).
 */
function createStatusBarItem(context: vscode.ExtensionContext) {
  // If it's already created once, do nothing
  const existingItem = context.subscriptions.find(
    (sub) => 'text' in sub && 'command' in sub
  ) as vscode.StatusBarItem | undefined;

  if (existingItem) {
    return;
  }

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = `$(rocket) Blueprint AI`;
  statusBarItem.tooltip = 'Open Blueprint AI';
  statusBarItem.command = 'blueprint-ai.openWebview';
  statusBarItem.show();

  context.subscriptions.push(statusBarItem);
}
