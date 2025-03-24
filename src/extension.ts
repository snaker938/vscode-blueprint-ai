import * as vscode from 'vscode';
import { MainWebViewPanel } from './panels/MainWebViewPanel';
import { setExtensionContext } from './utils/extensionContext';

export async function activate(context: vscode.ExtensionContext) {
  // 1) Save the context globally
  setExtensionContext(context);

  console.log('Blueprint AI extension is now active!');

  // 2) Ensure API key is set before continuing
  const hasKey = await ensureApiKeyIsSet();
  if (!hasKey) {
    // If user did not provide a key, we stop here.
    // You can show an error if you want:
    vscode.window.showErrorMessage(
      'Blueprint AI requires an OpenAI API key to function. The extension will be disabled until you provide a key.'
    );
    return;
  }

  // 3) Example: Create status bar item
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = `$(rocket) Blueprint AI`;
  statusBarItem.tooltip = 'Open Blueprint AI';
  statusBarItem.command = 'blueprint-ai.openWebview';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 4) Register command
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

/**
 * Checks whether the user has a stored OpenAI API key in the `blueprintAI.openaiApiKey` setting.
 * If not set, prompts the user to enter the key. Returns true if the key is set, false otherwise.
 */
async function ensureApiKeyIsSet(): Promise<boolean> {
  const config = vscode.workspace.getConfiguration('blueprintAI');
  let openaiApiKey = config.get<string>('openaiApiKey');

  if (!openaiApiKey) {
    const enteredKey = await vscode.window.showInputBox({
      prompt: 'Enter your OpenAI API Key to continue using Blueprint AI',
      placeHolder: 'sk-...',
      ignoreFocusOut: true,
    });

    // If user cancels or provides empty input, we do not proceed
    if (!enteredKey) {
      return false;
    }

    // Save the user-provided key
    await config.update(
      'openaiApiKey',
      enteredKey,
      vscode.ConfigurationTarget.Global
    );
    vscode.window.showInformationMessage(
      'OpenAI API key saved. You can now use Blueprint AI features.'
    );
    openaiApiKey = enteredKey; // for clarity, though we don't use it further here
  }

  // If we reach here, key is set
  return true;
}
