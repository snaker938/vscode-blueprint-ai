import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import {
  IconButton,
  TooltipHost,
  DirectionalHint,
  Modal,
  PrimaryButton,
  DefaultButton,
  TextField,
} from '@fluentui/react';
import { SaveModal } from './SaveModal';
import ExportMenu from '../ExportMenu/ExportMenu';
import './sidebarStyles.css';

interface SidebarIconsBarProps {
  activeTab: string | null;
  onTabClick: (key: string) => void;
  onActionClick?: (key: string) => void;
}

const tabs = [
  { key: 'components', icon: 'BuildQueue', title: 'Components' },
  { key: 'layout', icon: 'GridViewSmall', title: 'Layout' },
  { key: 'pages', icon: 'Page', title: 'Pages' },
];

const sidebarActions: { key: string; icon: string; title: string }[] = [
  { key: 'undo', icon: 'Undo', title: 'Undo' },
  { key: 'redo', icon: 'Redo', title: 'Redo' },
  { key: 'save', icon: 'Save', title: 'Save' },
  { key: 'import', icon: 'Upload', title: 'Import' },
  { key: 'download', icon: 'Download', title: 'Download' },
  { key: 'export', icon: 'OpenInNewWindow', title: 'Export' },
];

const getIconStyles = (disabled: boolean) => ({
  root: {
    fontSize: 30,
    color: disabled ? 'gray' : 'inherit',
  },
});

const ImportModal: React.FC<{
  onClose: () => void;
  onImport: (data: string) => void;
}> = ({ onClose, onImport }) => {
  const [jsonText, setJsonText] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const fileContent = evt.target?.result as string;
      setJsonText(fileContent);
    };
    reader.readAsText(file);
  };

  const handleImportClick = () => {
    if (jsonText.trim()) {
      onImport(jsonText.trim());
    }
    onClose();
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Import JSON</h2>
      <p>You can paste JSON text or upload a .json file.</p>
      <TextField
        label="Paste JSON here"
        multiline
        rows={6}
        value={jsonText}
        onChange={(_, newValue) => setJsonText(newValue || '')}
        style={{ marginBottom: '20px' }}
      />
      <input type="file" accept=".json" onChange={handleFileChange} />
      <div style={{ marginTop: '20px' }}>
        <PrimaryButton
          style={{ marginRight: '10px' }}
          onClick={handleImportClick}
        >
          Import
        </PrimaryButton>
        <DefaultButton onClick={onClose}>Cancel</DefaultButton>
      </div>
    </div>
  );
};

export const SidebarIconsBar: React.FC<SidebarIconsBarProps> = ({
  activeTab,
  onTabClick,
  onActionClick,
}) => {
  const { actions, query, canUndo, canRedo } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const handleActionClick = (key: string) => {
    if (onActionClick) {
      onActionClick(key);
    }
    switch (key) {
      case 'undo':
        actions.history.undo();
        break;
      case 'redo':
        actions.history.redo();
        break;
      case 'save':
        setShowSaveModal(true);
        break;
      case 'import':
        setShowImportModal(true);
        break;
      case 'download':
        handleDownload();
        break;
      case 'export':
        setShowExportMenu(true);
        break;
      default:
        break;
    }
  };

  const handleImportFinish = (importedData: string) => {
    actions.deserialize(importedData);
  };

  const handleDownload = async () => {
    const json = query.serialize();
    if ('showSaveFilePicker' in window) {
      try {
        const opts = {
          suggestedName: 'craftjs_data.json',
          types: [
            {
              description: 'JSON File',
              accept: { 'application/json': ['.json'] },
            },
          ],
        };
        const handle = await (window as any).showSaveFilePicker(opts);
        const writable = await handle.createWritable();
        await writable.write(json);
        await writable.close();
      } catch (err) {
        console.error('Save file was cancelled or failed', err);
      }
    } else {
      const fileName =
        prompt(
          'Enter a file name (including .json extension):',
          'craftjs_data.json'
        ) || 'craftjs_data.json';
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <>
      <div className="icon-bar-container">
        <div className="top-section">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TooltipHost
                key={tab.key}
                content={tab.title}
                directionalHint={DirectionalHint.rightCenter}
              >
                <div
                  className={`sidebar-item ${
                    isActive ? 'sidebar-item-active' : ''
                  }`}
                  onClick={() => onTabClick(tab.key)}
                >
                  <div className="icon-container">
                    <IconButton
                      iconProps={{
                        iconName: tab.icon,
                        styles: { root: { fontSize: 30 } },
                      }}
                      ariaLabel={tab.title}
                    />
                  </div>
                </div>
              </TooltipHost>
            );
          })}
        </div>

        <div className="bottom-section">
          <div className="double-separator">
            <div className="line1"></div>
            <div className="line2"></div>
          </div>

          {sidebarActions.map((act) => {
            let isDimmed = false;
            if (act.key === 'undo') {
              isDimmed = !canUndo;
            } else if (act.key === 'redo') {
              isDimmed = !canRedo;
            }
            return (
              <TooltipHost
                key={act.key}
                content={act.title}
                directionalHint={DirectionalHint.rightCenter}
              >
                <div
                  className="sidebar-item"
                  onClick={() => {
                    if (act.key === 'undo' && !canUndo) return;
                    if (act.key === 'redo' && !canRedo) return;
                    handleActionClick(act.key);
                  }}
                >
                  <div className="icon-container">
                    <IconButton
                      iconProps={{
                        iconName: act.icon,
                        styles: getIconStyles(isDimmed),
                      }}
                      ariaLabel={act.title}
                    />
                  </div>
                </div>
              </TooltipHost>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={showExportMenu}
        onDismiss={() => setShowExportMenu(false)}
        isBlocking={false}
      >
        <ExportMenu onClose={() => setShowExportMenu(false)} />
      </Modal>

      {showSaveModal && (
        <SaveModal isOpen={true} onClose={() => setShowSaveModal(false)} />
      )}

      <Modal
        isOpen={showImportModal}
        onDismiss={() => setShowImportModal(false)}
        isBlocking={false}
      >
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportFinish}
        />
      </Modal>
    </>
  );
};
