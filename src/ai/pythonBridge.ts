// ai/pythonBridge.ts

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
import { randomBytes } from 'crypto';
import { getExtensionContext } from '../utils/extensionContext'; // <--- IMPORTANT

/**
 * Runs the Python OCR script using the screenshot buffer as input.
 *
 * Expects:
 *   <extensionRoot>/python-ocr/venv/Scripts/python.exe
 *   <extensionRoot>/python-ocr/ocr_service.py
 *
 * Returns: array of OCR result objects from the Python process (parsed from JSON).
 */
export async function runPythonOcr(screenshotBuffer: Buffer): Promise<any[]> {
  // 1) Retrieve our extension context from the shared manager
  const extensionContext = getExtensionContext();

  // 2) The extension’s install root directory
  const extensionRoot = extensionContext.extensionUri.fsPath;

  // 3) Build Python + script paths under <extensionRoot>/python-ocr
  const pythonPath = path.join(
    extensionRoot,
    'python-ocr',
    'venv',
    'Scripts',
    'python.exe'
  );
  const scriptPath = path.join(extensionRoot, 'python-ocr', 'ocr_service.py');

  // 3A) Basic checks: python.exe & script existence
  if (!fs.existsSync(pythonPath)) {
    throw new Error(`Cannot find Python interpreter at: ${pythonPath}`);
  }
  if (!fs.existsSync(scriptPath)) {
    throw new Error(`Cannot find OCR script at: ${scriptPath}`);
  }

  // 4) Generate a random temp file name for the screenshot
  const tempName = `temp_screenshot_${randomBytes(4).toString('hex')}.png`;

  // Option A: use extension’s globalStoragePath for the temp file.
  // This path is guaranteed to exist, even if no workspace is open.
  const tempFilePath = path.join(extensionContext.globalStoragePath, tempName);

  // 4A) Ensure the folder for globalStoragePath exists
  if (!fs.existsSync(extensionContext.globalStoragePath)) {
    fs.mkdirSync(extensionContext.globalStoragePath, { recursive: true });
  }

  // 4B) Write the screenshot buffer to disk
  try {
    fs.writeFileSync(tempFilePath, screenshotBuffer);
  } catch (err) {
    throw new Error(`Failed to write temp file at ${tempFilePath}: ${err}`);
  }

  // 5) Spawn the Python process
  return new Promise((resolve, reject) => {
    const pyProcess = spawn(pythonPath, [scriptPath, tempFilePath], {
      cwd: extensionRoot, // run from extension's root
    });

    let stdoutData = '';
    let stderrData = '';

    pyProcess.stdout.on('data', (chunk) => {
      stdoutData += chunk.toString();
    });

    pyProcess.stderr.on('data', (chunk) => {
      stderrData += chunk.toString();
    });

    pyProcess.on('close', (code) => {
      // Clean up temp file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupErr) {
        console.warn(
          `Warning: Failed to remove temp file: ${tempFilePath}`,
          cleanupErr
        );
      }

      if (code === 0) {
        // Attempt to parse JSON from stdout
        try {
          const results = JSON.parse(stdoutData);
          resolve(results);
        } catch (err) {
          reject(
            new Error(
              `Failed to parse JSON output from Python OCR script.\n` +
                `Error: ${err}\n\nRaw stdout:\n${stdoutData}`
            )
          );
        }
      } else {
        // Non-zero exit code => error
        const errorMessage =
          `Python OCR script exited with code ${code}.\n` +
          `stderr:\n${stderrData.trim()}\n` +
          `stdout:\n${stdoutData.trim()}\n` +
          `Check that your python-ocr setup is correct.`;
        reject(new Error(errorMessage));
        // Optionally surface this in a VSCode UI message:
        vscode.window.showErrorMessage(errorMessage);
      }
    });

    pyProcess.on('error', (err) => {
      // Clean up if spawn fails
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupErr) {
        console.warn(
          `Warning: Failed to remove temp file: ${tempFilePath}`,
          cleanupErr
        );
      }
      reject(new Error(`Failed to spawn Python OCR process: ${err}`));
    });
  });
}
