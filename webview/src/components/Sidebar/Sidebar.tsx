// webview/src/components/Sidebar/Sidebar.tsx

import React from 'react';
import { Pivot, PivotItem } from '@fluentui/react';
import LayoutTab from './LayoutTab';
import ComponentsTab from './ComponentsTab';
import PagesTab from './PagesTab';
import SettingsTab from './SettingsTab';
import './Sidebar.css'; // Optional: styles for the sidebar

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <Pivot>
        <PivotItem headerText="Layout">
          <LayoutTab />
        </PivotItem>
        <PivotItem headerText="Components">
          <ComponentsTab />
        </PivotItem>
        <PivotItem headerText="Pages">
          <PagesTab />
        </PivotItem>
        <PivotItem headerText="Settings">
          <SettingsTab />
        </PivotItem>
      </Pivot>
    </div>
  );
};

export default Sidebar;
