// webview-ui/src/vscode.d.ts

declare global {
  function acquireVsCodeApi(): {
    postMessage: (message: any) => void;
    getState: () => any;
    setState: (newState: any) => void;
  };
}

// Important: To ensure this file is treated as a module and not a script
export {};
