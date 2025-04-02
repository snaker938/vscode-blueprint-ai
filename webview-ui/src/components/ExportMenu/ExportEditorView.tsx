import React, { useEffect, useState } from 'react';
import {
  Stack,
  Pivot,
  PivotItem,
  PrimaryButton,
  DefaultButton,
} from '@fluentui/react';
import Editor from '@monaco-editor/react';

// For zipping:
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { css as beautifyCss } from 'js-beautify'; // for optional CSS formatting

interface ExportEditorViewProps {
  pageId: string;
  pageName: string;
  /** The initial HTML to display in the editor */
  initialHtml: string;
  /** For this example, we will generate the CSS automatically from computed styles,
   * but you can still provide some initial CSS or an empty string. */
  initialCss: string;
  /** Called when clicking "Back to Editor" */
  onBack: () => void;
}

/**
 * A component that:
 * 1) Shows two Monaco Editor tabs (HTML/CSS).
 * 2) Gathers computed CSS for #droppable-canvas-border and its children,
 *    storing it in the "CSS" tab automatically.
 * 3) Allows downloading these two as a zip file (no JS).
 * 4) Uses a wide layout (90vw) so the editor is fairly wide.
 */
const ExportEditorView: React.FC<ExportEditorViewProps> = ({
  pageId,
  pageName,
  initialHtml,
  initialCss,
  onBack,
}) => {
  // Local states for code in each editor
  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [cssCode, setCssCode] = useState(initialCss);

  // Set the initial code from props on mount
  useEffect(() => {
    setHtmlCode(initialHtml);
    setCssCode(initialCss);
  }, [initialHtml, initialCss]);

  /**
   * On mount, gather computed styles for #droppable-canvas-border and its children,
   * then build a CSS string that we store in state.
   */
  useEffect(() => {
    const container = document.getElementById('droppable-canvas-border');
    if (!container) return;

    // Grab all elements inside (including the container itself)
    const allEls = [container, ...container.querySelectorAll('*')];

    // Assign a data attribute for unique identification
    allEls.forEach((el, i) => {
      el.setAttribute('data-export-index', String(i));
    });

    let computedCss = '';
    // Build a rule for each element
    allEls.forEach((el, i) => {
      // If it's the container itself:
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

    // Remove the data attributes from the DOM
    allEls.forEach((el) => el.removeAttribute('data-export-index'));

    // Optionally beautify the computed CSS
    const finalCss = beautifyCss(computedCss, {
      indent_size: 2,
      preserve_newlines: true,
    });

    // Update the editor’s CSS with the computed/beautified style
    setCssCode(
      (prev) => `${prev}\n\n/* --- Computed CSS Below --- */\n\n${finalCss}`
    );
  }, []);

  /**
   * Creates a Zip file with the HTML and CSS, then triggers download.
   */
  const downloadPageFilesAsZip = async () => {
    const zip = new JSZip();
    zip.file(`${pageName}.html`, htmlCode);
    zip.file(`${pageName}.css`, cssCode);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${pageName}.zip`);
  };

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      // Make the area much wider (e.g. 90% of the viewport width).
      styles={{ root: { padding: 16, width: '90vw', margin: '0 auto' } }}
    >
      {/* Back button to return to main interface */}
      <DefaultButton
        iconProps={{ iconName: 'Back' }}
        text="Back to Editor"
        onClick={onBack}
      />

      {/* Single pivot item for this one page */}
      <Pivot>
        <PivotItem headerText={pageName} itemKey={pageId}>
          {/* Download as Zip button */}
          <div style={{ textAlign: 'right', margin: '8px 0' }}>
            <PrimaryButton
              iconProps={{ iconName: 'Download' }}
              text="Download as Zip"
              onClick={downloadPageFilesAsZip}
            />
          </div>

          {/* Nested pivot for HTML/CSS (NO JS tab) */}
          <Pivot>
            <PivotItem headerText="HTML" itemKey="html">
              <Editor
                width="100%"
                height="70vh"
                language="html"
                value={htmlCode}
                onChange={(val) => {
                  if (val !== undefined) setHtmlCode(val);
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
              />
            </PivotItem>
          </Pivot>
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

export default ExportEditorView;
