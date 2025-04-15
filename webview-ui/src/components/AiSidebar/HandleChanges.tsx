// HandleChanges.tsx

/**
 * handleGenerateOutput:
 * Logs the selected component's HTML in the form:
 *
 * const ComponentName: React.FC = () => {
 *   return (
 *     ...HTML...
 *   )
 * }
 * export default ComponentName;
 */
export function handleGenerateOutput(
  componentName: string,
  componentHTML: string
) {
  // Build the snippet
  const snippet = `
const ${componentName}: React.FC = () => {
  return (
    ${componentHTML}
  );
};

export default ${componentName};
`.trim();

  // Print to console
  console.log(snippet);
}
