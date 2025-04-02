import React, { useState, useMemo } from 'react';
import { useEditor } from '@craftjs/core';
import { Checkbox, PrimaryButton, IconButton } from '@fluentui/react';
import { html as beautifyHtml } from 'js-beautify'; // For HTML formatting

import ExportEditorView from './ExportEditorView';
import './ExportMenu.css'; // optional styling

interface Page {
  id: number;
  name: string;
  thumbnail?: string;
}

interface ExportMenuProps {
  onClose: () => void;
}

/**
 * In a real application, you might pull pages from Redux or your custom store.
 * Here, we define a single mock page.
 */
const MOCK_PAGE: Page = {
  id: 1,
  name: 'MyPage',
  thumbnail: '',
};

const ExportMenu: React.FC<ExportMenuProps> = ({ onClose }) => {
  const [folderPath, setFolderPath] = useState('Choose folder');
  const [selectAll, setSelectAll] = useState(true);

  // Get craft.js info (optional). In a real app, gather actual stats or remove.
  const { nodes } = useEditor((state) => ({ nodes: state.nodes }));
  const nodeCount = Object.keys(nodes).length;

  // Some random stats for the right panel
  const randomSeed = useMemo(() => Math.floor(Math.random() * 500), []);
  const totalSize = useMemo(
    () => (nodeCount * 2 + randomSeed).toFixed(1),
    [nodeCount, randomSeed]
  );
  const numberOfFiles = useMemo(() => nodeCount + 5, [nodeCount]);
  const linesOfCode = useMemo(
    () => nodeCount * 30 + randomSeed,
    [nodeCount, randomSeed]
  );
  const timeToExport = useMemo(
    () => nodeCount * 5 + randomSeed,
    [nodeCount, randomSeed]
  );

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Not all browsers fully support directory picking.
    setFolderPath(e.target.files[0].webkitRelativePath || 'Selected folder');
  };

  // Toggling "select all" for the single page
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
  };

  // For toggling the Editor View
  const [showEditorView, setShowEditorView] = useState(false);

  // Data to pass into ExportEditorView
  const [pageHtml, setPageHtml] = useState('');
  const [pageCss, setPageCss] = useState('');

  /**
   * 1) Get the raw HTML from #droppable-canvas-border
   * 2) Beautify the HTML
   * 3) Provide some initial CSS
   * 4) Switch to ExportEditorView
   */
  const handleExport = () => {
    const canvasEl = document.getElementById('droppable-canvas-border');
    const rawHtml = canvasEl
      ? canvasEl.outerHTML
      : '<div>No content found</div>';

    // Beautify the HTML
    const formattedHtml = beautifyHtml(rawHtml, {
      indent_size: 2,
      preserve_newlines: true,
    });

    // Some default CSS (the computed CSS will be appended in ExportEditorView)
    const defaultCss = `/* Example default CSS for your page. Adjust as needed. */
body {
  margin: 0;
  padding: 0;
}
`;

    setPageHtml(formattedHtml);
    setPageCss(defaultCss);
    setShowEditorView(true);
  };

  // If user clicked "Export," we switch to the Editor screen
  if (showEditorView) {
    return (
      <ExportEditorView
        pageId={String(MOCK_PAGE.id)}
        pageName={MOCK_PAGE.name}
        initialHtml={pageHtml}
        initialCss={pageCss}
        onBack={() => setShowEditorView(false)}
      />
    );
  }

  // Otherwise, render the standard ExportMenu UI
  return (
    <div className="export-menu-container">
      <div className="export-menu-header">
        <div className="export-destination">
          <span>Export your website to:</span>
          <label htmlFor="folderPicker" className="folder-label">
            {folderPath}
          </label>
          <input
            type="file"
            id="folderPicker"
            className="folder-input"
            ref={(input) => {
              if (input) {
                input.setAttribute('webkitdirectory', 'true');
                input.setAttribute('directory', 'true');
              }
            }}
            onChange={onFolderChange}
          />
        </div>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          title="Close"
          ariaLabel="Close"
          className="close-button"
          onClick={onClose}
        />
      </div>

      <div className="export-menu-body">
        <div className="export-left-panel">
          <h3>Select pages to export:</h3>
          {/* Single page for the example */}
          <div className="pages-list">
            <div key={MOCK_PAGE.id} className="page-card">
              <div className="page-thumbnail">
                {MOCK_PAGE.thumbnail ? (
                  <img src={MOCK_PAGE.thumbnail} alt={MOCK_PAGE.name} />
                ) : null}
              </div>
              <div className="page-label">{MOCK_PAGE.name}</div>
              <Checkbox
                checked={selectAll}
                onChange={(_, chk) => handleSelectAll(!!chk)}
              />
            </div>
          </div>
          <div className="pages-footer">
            <Checkbox
              label="Select All Pages:"
              checked={selectAll}
              onChange={(_, chk) => handleSelectAll(!!chk)}
            />
            <div className="pages-count">
              Num Pages: {selectAll ? '1/1' : '0/1'}
            </div>
          </div>
        </div>

        <div className="export-divider" />

        <div className="export-right-panel">
          <div className="export-stats">
            <div className="stat-line">
              <span>Total Size:</span> <span>{totalSize} MB</span>
            </div>
            <div className="stat-line">
              <span>Number of Files:</span> <span>{numberOfFiles}</span>
            </div>
            <div className="stat-line">
              <span>Lines of Code:</span> <span>{linesOfCode}</span>
            </div>
            <hr />
            <div className="stat-line">
              <span>Time To Export:</span> <span>{timeToExport} seconds</span>
            </div>
          </div>

          <PrimaryButton
            className="export-button"
            text="Export"
            disabled={!selectAll}
            onClick={handleExport}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportMenu;
