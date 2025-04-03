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
      console.log(
        '[ExportEditorView] No element found with ID "droppable-canvas-border".'
      );
      return;
    }

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

    console.log(
      '[ExportEditorView] Computed CSS was appended. Length of computed CSS:',
      finalCss.length
    );
  }, []);

  /**
   * Fetch each local image by its full path (including any ?query),
   * convert to Blob, and add to the ZIP in the same folder as <pageName>.html.
   */
  const addImagesToZip = async (zip: JSZip, imageUrls: string[]) => {
    console.log(
      `[ExportEditorView] addImagesToZip called. imageUrls length: ${imageUrls.length}`
    );
    console.log('[ExportEditorView] imageUrls array:', imageUrls);

    for (const url of imageUrls) {
      console.log(`[ExportEditorView] Attempting to fetch image: ${url}`);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(
            `[ExportEditorView] Failed HTTP fetch for: ${url}. Status: ${response.status}`
          );
          continue;
        }

        const blob = await response.blob();

        // Example url: /src/components/LocalPages/Page1/heroBanner.png?t=123
        // We only want the final filename, e.g. "heroBanner.png"
        const segments = url.split('/');
        const lastSegment = segments[segments.length - 1]; // "heroBanner.png?t=123"
        // If there's a query, remove it so the file is saved as "heroBanner.png"
        const [filename] = lastSegment.split('?');

        zip.file(filename, blob);

        console.log(
          `[ExportEditorView] Fetched & added image to ZIP: ${filename}. Blob size: ${blob.size}`
        );
      } catch (error) {
        console.warn(`[ExportEditorView] Error fetching image: ${url}`, error);
      }
    }
    console.log('[ExportEditorView] Finished addImagesToZip()');
  };

  /**
   * Creates a Zip file with:
   * 1) HTML (with references replaced so images point to filename only)
   * 2) CSS
   * 3) Any images found in the HTML
   */
  const downloadPageFilesAsZip = async () => {
    console.log('[ExportEditorView] downloadPageFilesAsZip called.');

    // 1) Find the /src/components/LocalPages/Page1/... images in the HTML
    const imagesInHtml = extractLocalImageUrlsFromHtml(htmlCode);

    // 2) Remove the "/src/components/LocalPages/Page1/" prefix from <img src>
    //    e.g. "/src/components/LocalPages/Page1/heroBanner.png?t=123" -> "heroBanner.png?t=123"
    //    This ensures the final <img src="heroBanner.png?t=123">
    const updatedHtml = htmlCode.replace(
      /\/src\/components\/LocalPages\/Page1\//g,
      ''
    );
    console.log('[ExportEditorView] Updated HTML references for images.');

    // 3) Build the zip
    const zip = new JSZip();

    // - Add updated HTML
    zip.file(`${pageName}.html`, updatedHtml);
    console.log(
      '[ExportEditorView] Added HTML file to zip:',
      `${pageName}.html`
    );

    // - Add CSS
    zip.file(`${pageName}.css`, cssCode);
    console.log('[ExportEditorView] Added CSS file to zip:', `${pageName}.css`);

    // - Add images (if any)
    await addImagesToZip(zip, imagesInHtml);

    // 4) Generate + download
    console.log('[ExportEditorView] Generating ZIP content.');
    const content = await zip.generateAsync({ type: 'blob' });
    console.log('[ExportEditorView] Triggering file download.');
    saveAs(content, `${pageName}.zip`);
  };

  // Dropdown options (purely for looks)
  const exportOptions: IDropdownOption[] = [
    { key: 'htmlCss', text: 'HTML & CSS' },
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
          // Just for looks, no onChange
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
                  // Ensures suggestion widgets follow the editor in a modal
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
