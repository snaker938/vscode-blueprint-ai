// webview-ui/src/components/PrimarySidebar/ElementsList.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor, Element } from '@craftjs/core';
import { TextField, Text, Icon, Separator } from '@fluentui/react';
import { Container } from '../UserComponents/Container';
import './sidebarStyles.css';

const Wrapper = styled.div`
  flex: 1;
  background-color: #f9f9f9;
  border-right: 1px solid #e1e1e1;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const GridArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 15px;
  padding: 10px 0;
`;

const ElementCard = styled.div`
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

const ElementIcon = styled(Icon)`
  font-size: 28px !important;
  color: #4b3f72;
`;

const ElementName = styled(Text)`
  margin-top: 5px;
  font-size: 13px !important;
  color: #333333;
  font-weight: 500 !important;
  text-align: center;
`;

export const ElementsList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const { connectors } = useEditor();

  const basicItems = [
    { key: 'container', icon: 'CubeShape', name: 'Container' },
  ];

  const filtered = basicItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Wrapper>
      <div style={{ marginBottom: 20 }}>
        <TextField
          placeholder="Search components..."
          iconProps={{ iconName: 'Search' }}
          value={searchText}
          onChange={(_, val) => setSearchText(val || '')}
          styles={{
            fieldGroup: { borderRadius: 8, backgroundColor: '#ffffff' },
          }}
        />
      </div>

      <Text
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Basic Elements
      </Text>

      <GridArea>
        {filtered.map((item) => (
          <ElementCard
            key={item.key}
            ref={(ref) => {
              if (!ref) return;
              if (item.key === 'container') {
                connectors.create(
                  ref,
                  <Element
                    canvas
                    is={Container}
                    width="800px"
                    height="auto"
                    background={{ r: 255, g: 255, b: 255, a: 1 }}
                    padding={['40', '40', '40', '40']}
                    custom={{ displayName: 'App' }}
                  >
                    {' '}
                  </Element>
                );
              }
            }}
          >
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>

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
    </Wrapper>
  );
};
