import React, { useEffect, useState } from 'react';
import {
  Stack,
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownOption,
} from '@fluentui/react';
import Editor from '@monaco-editor/react';

// For zipping:
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { css as beautifyCss } from 'js-beautify';

/**
 * Attempt to import all .png/.jpg/.jpeg images from "../LocalPages/Page1"
 * using `require.context`. If it's not supported, we'll log a warning
 * and simply produce an empty list of images.
 */
let localImages: string[] = [];
try {
  // Helper to retrieve all required files
  const importAll = (context: any) => context.keys().map(context);

  // Use require.context if available
  const r = (require as any).context(
    '../LocalPages/Page1',
    false,
    /\.(png|jpe?g)$/
  );
  localImages = importAll(r);
} catch (err) {
  console.warn('require.context is not supported in this environment:', err);
}

interface ExportEditorViewProps {
  pageId: string;
  pageName: string;
  /** The initial HTML to display in the editor */
  initialHtml: string;
  /** We'll add computed CSS to this initial CSS */
  initialCss: string;
  /** Called when clicking "Back to Editor" */
  onBack: () => void;
}

/**
 * A component that:
 * 1) Shows two Monaco Editor tabs (HTML/CSS).
 * 2) Gathers computed CSS for #droppable-canvas-border and its children,
 *    storing it in the "CSS" tab automatically (beautified).
 * 3) Lets user download a .zip containing:
 *    - <pageName>.html
 *    - <pageName>.css
 *    - All images from ../LocalPages/Page1 as binary files
 * 4) Places "Back to Editor" and "Download as Zip" next to each other,
 *    plus a dropdown to indicate what we're "exporting to" (just for looks).
 * 5) Uses a wide layout (90vw) so the editor is fairly wide.
 */
const ExportEditorView: React.FC<ExportEditorViewProps> = ({
  pageId,
  pageName,
  initialHtml,
  initialCss,
  onBack,
}) => {
  // State for code in each editor
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);

  // Set initial code from props on mount
  useEffect(() => {
    setHtmlCode(initialHtml);
    setCssCode(initialCss);
  }, [initialHtml, initialCss]);

  /**
   * On mount, gather computed styles from #droppable-canvas-border + children
   * and append them to the existing CSS string.
   */
  useEffect(() => {
    const container = document.getElementById('droppable-canvas-border');
    if (!container) return;

    // All elements including container
    const allEls = [container, ...container.querySelectorAll('*')];

    // Give each element a unique data attribute
    allEls.forEach((el, i) => el.setAttribute('data-export-index', String(i)));

    let computedCss = '';
    allEls.forEach((el, i) => {
      const selector =
        i === 0
          ? '#droppable-canvas-border[data-export-index="0"]'
          : `#droppable-canvas-border [data-export-index="${i}"]`;

      const styleObj = window.getComputedStyle(el as HTMLElement);
      const styleProps = Array.from(styleObj);

      let rule = `${selector} {\n`;
      styleProps.forEach((prop) => {
        const val = styleObj.getPropertyValue(prop);
        rule += `  ${prop}: ${val};\n`;
      });
      rule += '}\n\n';
      computedCss += rule;
    });

    // Remove data attributes from the DOM
    allEls.forEach((el) => el.removeAttribute('data-export-index'));

    // Beautify the computed CSS
    const finalCss = beautifyCss(computedCss, {
      indent_size: 2,
      preserve_newlines: true,
    });

    // Append to whatever CSS we already had
    setCssCode(
      (prev) => `${prev}\n\n/* --- Computed CSS Below --- */\n\n${finalCss}`
    );
  }, []);

  /**
   * Fetch each local image, convert to Blob, add to zip
   */
  const addImagesToZip = async (zip: JSZip) => {
    for (const url of localImages) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();

        // Extract the filename from the URL, e.g. "image.png"
        const segments = url.split('/');
        const filename = segments[segments.length - 1];

        // Add to the zip
        zip.file(filename, blob);
      } catch (error) {
        console.warn('Error fetching image:', url, error);
      }
    }
  };

  /**
   * Creates a Zip file with HTML, CSS, plus all images from ../LocalPages/Page1,
   * then triggers download.
   */
  const downloadPageFilesAsZip = async () => {
    const zip = new JSZip();

    // Add HTML + CSS
    zip.file(`${pageName}.html`, htmlCode);
    zip.file(`${pageName}.css`, cssCode);

    // Add images (if any)
    await addImagesToZip(zip);

    // Generate + download
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${pageName}.zip`);
  };

  // Dropdown options (purely for looks, no logic attached)
  const exportOptions: IDropdownOption[] = [
    { key: 'htmlCss', text: 'HTML, CSS and CSS' },
    { key: 'winui', text: 'WinUI' },
    { key: 'dotnet', text: '.NET' },
  ];

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      // Ensure overflow is visible so Monaco tooltips aren't clipped
      styles={{
        root: {
          padding: 16,
          width: '90vw',
          margin: '0 auto',
          overflow: 'visible',
        },
      }}
    >
      {/* Top row: "Back to Editor", "Download as Zip", and the look-only dropdown */}
      <Stack horizontal tokens={{ childrenGap: 16 }}>
        <DefaultButton
          iconProps={{ iconName: 'Back' }}
          text="Back to Editor"
          onClick={onBack}
        />
        <PrimaryButton
          iconProps={{ iconName: 'Download' }}
          text="Download as Zip"
          onClick={downloadPageFilesAsZip}
        />
        <Dropdown
          // Just for looks, no onChange or anything else
          placeholder="Exporting to..."
          defaultSelectedKey="htmlCss"
          options={exportOptions}
          styles={{ dropdown: { width: 180 } }}
        />
      </Stack>

      {/* Single pivot for the one page */}
      <Pivot styles={{ root: { overflow: 'visible' } }}>
        <PivotItem headerText={pageName} itemKey={pageId}>
          {/* Nested pivot for HTML/CSS editors */}
          <Pivot styles={{ root: { overflow: 'visible' } }}>
            <PivotItem headerText="HTML" itemKey="html">
              <Editor
                width="100%"
                height="70vh"
                language="html"
                value={htmlCode}
                onChange={(val) => {
                  if (val !== undefined) setHtmlCode(val);
                }}
                options={{
                  // Ensures suggestion widgets follow the editor correctly in a modal
                  fixedOverflowWidgets: true,
                }}
              />
            </PivotItem>

            <PivotItem headerText="CSS" itemKey="css">
              <Editor
                width="100%"
                height="70vh"
                language="css"
                value={cssCode}
                onChange={(val) => {
                  if (val !== undefined) setCssCode(val);
                }}
                options={{
                  fixedOverflowWidgets: true,
                }}
              />
            </PivotItem>
          </Pivot>
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

export default ExportEditorView;
