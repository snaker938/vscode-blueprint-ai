// createCustomComponent.tsx

import React from 'react';
import { transform } from '@babel/standalone';
import { ImageWrapper, VideoWrapper } from './CustomComponents';

/**
 * 1) Checks snippet for "export default function X" or "const X"
 * 2) Returns "X" or a fallback name
 */
function parseFunctionName(code: string): string {
  // e.g. "export default function Foo"
  let match = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
  if (match) return match[1];

  // e.g. "const Foo"
  match = code.match(/const\s+([A-Za-z0-9_]+)/);
  if (match) return match[1];

  // fallback:
  return 'DynamicBlueprintComponent';
}

/**
 * Removes TypeScript type annotations & any `export default SomeName;` line.
 */
function sanitizeSnippet(code: string): string {
  // e.g. ": React.FC" => remove
  code = code.replace(/:\s*React\.FC(\s*=\s*\(\)\s*=>)?/, '= () =>');
  // remove "export default SomeName;"
  code = code.replace(/export\s+default\s+[A-Za-z0-9_]+\s*;?/, '');
  return code;
}

/**
 * Creates a React component dynamically from a JSX/TS snippet.
 */
export function createCustomComponent(snippet: string) {
  // 1) Identify the function name
  const functionName = parseFunctionName(snippet);

  // 2) Remove TS bits & the export
  const sanitized = sanitizeSnippet(snippet);

  // 3) Wrap the snippet in an IIFE that returns the component
  const wrappedCode = `
    (function(React, ImageWrapper, VideoWrapper) {
      ${sanitized}
      return ${functionName};
    })
  `.trim();

  // 4) Babel-transpile the wrapped code
  let out;
  try {
    out = transform(wrappedCode, {
      filename: 'DynamicSnippet.tsx',
      presets: [['env', { modules: false }], 'react', 'typescript'],
      sourceType: 'script',
    });
  } catch (e) {
    console.error('[createCustomComponent] Babel transform error:', e);
    throw e;
  }

  if (!out || !out.code) {
    throw new Error('[createCustomComponent] Babel did not produce output.');
  }

  let transpiled = out.code.trim();

  // Remove "use strict" from Babel output
  transpiled = transpiled.replace(/["']use strict["'];?/g, '');

  // 5) Create a function wrapper that returns the IIFE
  const functionWrapperString = 'return ' + transpiled;

  // 6) Evaluate the transpiled code
  let outerFunc;
  try {
    outerFunc = new Function(functionWrapperString)();
    if (typeof outerFunc !== 'function') {
      throw new Error('[createCustomComponent] outerFunc is not a function');
    }
  } catch (e) {
    console.error('[createCustomComponent] Error evaluating code:', e);
    throw e;
  }

  // 7) Invoke the IIFE with our React + wrappers => get a real component
  let GeneratedComponent;
  try {
    GeneratedComponent = outerFunc(
      React,
      ImageWrapper,
      VideoWrapper
    ) as React.FC;
  } catch (e) {
    console.error('[createCustomComponent] Error invoking outerFunc:', e);
    throw e;
  }

  // 8) Wrap in a React component so we can attach .craft, etc.
  const Wrapper: React.FC = () => <GeneratedComponent />;

  // Add CraftJS display name
  (Wrapper as any).craft = { displayName: functionName };

  // For debugging: attach the raw code
  (Wrapper as any).rawComponentCode = snippet;

  return Wrapper;
}
