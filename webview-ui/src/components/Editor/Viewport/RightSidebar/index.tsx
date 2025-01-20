// webview-ui/src/components/Editor/Viewport/RightSidebar/index.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';
import { PropertiesSidebar } from './PropertiesSidebar';
import { BlueprintAiChat } from './BlueprintAiChat';

const RightBarWrapper = styled.div<{ $enabled: boolean }>`
  width: 300px;
  border-left: 1px solid #ccc;
  background: #fff;
  transform: translateX(${(p) => (p.$enabled ? 0 : '300px')});
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  background: #eee;
  border-bottom: 1px solid #ccc;
`;

const MainContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const TabButton = styled.button`
  background: #5c2d91;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
`;

export const RightSidebar: React.FC = () => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));
  const [showAi, setShowAi] = useState(false);

  return (
    <RightBarWrapper $enabled={enabled}>
      <TopBar>
        <TabButton onClick={() => setShowAi(false)}>Props</TabButton>
        <TabButton onClick={() => setShowAi(true)}>Blueprint AI</TabButton>
      </TopBar>
      <MainContent>
        {showAi ? <BlueprintAiChat /> : <PropertiesSidebar />}
      </MainContent>
    </RightBarWrapper>
  );
};
