// webview-ui/src/components/PrimarySidebar/ElementsList.tsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';
import {
  TextField,
  Text as FluentText,
  Icon,
  Separator,
} from '@fluentui/react';
import { Container } from '../UserComponents/Container';
import { Text as CraftText } from '../UserComponents/Text';
import './sidebarStyles.css';

// ----- Styled Components -----
const Wrapper = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const GridArea = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  padding: 10px 0;
`;

const ElementCard = styled.div<{ $draggable?: boolean }>`
  width: 100%;
  height: 80px;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.$draggable ? 'move' : 'pointer')};
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

const ElementName = styled(FluentText)`
  margin-top: 5px;
  font-size: 13px !important;
  color: #333333;
  font-weight: 500 !important;
  text-align: center;
`;

/**
 * Return a React element corresponding to the given key,
 * or null if it's not something we want to create.
 */
const elementToCreate = (key: string) => {
  switch (key) {
    case 'container':
      return (
        <Container
          background={{ r: 147, g: 148, b: 158, a: 1 }}
          padding={['40', '40', '40', '40']}
        >
          + <CraftText text="Inside new container" fontSize={14} />+{' '}
        </Container>
      );
    case 'text':
      return <CraftText text="I'm brand new text" fontSize={14} />;
    default:
      return null;
  }
};

export const ElementsList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const { connectors } = useEditor();

  // Note: added a "text" item so it is also draggable
  const basicItems = [
    { key: 'container', icon: 'CubeShape', name: 'Container' },
    { key: 'text', icon: 'AlignLeft', name: 'Text' },
    { key: 'button', icon: 'ButtonControl', name: 'Button' },
    { key: 'heading', icon: 'Header1', name: 'Heading' },
    { key: 'textbox', icon: 'TextField', name: 'Textbox' },
    { key: 'icon', icon: 'Emoji2', name: 'Icon' },
    { key: 'link', icon: 'Link', name: 'Link' },
  ];

  const smartItems = [
    { key: 'buttonGroup', icon: 'GroupedList', name: 'Button Group' },
    { key: 'inputBox', icon: 'TextField', name: 'Input Box' },
    { key: 'dropdown', icon: 'Dropdown', name: 'Dropdown' },
    { key: 'checkbox', icon: 'CheckboxComposite', name: 'Checkbox' },
    { key: 'radioButtons', icon: 'RadioBtnOn', name: 'Radio Buttons' },
    { key: 'slider', icon: 'Slider', name: 'Slider' },
    { key: 'starRating', icon: 'FavoriteStar', name: 'Star Rating' },
    { key: 'searchBox', icon: 'Search', name: 'Search Box' },
  ];

  const graphItems = [
    { key: 'barChart', icon: 'BarChart4', name: 'Bar Chart' },
    { key: 'pieChart', icon: 'DonutChart', name: 'Pie Chart' },
    { key: 'lineChart', icon: 'LineChart', name: 'Line Chart' },
  ];

  // Filter items by the search text
  const filterBySearch = (item: { name: string }) =>
    item.name.toLowerCase().includes(searchText.toLowerCase());

  const filteredBasic = basicItems.filter(filterBySearch);
  const filteredSmart = smartItems.filter(filterBySearch);
  const filteredGraph = graphItems.filter(filterBySearch);

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

      <FluentText
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Basic Elements
      </FluentText>
      <GridArea>
        {filteredBasic.map((item) => {
          // Decide if this is one of our draggable items (container/text)
          const draggableElement = elementToCreate(item.key);
          const isDraggable = !!draggableElement;

          return (
            <ElementCard
              key={item.key}
              $draggable={isDraggable}
              ref={
                isDraggable
                  ? (ref) => {
                      if (ref) {
                        connectors.create(
                          ref,
                          draggableElement as React.ReactElement
                        );
                      }
                    }
                  : undefined
              }
            >
              <ElementIcon iconName={item.icon} />
              <ElementName>{item.name}</ElementName>
            </ElementCard>
          );
        })}
      </GridArea>

      <Separator
        styles={{
          root: { margin: '15px 0', borderTop: '2px solid #5c2d91' },
        }}
      />

      <FluentText
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Smart Elements
      </FluentText>
      <GridArea>
        {filteredSmart.map((item) => (
          <ElementCard key={item.key}>
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

      <FluentText
        variant="xLarge"
        styles={{ root: { color: '#4b3f72', fontWeight: 700 } }}
      >
        Graph Elements
      </FluentText>
      <GridArea>
        {filteredGraph.map((item) => (
          <ElementCard key={item.key}>
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>
    </Wrapper>
  );
};
