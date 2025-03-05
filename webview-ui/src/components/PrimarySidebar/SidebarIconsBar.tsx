// SidebarIconsBar.tsx
import React, { useState } from 'react';
import {
  IconButton,
  TooltipHost,
  DirectionalHint,
  Modal,
} from '@fluentui/react';
import ExportMenu from '../ExportMenu/ExportMenu'; // Adjust the path as needed
import './sidebarStyles.css';

interface SidebarIconsBarProps {
  activeTab: string | null;
  onTabClick: (key: string) => void;
  onActionClick: (key: string) => void;
}

const tabs = [
  { key: 'components', icon: 'BuildQueue', title: 'Components' },
  { key: 'layout', icon: 'GridViewSmall', title: 'Layout' },
  { key: 'pages', icon: 'Page', title: 'Pages' },
];

const actions = [
  { key: 'undo', icon: 'Undo', title: 'Undo' },
  { key: 'redo', icon: 'Redo', title: 'Redo' },
  { key: 'save', icon: 'Save', title: 'Save' },
  { key: 'import', icon: 'Upload', title: 'Import' },
  { key: 'download', icon: 'Download', title: 'Download' },
  { key: 'export', icon: 'OpenInNewWindow', title: 'Export' },
];

const biggerIconStyles = {
  root: {
    fontSize: 30,
  },
};

export const SidebarIconsBar: React.FC<SidebarIconsBarProps> = ({
  activeTab,
  onTabClick,
  onActionClick,
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleActionClick = (key: string) => {
    onActionClick(key);
    if (key === 'export') {
      setShowExportMenu(true);
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
                        styles: biggerIconStyles,
                      }}
                      title={tab.title}
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

          {actions.map((act) => (
            <TooltipHost
              key={act.key}
              content={act.title}
              directionalHint={DirectionalHint.rightCenter}
            >
              <div
                className="sidebar-item"
                onClick={() => handleActionClick(act.key)}
              >
                <div className="icon-container">
                  <IconButton
                    iconProps={{ iconName: act.icon, styles: biggerIconStyles }}
                    title={act.title}
                    ariaLabel={act.title}
                  />
                </div>
              </div>
            </TooltipHost>
          ))}
        </div>
      </div>

      {/* Modal that shows the ExportMenu when "Export" is clicked */}
      <Modal
        isOpen={showExportMenu}
        onDismiss={() => setShowExportMenu(false)}
        isBlocking={false}
      >
        <ExportMenu onClose={() => setShowExportMenu(false)} />
      </Modal>
    </>
  );
};
