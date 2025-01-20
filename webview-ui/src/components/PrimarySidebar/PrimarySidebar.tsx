import React, { useState } from 'react';
import styled from 'styled-components';
import { SidebarIconsBar } from './SidebarIconsBar';
import { ElementsList } from './ElementsList';

const SidebarContainer = styled.div`
  min-width: 320px;
  height: 100%;
  border-right: 1px solid #e1e1e1;
  display: flex;
`;

const TabContentWrapper = styled.div`
  flex: 1;
  background: #f5f5f5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const EmptyTabView = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-right: 1px solid #e1e1e1;
  padding: 15px;
  overflow-y: auto;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #4b3f72;
`;

export const PrimarySidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('components');

  const onTabClick = (key: string) => setActiveTab(key);
  const onActionClick = (key: string) => {
    console.log('[PrimarySidebar] Action:', key);
  };

  return (
    <SidebarContainer>
      <SidebarIconsBar
        activeTab={activeTab}
        onTabClick={onTabClick}
        onActionClick={onActionClick}
      />
      <TabContentWrapper>
        {activeTab === 'components' && <ElementsList />}
        {activeTab === 'layout' && (
          <EmptyTabView>
            <Title>Layout</Title>
          </EmptyTabView>
        )}
        {activeTab === 'pages' && (
          <EmptyTabView>
            <Title>Pages</Title>
          </EmptyTabView>
        )}
      </TabContentWrapper>
    </SidebarContainer>
  );
};
