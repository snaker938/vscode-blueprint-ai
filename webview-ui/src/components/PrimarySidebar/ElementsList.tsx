import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';
import {
  TextField,
  Text as FluentText,
  Icon as FluentIcon, // Renamed to avoid collision
  Separator,
} from '@fluentui/react';

import { Container } from '../UserComponents/Container';
import { Text as CraftText } from '../UserComponents/Text';
import { Heading as CraftHeading } from '../UserComponents/Heading';
import { Grid as CraftGrid } from '../UserComponents/Grid';
import { Row as CraftRow } from '../UserComponents/Row';
import { Section as CraftSection } from '../UserComponents/Section';
import { TextBox } from '../UserComponents/Textbox';
import { Icon as CraftIcon } from '../UserComponents/Icon';
import { Button as CraftButton } from '../UserComponents/Button'; // <-- Import your custom Button component
import { Link as CraftLink } from '../UserComponents/Link';

import './sidebarStyles.css';

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

const ElementIcon = styled(FluentIcon)`
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
 * Returns the actual React component that should be created/draggable
 * based on a given "key" from our items array.
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
            text="A brand new container with default props!"
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
        <CraftHeading
          text="New Heading Element"
          level={1}
          color="#333"
          fontSize={32}
          fontWeight="bold"
          textAlign="center"
          margin={[10, 10, 10, 10]}
          padding={[5, 5, 5, 5]}
        />
      );

    case 'grid':
      return (
        <CraftGrid
          rows={2}
          columns={2}
          margin={[10, 10, 10, 10]}
          padding={[10, 10, 10, 10]}
        />
      );

    case 'row':
      return (
        <CraftRow
          background="#f0f0f0"
          margin={[10, 10, 10, 10]}
          padding={[10, 10, 10, 10]}
          shadow={0}
          radius={4}
          gap={8}
          fillSpace="no"
          alignItems="center"
          justifyContent="center"
          border={{
            colour: '#ccc',
            style: 'solid',
            width: 1,
          }}
        >
          <CraftText
            text="A brand new Row with default props!"
            fontSize={16}
            fontWeight="400"
            color={{ r: 0, g: 0, b: 0, a: 1 }}
            shadow={0}
            textAlign="center"
            margin={[0, 0, 0, 0]}
          />
        </CraftRow>
      );

    case 'section':
      return (
        <CraftSection
          background="#f9f9f9"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          fillSpace="no"
          width="100%"
          height="auto"
          margin={[10, 10, 10, 10]}
          padding={[20, 20, 20, 20]}
          shadow={1}
          radius={8}
          border={{
            Colour: '#ccc',
            style: 'solid',
            width: 1,
          }}
        >
          <CraftText
            text="A brand new Section with default props!"
            fontSize={16}
            fontWeight="400"
            color={{ r: 0, g: 0, b: 0, a: 1 }}
            shadow={0}
            textAlign="center"
            margin={[0, 0, 0, 0]}
          />
        </CraftSection>
      );

    case 'textbox':
      return (
        <TextBox
          text="New TextBox"
          placeholder="Type here..."
          fontSize={14}
          fontFamily="Arial"
          color="#000000"
          background="#ffffff"
          multiline={false}
          disabled={false}
          readOnly={false}
          margin={[0, 0, 0, 0]}
          padding={[5, 5, 5, 5]}
          radius={4}
          shadow={0}
          borderColor="#ccc"
          borderStyle="solid"
          borderWidth={1}
          width="200px"
          height="40px"
        />
      );

    case 'icon':
      return (
        <CraftIcon
          iconName="AiFillSmile"
          size={24}
          color="#000000"
          margin={[0, 0, 0, 0]}
          padding={[0, 0, 0, 0]}
        />
      );

    /* --------------------------------------
     *  New Button case
     * -------------------------------------- */
    case 'button':
      return (
        <CraftButton
          text="Button"
          /* 
            Note: These props must match 
            your Button's prop definitions 
            (IButtonProps / ButtonComponentProps).
          */
          background={{ r: 0, g: 120, b: 212, a: 1 }} // e.g. #0078D4
          color={{ r: 255, g: 255, b: 255, a: 1 }}
          buttonStyle="full"
          margin={[10, 10, 10, 10]}
        />
      );
    case 'link':
      return (
        <CraftLink
          text="Click Here"
          href="#"
          target="_blank"
          color="#0078D4"
          background="transparent"
          margin={[5, 5, 5, 5]}
          padding={[10, 10, 10, 10]}
          radius={4}
          shadow={2}
          width="auto"
          height="auto"
          borderWidth={1}
          borderStyle="solid"
          borderColor="#ccc"
        />
      );

    default:
      return null;
  }
};

export const ElementsList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const { connectors } = useEditor();

  /* ----- BASIC ITEMS (Container, Button, Text, Heading, etc.) ----- */
  const basicItems = [
    { key: 'container', icon: 'CubeShape', name: 'Container' },
    { key: 'button', icon: 'ButtonControl', name: 'Button' }, // <--- Added here
    { key: 'heading', icon: 'Header1', name: 'Heading' },
    { key: 'text', icon: 'AlignLeft', name: 'Text' },
    { key: 'textbox', icon: 'TextField', name: 'Textbox' },
    { key: 'icon', icon: 'Emoji2', name: 'Icon' },
    { key: 'link', icon: 'Link', name: 'Link' },
  ];

  /* ----- LAYOUT ITEMS (Row, Section, Grid) ----- */
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

  /* ----- Filter by search text ----- */
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
                        // Connect the element to Craft for drag creation
                        connectors.create(ref, draggableElement!);
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

      {/* ----- LAYOUT ELEMENTS ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Layout Elements
      </FluentText>
      <GridArea>
        {filteredLayout.map((item) => {
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
                        connectors.create(ref, draggableElement!);
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
