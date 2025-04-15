import React, { useEffect, useState } from 'react';
import {
  Stack,
  Pivot,
  PivotItem,
  PrimaryButton,
  Dropdown,
  IDropdownOption,
  IconButton,
} from '@fluentui/react';
import Editor from '@monaco-editor/react';

// For zipping:
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { css as beautifyCss, html as beautifyHtml } from 'js-beautify';

// Pull the currently selected page from your store
import { getSelectedPage } from '../../store/store';

interface ExportMenuProps {
  /** Handler to close/hide this export overlay. */
  onClose: () => void;
}

/** Helper to extract local images from /src/components/LocalPages/Page1/... */
function extractLocalImageUrlsFromHtml(html: string): string[] {
  const regex =
    /\/src\/components\/LocalPages\/Page1\/[^\s"']+\.(?:png|jpe?g)(\?[^\s"']+)?/gi;
  const matches = html.match(regex) || [];
  return Array.from(new Set(matches));
}

const ExportMenu: React.FC<ExportMenuProps> = ({ onClose }) => {
  // The page from your store
  const page = getSelectedPage();
  const pageName = page ? page.name : 'UntitledPage';
  const pageId = page ? String(page.id) : '0';

  // Editor state
  const [htmlCode, setHtmlCode] = useState('');
  const [cssCode, setCssCode] = useState('');

  /**
   * On mount (and when the page/pageName changes), grab the HTML from
   * #droppable-canvas-border, beautify it, then set a default CSS.
   */
  useEffect(() => {
    if (!page) return;

    const droppableEl = document.getElementById('droppable-canvas-border');
    const rawHtml = droppableEl
      ? droppableEl.outerHTML
      : '<div>No content</div>';

    // Beautify the HTML
    const formattedHtml = beautifyHtml(rawHtml, {
      indent_size: 2,
      preserve_newlines: true,
    });

    setHtmlCode(formattedHtml);
    setCssCode(
      `/* Default CSS for ${pageName} */\nbody {\n  margin: 0;\n  padding: 0;\n}\n`
    );
  }, [page, pageName]);

  /**
   * Whenever the HTML changes, gather computed CSS from the DOM
   * and append it to the existing CSS.
   */
  useEffect(() => {
    const container = document.getElementById('droppable-canvas-border');
    if (!container) return;

    // Tag each element
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

    // Remove data-export attributes
    allEls.forEach((el) => el.removeAttribute('data-export-index'));

    // Beautify that CSS
    const beautified = beautifyCss(computedCss, {
      indent_size: 2,
      preserve_newlines: true,
    });

    // Append to existing CSS
    setCssCode(
      (prev) => `${prev}\n\n/* --- Computed CSS Below --- */\n\n${beautified}`
    );
  }, [htmlCode]);

  /** Downloads a zip containing: [pageName].html, [pageName].css, plus local images. */
  const downloadPageFilesAsZip = async () => {
    // Gather local images from the HTML
    const imagesInHtml = extractLocalImageUrlsFromHtml(htmlCode);

    // For the .html, remove the "/src/components/LocalPages/Page1/" prefix
    const cleanedHtml = htmlCode.replace(
      /\/src\/components\/LocalPages\/Page1\//g,
      ''
    );

    // Build up the zip
    const zip = new JSZip();
    zip.file(`${pageName}.html`, cleanedHtml);
    zip.file(`${pageName}.css`, cssCode);

    // Fetch each image and add it
    for (const url of imagesInHtml) {
      try {
        const response = await fetch(url);
        if (!response.ok) continue;

        const blob = await response.blob();
        // Extract just the file name
        const lastPart = url.split('/').pop() || 'image.png';
        const [filename] = lastPart.split('?');
        zip.file(filename, blob);
      } catch {
        // ignore fetch errors
      }
    }

    // Trigger download
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${pageName}.zip`);
  };

  // Simple options (disabled in the UI)
  const exportOptions: IDropdownOption[] = [
    { key: 'htmlCss', text: 'HTML & CSS' },
    { key: 'winui', text: 'WinUI (N/A)' },
    { key: 'dotnet', text: '.NET (N/A)' },
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
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          title="Close"
          ariaLabel="Close"
          onClick={onClose}
          styles={{ root: { marginTop: '4px' } }}
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
                options={{ fixedOverflowWidgets: true }}
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
                options={{ fixedOverflowWidgets: true }}
              />
            </PivotItem>
          </Pivot>
        </PivotItem>
      </Pivot>
    </Stack>
  );
};

export default ExportMenu;
