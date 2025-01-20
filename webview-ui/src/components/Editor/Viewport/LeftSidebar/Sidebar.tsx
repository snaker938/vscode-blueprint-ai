import React from 'react';
import {
  Stack,
  IconButton,
  TooltipHost,
  Separator,
  DirectionalHint,
} from '@fluentui/react';

interface SidebarProps {
  activeTab: string;
  onTabClick: (tabKey: string) => void;
  onActionClick: (actionKey: string) => void;
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

const LeftSidebarUI: React.FC<SidebarProps> = ({
  activeTab,
  onTabClick,
  onActionClick,
}) => {
  return (
    <div
      className="sidebar"
      style={{
        width: 60,
        borderRight: '1px solid #ccc',
        height: '100%',
        background: '#ffffff',
      }}
    >
      <Stack
        verticalAlign="space-between"
        styles={{ root: { height: '100%' } }}
      >
        <Stack>
          {tabs.map((tab) => (
            <TooltipHost
              content={tab.title}
              key={tab.key}
              directionalHint={DirectionalHint.rightCenter}
            >
              <IconButton
                iconProps={{ iconName: tab.icon }}
                title={tab.title}
                ariaLabel={tab.title}
                className={`sidebar-button ${
                  activeTab === tab.key ? 'active-tab' : ''
                }`}
                onClick={() => onTabClick(tab.key)}
              />
            </TooltipHost>
          ))}
        </Stack>

        <Stack>
          <Separator style={{ margin: '10px 0' }} />
          {actions.map((action) => (
            <TooltipHost
              content={action.title}
              key={action.key}
              directionalHint={DirectionalHint.rightCenter}
            >
              <IconButton
                iconProps={{ iconName: action.icon }}
                title={action.title}
                ariaLabel={action.title}
                className="sidebar-button"
                onClick={() => onActionClick(action.key)}
              />
            </TooltipHost>
          ))}
        </Stack>
      </Stack>
    </div>
  );
};

export default LeftSidebarUI;
