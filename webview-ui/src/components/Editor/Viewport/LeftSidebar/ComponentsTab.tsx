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

// Define a local interface for the items
interface ComponentItem {
  key: string;
  icon: string;
  name: string;
  component: React.ElementType;
}

console.log('[ComponentTab] Defining basicElements with Container only.');
const basicElements: ComponentItem[] = [
  {
    key: 'container',
    icon: 'CubeShape',
    name: 'Container',
    component: Container,
  },
];

const ComponentTab: React.FC = () => {
  console.log('[ComponentTab] Entering main ComponentTab function.');

  // Craft.js Editor
  const { connectors } = useEditor((state) => {
    console.log('[ComponentTab] useEditor callback -> state:', state);
    return {};
  });
  console.log('[ComponentTab] Extracted { connectors } from useEditor.');

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');
  console.log('[ComponentTab] Initialized searchQuery = ""');

  // Filter function
  const filterComponents = (items: ComponentItem[]): ComponentItem[] => {
    console.log('[ComponentTab] filterComponents -> items:', items);
    console.log('[ComponentTab] filterComponents -> searchQuery:', searchQuery);
    const result = items.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('[ComponentTab] filterComponents -> result:', result);
    return result;
  };

  // Filter the basicElements
  console.log(
    '[ComponentTab] Filtering basicElements with current searchQuery...'
  );
  const filteredBasic = filterComponents(basicElements);
  console.log('[ComponentTab] filteredBasic =', filteredBasic);

  // Logging final readiness to return
  console.log('[ComponentTab] Ready to render JSX.');

  // Return the main tab JSX
  return (
    <ComponentsTabWrapper>
      {/* Search bar */}
      <div style={{ marginBottom: 20 }}>
        <TextField
          placeholder="Search components..."
          iconProps={{ iconName: 'Search' }}
          value={searchQuery}
          onChange={(_ev, newValue) => {
            console.log(
              '[ComponentTab] TextField onChange -> newValue:',
              newValue
            );
            setSearchQuery(newValue || '');
          }}
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
        {filteredBasic.map((item) => {
          console.log('[ComponentTab] Rendering item:', item);

          // Return the card for each item
          return (
            <ComponentCard
              key={item.key}
              draggable
              ref={(domRef) => {
                console.log(
                  '[ComponentTab] ref callback for item:',
                  item.name,
                  'domRef =',
                  domRef
                );

                // React may call this with null during unmount in strict mode
                if (!domRef) {
                  console.log(
                    '[ComponentTab] domRef is null, ignoring attach for item:',
                    item.name
                  );
                  return;
                }

                console.log(
                  '[ComponentTab] Attaching create connector for item:',
                  item.name
                );
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
          );
        })}
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

console.log('[ComponentTab] About to export default ComponentTab.');
export default ComponentTab;
