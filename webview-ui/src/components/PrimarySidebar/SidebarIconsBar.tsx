import React from 'react';
import { IconButton, TooltipHost, DirectionalHint } from '@fluentui/react';
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
    fontSize: 30, // bigger icons
  },
};

export const SidebarIconsBar: React.FC<SidebarIconsBarProps> = ({
  activeTab,
  onTabClick,
  onActionClick,
}) => {
  return (
    <div className="icon-bar-container">
      {/* Tab icons */}
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
            >
              {/* We wrap the IconButton in .icon-container so only the icon scales on hover */}
              <div className="icon-container">
                <IconButton
                  iconProps={{ iconName: tab.icon, styles: biggerIconStyles }}
                  title={tab.title}
                  ariaLabel={tab.title}
                  onClick={() => onTabClick(tab.key)}
                />
              </div>
            </div>
          </TooltipHost>
        );
      })}

      {/* Double-line separator */}
      <div className="double-separator">
        <div className="line1"></div>
        <div className="line2"></div>
      </div>

      {/* Bottom actions */}
      {actions.map((act) => (
        <TooltipHost
          key={act.key}
          content={act.title}
          directionalHint={DirectionalHint.rightCenter}
        >
          <div className="sidebar-item">
            <div className="icon-container">
              <IconButton
                iconProps={{ iconName: act.icon, styles: biggerIconStyles }}
                title={act.title}
                ariaLabel={act.title}
                onClick={() => onActionClick(act.key)}
              />
            </div>
          </div>
        </TooltipHost>
      ))}
    </div>
  );
};
