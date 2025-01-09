import * as vscode from 'vscode';

let _ctx: vscode.ExtensionContext | undefined;

/**
 * Store the ExtensionContext so other modules can access it.
 */
export function setExtensionContext(ctx: vscode.ExtensionContext) {
  _ctx = ctx;
}

/**
 * Retrieve the ExtensionContext previously set in activate().
 */
export function getExtensionContext(): vscode.ExtensionContext {
  if (!_ctx) {
    throw new Error(
      'Blueprint AI: Extension context not set. ' +
        'Make sure setExtensionContext() is called in activate().'
    );
  }
  return _ctx;
}
