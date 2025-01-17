import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';

import { PropertiesSidebar } from './PropertiesSidebar';
import { BlueprintAiChat } from './BlueprintAiChat';

export const SidebarDiv = styled.div<{ $enabled: boolean }>`
  width: 280px;
  opacity: ${(props) => (props.$enabled ? 1 : 0)};
  background: #fff;
  transition: margin-right 0.3s ease;
  margin-right: ${(props) => (props.$enabled ? 0 : -280)}px;
  border-left: 1px solid #e1e1e1;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  background: #f3f3f3;
  border-bottom: 1px solid #ccc;
`;

const SwitchButton = styled.button`
  background: #5c2d91;
  color: #fff;
  border: none;
  padding: 6px 10px;
  margin-left: 8px;
  cursor: pointer;
`;

export const Sidebar: React.FC = () => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  // Toggling between "properties" and "blueprint ai"
  const [showAi, setShowAi] = useState(false);

  return (
    <SidebarDiv $enabled={enabled}>
      <TopBar>
        <SwitchButton onClick={() => setShowAi(false)}>Props</SwitchButton>
        <SwitchButton onClick={() => setShowAi(true)}>
          Blueprint AI
        </SwitchButton>
      </TopBar>
      {showAi ? <BlueprintAiChat /> : <PropertiesSidebar />}
    </SidebarDiv>
  );
};
