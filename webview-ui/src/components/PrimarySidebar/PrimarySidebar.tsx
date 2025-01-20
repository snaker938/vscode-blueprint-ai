import React, { useState } from 'react';
import styled from 'styled-components';
import { SidebarIconsBar } from './SidebarIconsBar';
import { ElementsList } from './ElementsList';
import './sidebarStyles.css';

/*
  Use a transient prop named "$isOpen" 
  so it doesn't get passed to the DOM. 
*/
const OuterWrapper = styled.div<{ $isOpen: boolean }>`
  display: flex;
  height: 100%;
  overflow: hidden;
  transition: width 0.3s ease;
  width: ${(p) => (p.$isOpen ? '320px' : '60px')};
`;

const ContentArea = styled.div`
  flex: 1;
  background: #f5f5f5;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const EmptyTabPanel = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-right: 1px solid #e1e1e1;
  padding: 15px;
`;

const TabTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #4b3f72;
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
          {activeTab === 'layout' && (
            <EmptyTabPanel>
              <TabTitle>Layout</TabTitle>
            </EmptyTabPanel>
          )}
          {activeTab === 'pages' && (
            <EmptyTabPanel>
              <TabTitle>Pages</TabTitle>
            </EmptyTabPanel>
          )}
        </ContentArea>
      )}
    </OuterWrapper>
  );
};
