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
 * Extract image URLs from the HTML that match:
 * /src/components/LocalPages/Page1/<anything>.png or .jpg or .jpeg
 * Possibly ending with ?someQueryParam
 *
 * Example matches:
 * /src/components/LocalPages/Page1/amazonLogo.png
 * /src/components/LocalPages/Page1/heroBanner.png?t=1743675251970
 */
function extractLocalImageUrlsFromHtml(html: string): string[] {
  // - We require /src/components/LocalPages/Page1/
  // - Then some file name
  // - Then .png or .jpg or .jpeg
  // - Optionally (?) a query string like ?t=123
  const regex =
    /\/src\/components\/LocalPages\/Page1\/[^\s"']+\.(?:png|jpe?g)(\?[^\s"']+)?/gi;
  const matches = html.match(regex) || [];
  // Make them unique (in case repeated)
  return Array.from(new Set(matches));
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
 *    - All images from /src/components/LocalPages/Page1/ that appear in the HTML
 *      (placed in the same folder as the HTML in the ZIP)
 * 4) Has a "Back to Editor" and "Download as Zip" button, plus a dummy dropdown
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
    if (!container) {
      return;
    }

    const allEls = [container, ...container.querySelectorAll('*')];
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

    allEls.forEach((el) => el.removeAttribute('data-export-index'));

    const finalCss = beautifyCss(computedCss, {
      indent_size: 2,
      preserve_newlines: true,
    });

    setCssCode(
      (prev) => `${prev}\n\n/* --- Computed CSS Below --- */\n\n${finalCss}`
    );
  }, []);

  /**
   * Fetch each local image by its full path (including any ?query),
   * convert to Blob, and add to the ZIP in the same folder as <pageName>.html.
   */
  const addImagesToZip = async (zip: JSZip, imageUrls: string[]) => {
    for (const url of imageUrls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          continue;
        }

        const blob = await response.blob();

        const segments = url.split('/');
        const lastSegment = segments[segments.length - 1];
        const [filename] = lastSegment.split('?');

        zip.file(filename, blob);
      } catch {
        // Swallow fetch errors
      }
    }
  };

  /**
   * Creates a Zip file with:
   * 1) HTML (with references replaced so images point to filename only)
   * 2) CSS
   * 3) Any images found in the HTML
   */
  const downloadPageFilesAsZip = async () => {
    const imagesInHtml = extractLocalImageUrlsFromHtml(htmlCode);
    const updatedHtml = htmlCode.replace(
      /\/src\/components\/LocalPages\/Page1\//g,
      ''
    );

    const zip = new JSZip();
    zip.file(`${pageName}.html`, updatedHtml);
    zip.file(`${pageName}.css`, cssCode);

    await addImagesToZip(zip, imagesInHtml);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${pageName}.zip`);
  };

  const exportOptions: IDropdownOption[] = [
    { key: 'htmlCss', text: 'HTML & CSS' },
    { key: 'winui', text: 'WinUI' },
    { key: 'dotnet', text: '.NET' },
  ];

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{
        root: {
          padding: 16,
          width: '90vw',
          margin: '0 auto',
          overflow: 'visible',
        },
      }}
    >
      <Stack horizontal tokens={{ childrenGap: 16 }}>
        <DefaultButton
          iconProps={{ iconName: 'Back' }}
          text="Back to Export Menu"
          onClick={onBack}
        />
        <PrimaryButton
          iconProps={{ iconName: 'Download' }}
          text="Download as Zip"
          onClick={downloadPageFilesAsZip}
        />
        <Dropdown
          placeholder="Exporting to..."
          defaultSelectedKey="htmlCss"
          options={exportOptions}
          styles={{ dropdown: { width: 180 } }}
          disabled={true}
        />
      </Stack>

      <Pivot styles={{ root: { overflow: 'visible' } }}>
        <PivotItem headerText={pageName} itemKey={pageId}>
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
