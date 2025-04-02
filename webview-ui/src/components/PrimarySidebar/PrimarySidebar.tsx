import React, { useState } from 'react';
import styled from 'styled-components';
import { SidebarIconsBar } from './SidebarIconsBar';
// import { ElementsList } from './ElementsList';
import PagesTab from './PagesTab/PagesTab';
import './sidebarStyles.css';

import { LayoutTab } from './LayoutTab/LayoutTab';

import { ElementsList } from './ElementsList';

/*
  Use a transient prop named "$isOpen" 
  so it doesn't get passed to the DOM. 
*/
const OuterWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  height: 100%;
  overflow: hidden;
  transition: width 0.3s ease;
  width: ${(p) => (p.$isOpen ? '360px' : '60px')};
`;

const ContentArea = styled.div`
  flex: 1;
  background: #f9f9f9;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

export const PrimarySidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('components');

  const handleTabClick = (tabKey: string) => {
    if (tabKey === activeTab) {
      setActiveTab(null);
    } else {
      setActiveTab(tabKey);
    }
  };

  const handleActionClick = (actionKey: string) => {
    console.log('[PrimarySidebar] action:', actionKey);
  };

  const $isOpen = activeTab !== null;

  return (
    <OuterWrapper $isOpen={$isOpen}>
      {/* The icons bar on the left, no forced width in CSS. 
          It's just as wide as the OuterWrapper if closed, or part of it if open. 
      */}
      <SidebarIconsBar
        activeTab={activeTab}
        onTabClick={handleTabClick}
        onActionClick={handleActionClick}
      />

      {/* If there's an active tab, show the content. Otherwise, none. */}
      {activeTab && (
        <ContentArea>
          {activeTab === 'components' && <ElementsList />}
          {activeTab === 'layout' && <LayoutTab />}
          {activeTab === 'pages' && <PagesTab />}
        </ContentArea>
      )}
    </OuterWrapper>
  );
};
