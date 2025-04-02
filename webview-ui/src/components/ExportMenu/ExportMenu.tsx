import React, { useState, useMemo } from 'react';
import { useEditor } from '@craftjs/core';
import { Checkbox, PrimaryButton, IconButton } from '@fluentui/react';
import { html as beautifyHtml } from 'js-beautify'; // for HTML formatting

// If you have a store for pages, you can import from there.
// For demonstration, we just define a Page type here.
interface Page {
  id: number;
  name: string;
  thumbnail?: string;
}

import ExportEditorView from './ExportEditorView';

import './ExportMenu.css';

interface ExportMenuProps {
  onClose: () => void;
}

/**
 * In a real application, you might pull pages from a Redux store,
 * or craftjs or your own store. Here, we define a single mock page.
 */
const MOCK_PAGE: Page = {
  id: 1,
  name: 'MyPage',
  thumbnail: '',
};

const ExportMenu: React.FC<ExportMenuProps> = ({ onClose }) => {
  /**
   * Local states for folder path, “select all” toggle, etc.
   * Since we only have one page, we can keep it simple.
   */
  const [folderPath, setFolderPath] = useState('Choose folder');
  const [selectAll, setSelectAll] = useState(true);

  /**
   * Craft.js editor info for generating “dummy stats” (optional).
   * In a real app, you could compute actual stats here.
   */
  const { nodes } = useEditor((state) => ({ nodes: state.nodes }));
  const nodeCount = Object.keys(nodes).length;

  // Some made-up numbers for demonstration.
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

  /**
   * Simulates picking a folder in a file input (folder mode).
   */
  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    // Not all browsers fully support webkitdirectory; this is just for demonstration.
    setFolderPath(e.target.files[0].webkitRelativePath || 'Selected folder');
  };

  /**
   * Handle toggling "Select All" pages (though we only have one page).
   */
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
  };

  /**
   * When the user clicks "Export," we want to:
   * 1) Grab the HTML from `#droppable-canvas-border`
   * 2) Beautify/format it
   * 3) Pass that + some initial CSS to `ExportEditorView`.
   */
  const [showEditorView, setShowEditorView] = useState(false);

  // Data to pass to ExportEditorView
  const [pageHtml, setPageHtml] = useState('');
  const [pageCss, setPageCss] = useState('');

  const handleExport = () => {
    const canvasEl = document.getElementById('droppable-canvas-border');
    // Raw HTML from the container
    const rawHtml = canvasEl
      ? canvasEl.outerHTML
      : '<div>No content found</div>';

    // Format the HTML into multiple lines with indentation
    const formattedHtml = beautifyHtml(rawHtml, {
      indent_size: 2,
      preserve_newlines: true,
      // You can adjust other options as you like
    });

    // Provide some default CSS to start with; the actual computed CSS
    // will be gathered by ExportEditorView.
    const defaultCss = `/* Example default CSS for your page. 
   Insert or override as needed. */
body {
  margin: 0;
  padding: 0;
}
`;

    setPageHtml(formattedHtml);
    setPageCss(defaultCss);

    // Show the ExportEditorView
    setShowEditorView(true);
  };

  /**
   * Renders the standard export menu,
   * or the ExportEditorView if "Export" was clicked.
   */
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
          {/* Single page selection for demonstration */}
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
            disabled={!selectAll} // For demonstration, only enable if selected
            onClick={handleExport}
          />
        </div>
      </div>
    </div>
  );
};

export default ExportMenu;
