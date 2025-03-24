// utils/vscodeApi.ts
/**
 * Access the VS Code API injected into the webview.
 * If it doesn’t exist, we return undefined (e.g., if running in a browser).
 */
export function getVsCodeApi():
  | {
      postMessage: (msg: any) => void;
      setState?: (state: any) => void;
      getState?: () => any;
    }
  | undefined {
  return (typeof window !== 'undefined' && (window as any).vscode) || undefined;
}
