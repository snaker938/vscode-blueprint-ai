import React, { useState, useMemo } from 'react';
import { useEditor } from '@craftjs/core';
import { Checkbox, PrimaryButton, IconButton } from '@fluentui/react';
import { getGlobalPages } from '../PrimarySidebar/PagesTab/pageStore'; // Adjust path if needed
import './ExportMenu.css';

interface ExportMenuProps {
  onClose: () => void;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ onClose }) => {
  const pages = getGlobalPages();
  const [folderPath, setFolderPath] = useState('Choose folder');
  const [selectedPages, setSelectedPages] = useState<number[]>(
    pages.map((p) => p.id)
  );
  const [selectAll, setSelectAll] = useState(true);

  const handleTogglePage = (id: number) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(selectedPages.filter((pid) => pid !== id));
      setSelectAll(false);
    } else {
      const newSelected = [...selectedPages, id];
      setSelectedPages(newSelected);
      if (newSelected.length === pages.length) setSelectAll(true);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    setSelectedPages(checked ? pages.map((p) => p.id) : []);
  };

  const { nodes } = useEditor((state) => ({ nodes: state.nodes }));
  const nodeCount = Object.keys(nodes).length;

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
    setFolderPath(e.target.files[0].webkitRelativePath || 'Selected folder');
  };

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
          <div className="pages-list">
            {pages.map((page) => (
              <div key={page.id} className="page-card">
                <div className="page-thumbnail">
                  {page.thumbnail ? (
                    <img src={page.thumbnail} alt={page.name} />
                  ) : null}
                </div>
                <div className="page-label">{page.name}</div>
                <Checkbox
                  checked={selectedPages.includes(page.id)}
                  onChange={() => handleTogglePage(page.id)}
                />
              </div>
            ))}
          </div>
          <div className="pages-footer">
            <Checkbox
              label="Select All Pages:"
              checked={selectAll}
              onChange={(_, chk) => handleSelectAll(!!chk)}
            />
            <div className="pages-count">
              Num Pages: {selectedPages.length}/{pages.length}
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
          <PrimaryButton className="export-button" text="Export" />
        </div>
      </div>
    </div>
  );
};

export default ExportMenu;
