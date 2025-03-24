// utils/extensionContext.ts
import * as vscode from 'vscode';

let _ctx: vscode.ExtensionContext | undefined;
let _openAiApiKey: string | undefined;

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

/**
 * Store the API key in memory (NOT in settings).
 */
export function setOpenAiApiKey(key: string) {
  _openAiApiKey = key;
}

/**
 * Retrieve the in-memory API key.
 */
export function getOpenAiApiKey(): string | undefined {
  return _openAiApiKey;
}

/**
 * Clears the stored in-memory API key.
 */
export function clearOpenAiApiKey() {
  _openAiApiKey = undefined;
}
