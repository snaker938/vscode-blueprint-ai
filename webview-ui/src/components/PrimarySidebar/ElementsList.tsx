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
// If you have actual components for Button, Heading, Textbox, etc.,
// import them here similarly.

import './sidebarStyles.css';
import { Heading } from '../UserComponents/Heading';

/* ------------------ Styled Components ------------------ */
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
 * Only return draggable components for 'container' or 'text'.
 * All other keys return null to avoid large placeholders.
 */
const elementToCreate = (key: string) => {
  switch (key) {
    case 'container':
      return (
        <Container
          width="100%"
          height="auto"
          background="#f9f9f9"
          margin={[10, 10, 10, 10]}
          padding={[20, 20, 20, 20]}
          radius={8}
          shadow={1}
          flexDirection="column"
          fillSpace="no"
          alignItems="center"
          justifyContent="center"
          border={{
            Colour: '#ccc',
            style: 'solid',
            width: 1,
          }}
        >
          <CraftText
            text="A brand new container with all default props!"
            fontSize={16}
            fontWeight="400"
            color={{ r: 0, g: 0, b: 0, a: 1 }}
            shadow={0}
            textAlign="center"
            margin={[0, 0, 0, 0]}
          />
        </Container>
      );
    case 'text':
      return (
        <CraftText
          text="Brand new text element"
          fontSize={14}
          fontWeight="400"
          color={{ r: 0, g: 0, b: 0, a: 1 }}
          shadow={0}
          textAlign="left"
          margin={[0, 0, 0, 0]}
        />
      );
    case 'heading':
      return (
        <Heading
          text="Heading 1"
          level={1}
          color="#333"
          fontSize={32}
          fontWeight="bold"
          textAlign="center"
          margin={[10, 10, 10, 10]}
          padding={[5, 5, 5, 5]}
        />
      );
    default:
      return null;
  }
};

export const ElementsList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const { connectors } = useEditor();

  /* ----- Immutable: Basic Items (Container, Text are draggable) ----- */
  const basicItems = [
    { key: 'container', icon: 'CubeShape', name: 'Container' },
    { key: 'button', icon: 'ButtonControl', name: 'Button' },
    { key: 'heading', icon: 'Header1', name: 'Heading' },
    { key: 'text', icon: 'AlignLeft', name: 'Text' },
    { key: 'textbox', icon: 'TextField', name: 'Textbox' },
    { key: 'icon', icon: 'Emoji2', name: 'Icon' },
    { key: 'link', icon: 'Link', name: 'Link' },
  ];

  // Other category arrays remain, but they'll show up as non-draggable
  const layoutItems = [
    { key: 'row', icon: 'ArrangeBringForward', name: 'Row' },
    { key: 'section', icon: 'GroupedList', name: 'Section' },
    { key: 'grid', icon: 'GridViewSmall', name: 'Grid' },
  ];

  const navigationItems = [
    { key: 'navbar', icon: 'GlobalNavButton', name: 'Navbar' },
    { key: 'sidebar', icon: 'CollapseMenu', name: 'Sidebar' },
  ];

  const mediaItems = [
    { key: 'image', icon: 'FileImage', name: 'Image' },
    { key: 'video', icon: 'Video', name: 'Video' },
    { key: 'audio', icon: 'MusicInCollection', name: 'Audio' },
  ];

  const commonSectionItems = [
    { key: 'heroSection', icon: 'Design', name: 'Hero Section' },
    { key: 'footer', icon: 'AlbumRemove', name: 'Footer' },
    { key: 'callToAction', icon: 'Megaphone', name: 'Call To Action' },
  ];

  const formItems = [
    { key: 'checkbox', icon: 'CheckboxComposite', name: 'Checkbox' },
    { key: 'radioButtons', icon: 'RadioBtnOn', name: 'Radio Buttons' },
    { key: 'dropdown', icon: 'Dropdown', name: 'Dropdown' },
    { key: 'slider', icon: 'Slider', name: 'Slider' },
    { key: 'starRating', icon: 'FavoriteStar', name: 'Star Rating' },
    { key: 'searchBox', icon: 'Search', name: 'Search Box' },
  ];

  const smartItems = [
    { key: 'buttonGroup', icon: 'GroupedList', name: 'Button Group' },
    { key: 'inputBox', icon: 'TextField', name: 'Input Box' },
    { key: 'carousel', icon: 'Slideshow', name: 'Carousel' },
  ];

  const graphItems = [
    { key: 'barChart', icon: 'BarChart4', name: 'Bar Chart' },
    { key: 'pieChart', icon: 'DonutChart', name: 'Pie Chart' },
    { key: 'lineChart', icon: 'LineChart', name: 'Line Chart' },
  ];

  /* ----- Search filtering ----- */
  const filterBySearch = (item: { name: string }) =>
    item.name.toLowerCase().includes(searchText.toLowerCase());

  const filteredBasic = basicItems.filter(filterBySearch);
  const filteredLayout = layoutItems.filter(filterBySearch);
  const filteredNavigation = navigationItems.filter(filterBySearch);
  const filteredMedia = mediaItems.filter(filterBySearch);
  const filteredCommonSections = commonSectionItems.filter(filterBySearch);
  const filteredForm = formItems.filter(filterBySearch);
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

      {/* ----- BASIC ELEMENTS ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Basic Elements
      </FluentText>
      <GridArea>
        {filteredBasic.map((item) => {
          // Only Container/Text will return a valid component:
          const draggableElement = elementToCreate(item.key);
          // It's only draggable if it's Container or Text
          const isDraggable = !!draggableElement;

          return (
            <ElementCard
              key={item.key}
              $draggable={isDraggable}
              ref={
                // Only attach connectors if it's draggable
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
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- LAYOUT ELEMENTS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Layout Elements
      </FluentText>
      <GridArea>
        {filteredLayout.map((item) => (
          <ElementCard key={item.key}>
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>

      <Separator
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- NAVIGATION ELEMENTS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Navigation Elements
      </FluentText>
      <GridArea>
        {filteredNavigation.map((item) => (
          <ElementCard key={item.key}>
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>

      <Separator
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- MEDIA ELEMENTS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Media Elements
      </FluentText>
      <GridArea>
        {filteredMedia.map((item) => (
          <ElementCard key={item.key}>
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>

      <Separator
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- COMMON SECTIONS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Common Sections
      </FluentText>
      <GridArea>
        {filteredCommonSections.map((item) => (
          <ElementCard key={item.key}>
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>

      <Separator
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- FORM ELEMENTS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Form Elements
      </FluentText>
      <GridArea>
        {filteredForm.map((item) => (
          <ElementCard key={item.key}>
            <ElementIcon iconName={item.icon} />
            <ElementName>{item.name}</ElementName>
          </ElementCard>
        ))}
      </GridArea>

      <Separator
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- SMART ELEMENTS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
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
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      />

      {/* ----- GRAPH ELEMENTS (non-draggable) ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
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
