import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { styled } from 'styled-components';
import { TextField, Text, Icon, Separator } from '@fluentui/react';
import { Container } from '../../../UserComponents/Container';

// Debug log to confirm file loaded
console.log('[ComponentTab] File loaded.');

// Styled Components
const ComponentsTabWrapper = styled.div`
  width: 100%;
  max-width: 320px;
  background-color: #f9f9f9;
  border-right: 1px solid #e1e1e1;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const ComponentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
  padding: 10px 0;
`;

const ComponentCard = styled.div`
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #f2f2ff;
    border-color: #4b3f72;
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.15);
    transform: scale(1.05);
  }
`;

const ComponentIcon = styled(Icon)`
  font-size: 28px !important;
  color: #4b3f72;
`;

const ComponentName = styled(Text)`
  margin-top: 5px;
  font-size: 13px !important;
  color: #333333;
  font-weight: 500 !important;
  text-align: center;
`;

// Local interface for each component item
interface ComponentItem {
  key: string;
  icon: string;
  name: string;
  component: React.ElementType;
}

const ComponentTab: React.FC = () => {
  console.log('[ComponentTab] Entering main ComponentTab function.');

  // Craft.js Editor
  const { connectors } = useEditor((state) => {
    console.log('[ComponentTab] useEditor -> state:', state);
    return {};
  });

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Filter function
  const filterComponents = (items: ComponentItem[]): ComponentItem[] => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // ───────────────────────────────────────────
  // KEY CHANGE: Move `basicElements` INSIDE the component
  // ───────────────────────────────────────────
  const basicElements: ComponentItem[] = [
    {
      key: 'container',
      icon: 'CubeShape',
      name: 'Container',
      component: Container,
    },
  ];

  // Filter the basicElements
  const filteredBasic = filterComponents(basicElements);

  // Return the main tab JSX
  return (
    <ComponentsTabWrapper>
      {/* Search bar */}
      <div style={{ marginBottom: 20 }}>
        <TextField
          placeholder="Search components..."
          iconProps={{ iconName: 'Search' }}
          value={searchQuery}
          onChange={(_ev, newValue) => setSearchQuery(newValue || '')}
          styles={{
            fieldGroup: {
              borderRadius: 8,
              backgroundColor: '#ffffff',
            },
          }}
        />
      </div>

      <Text
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Basic Elements
      </Text>

      <ComponentsGrid>
        {filteredBasic.map((item) => (
          <ComponentCard
            key={item.key}
            draggable
            ref={(domRef) => {
              if (!domRef) return; // null in unmount
              connectors.create(domRef, React.createElement(item.component));
            }}
            onDragStart={() => {
              console.log('[ComponentTab] onDragStart -> item:', item.name);
            }}
            onDragEnd={() => {
              console.log('[ComponentTab] onDragEnd -> item:', item.name);
            }}
          >
            <ComponentIcon iconName={item.icon} />
            <ComponentName>{item.name}</ComponentName>
          </ComponentCard>
        ))}
      </ComponentsGrid>

      <Separator
        styles={{
          root: { margin: '15px 0', borderTop: '2px solid #5c2d91' },
        }}
      />

      <Text
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Smart Elements
      </Text>
      <div style={{ padding: '10px 0', color: '#999' }}>
        (No smart elements yet)
      </div>

      <Separator
        styles={{
          root: { margin: '15px 0', borderTop: '2px solid #5c2d91' },
        }}
      />

      <Text
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Graph Elements
      </Text>
      <div style={{ padding: '10px 0', color: '#999' }}>
        (No graph elements yet)
      </div>
    </ComponentsTabWrapper>
  );
};

export default ComponentTab;
