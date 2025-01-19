import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import LeftSidebarUI from './Sidebar';
import ComponentTab from './ComponentsTab';

export const LeftSidebar: React.FC = () => {
  const { actions } = useEditor();
  const [activeTab, setActiveTab] = useState('components');

  const handleTabClick = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleActionClick = (actionKey: string) => {
    if (actionKey === 'undo') {
      actions.history.undo();
    } else if (actionKey === 'redo') {
      actions.history.redo();
    }
    // Other actions do nothing
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <LeftSidebarUI
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onActionClick={handleActionClick}
      />
      <div style={{ flex: 1, background: '#f5f5f5', overflow: 'auto' }}>
        {activeTab === 'components' && <ComponentTab />}
        {activeTab === 'layout' && (
          <div style={{ padding: 20 }}>Layout Tab</div>
        )}
        {activeTab === 'pages' && <div style={{ padding: 20 }}>Pages Tab</div>}
      </div>
    </div>
  );
};

export default LeftSidebar;
