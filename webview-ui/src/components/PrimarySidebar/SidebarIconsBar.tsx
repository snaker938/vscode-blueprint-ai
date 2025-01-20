import React from 'react';
import {
  Stack,
  IconButton,
  TooltipHost,
  Separator,
  DirectionalHint,
} from '@fluentui/react';

interface Props {
  activeTab: string;
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

export const SidebarIconsBar: React.FC<Props> = ({
  activeTab,
  onTabClick,
  onActionClick,
}) => {
  return (
    <div className="w-[60px] h-full bg-white flex-none">
      <Stack
        verticalAlign="space-between"
        styles={{ root: { height: '100%' } }}
      >
        <Stack>
          {tabs.map((tab) => (
            <TooltipHost
              key={tab.key}
              content={tab.title}
              directionalHint={DirectionalHint.rightCenter}
            >
              <IconButton
                iconProps={{ iconName: tab.icon }}
                title={tab.title}
                ariaLabel={tab.title}
                className={
                  activeTab === tab.key
                    ? 'sidebar-button active-tab'
                    : 'sidebar-button'
                }
                onClick={() => onTabClick(tab.key)}
              />
            </TooltipHost>
          ))}
        </Stack>
        <Stack>
          <Separator style={{ margin: '10px 0' }} />
          {actions.map((act) => (
            <TooltipHost
              key={act.key}
              content={act.title}
              directionalHint={DirectionalHint.rightCenter}
            >
              <IconButton
                iconProps={{ iconName: act.icon }}
                title={act.title}
                ariaLabel={act.title}
                className="sidebar-button"
                onClick={() => onActionClick(act.key)}
              />
            </TooltipHost>
          ))}
        </Stack>
      </Stack>
    </div>
  );
};
