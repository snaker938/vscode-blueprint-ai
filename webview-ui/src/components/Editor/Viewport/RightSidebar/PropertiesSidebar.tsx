import React from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';

import { ComponentPropertiesBar } from './ComponentPropertiesBar';

const PropertiesContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 16px;
  overflow: auto;
`;

const Title = styled.h2`
  margin: 0 0 10px;
  font-size: 16px;
  color: #333;
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

  if (!selectedNodeId) return null;

  const handleDelete = () => {
    actions.delete(selectedNodeId);
  };

  return (
    <PropertiesContainer>
      <Title>{componentName} Properties</Title>
      {/* The actual property controls: */}
      <ComponentPropertiesBar nodeId={selectedNodeId} />
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
    </PropertiesContainer>
  );
};
