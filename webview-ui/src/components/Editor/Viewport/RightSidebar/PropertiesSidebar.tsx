// webview-ui/src/components/Editor/Viewport/RightSidebar/PropertiesSidebar.tsx
import React from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';
import { ComponentPropertiesBar } from './ComponentPropertiesBar';

const Wrapper = styled.div`
  padding: 16px;
  font-size: 14px;
  color: #333;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 16px;
`;

const DeleteButton = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 6px 12px;
  margin-top: 10px;
  cursor: pointer;
`;

export const PropertiesSidebar: React.FC = () => {
  const { selectedNodeId, componentName, actions } = useEditor(
    (state, query) => {
      const nodeId = query.getEvent('selected').first();
      let name = 'Unknown';
      if (nodeId) {
        const node = state.nodes[nodeId];
        const customName = node?.data?.custom?.displayName;
        name = customName || node?.data?.displayName || 'Component';
      }
      return {
        selectedNodeId: nodeId,
        componentName: name,
      };
    }
  );

  if (!selectedNodeId) return <Wrapper>No element selected.</Wrapper>;

  const handleDelete = () => {
    actions.delete(selectedNodeId);
  };

  return (
    <Wrapper>
      <Title>{componentName} Properties</Title>
      <ComponentPropertiesBar nodeId={selectedNodeId} />
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
    </Wrapper>
  );
};
