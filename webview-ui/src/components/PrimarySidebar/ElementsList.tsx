import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';
import {
  TextField,
  Text as FluentText,
  Icon as FluentIcon, // Renamed to avoid collision
  Separator,
} from '@fluentui/react';

// import { Button as CraftButton } from '../UserComponents/Button';
// import { ButtonGroup as CraftButtonGroup } from '../UserComponents/ButtonGroup';
// import { CallToAction as CraftCallToAction } from '../UserComponents/CallToAction';
// import { Checkbox as CraftCheckbox } from '../UserComponents/Checkbox';
import { Container as CraftContainer } from '../UserComponents/Container';
// import { Dropdown as CraftDropdown } from '../UserComponents/Dropdown';
// import { Footer as CraftFooter } from '../UserComponents/Footer';
// import { Grid as CraftGrid } from '../UserComponents/Grid';
// import { Heading as CraftHeading } from '../UserComponents/Heading';
// import { HeroSection as CraftHeroSection } from '../UserComponents/HeroSection';
// import { Icon as CraftIcon } from '../UserComponents/Icon';
// import { InputBox as CraftInputBox } from '../UserComponents/InputBox';
// import { Link as CraftLink } from '../UserComponents/Link';
// import { Navbar as CraftNavbar } from '../UserComponents/Navbar';
// import { RadioButtons as CraftRadioButtons } from '../UserComponents/RadioButtons';
// import { Row as CraftRow } from '../UserComponents/Row';
// import { SearchBox as CraftSearchBox } from '../UserComponents/SearchBox';
// import { Section as CraftSection } from '../UserComponents/Section';
// import { Sidebar as CraftSidebar } from '../UserComponents/Sidebar';
// import { Slider as CraftSlider } from '../UserComponents/Slider';
// import { StarRating as CraftStarRating } from '../UserComponents/StarRating';
// import { Text as CraftText } from '../UserComponents/Text';
// import { TextBox as CraftTextbox } from '../UserComponents/Textbox';

import './sidebarStyles.css';
import { Text } from '../UserComponents/Text';
import { Button } from '../UserComponents/Button';
import { Icon } from '../UserComponents/Icon';
import { StarRating } from '../UserComponents/StarRating';

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
        <CraftContainer
          background="#ffffff"
          padding={[0, 0, 0, 0]}
          margin={[0, 0, 0, 0]}
          width="100%"
          height="auto"
        />
      );
    case 'text':
      return <Text />;
    case 'button':
      return <Button />;
    case 'icon':
      return <Icon />;
    case 'starRating':
      return <StarRating />;
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
    { key: 'button', icon: 'ButtonControl', name: 'Button' },
    { key: 'text', icon: 'AlignLeft', name: 'Text' },
    { key: 'icon', icon: 'Emoji2', name: 'Icon' },
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

  const formItems = [
    { key: 'checkbox', icon: 'CheckboxComposite', name: 'Checkbox' },
    { key: 'radioButtons', icon: 'RadioBtnOn', name: 'Radio Button' },
    { key: 'dropdown', icon: 'Dropdown', name: 'Dropdown' },
    { key: 'slider', icon: 'Slider', name: 'Slider' },
    { key: 'starRating', icon: 'FavoriteStar', name: 'Star Rating' },
    { key: 'searchBox', icon: 'Search', name: 'Search Box' },
  ];

  /* ----- Filter by search text ----- */
  const filterBySearch = (item: { name: string }) =>
    item.name.toLowerCase().includes(searchText.toLowerCase());

  const filteredBasic = basicItems.filter(filterBySearch);
  const filteredLayout = layoutItems.filter(filterBySearch);
  const filteredNavigation = navigationItems.filter(filterBySearch);
  const filteredMedia = mediaItems.filter(filterBySearch);
  const filteredForm = formItems.filter(filterBySearch);

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

      {/* ----- NAVIGATION ELEMENTS  ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Navigation Elements
      </FluentText>
      <GridArea>
        {filteredNavigation.map((item) => {
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

      {/* ----- MEDIA ELEMENTS ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Media Elements
      </FluentText>
      <GridArea>
        {filteredMedia.map((item) => {
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

      {/* ----- FORM ELEMENTS ----- */}
      <FluentText
        variant="xLarge"
        styles={{ root: { fontWeight: 700, color: '#4b3f72' } }}
      >
        Form Elements
      </FluentText>
      <GridArea>
        {filteredForm.map((item) => {
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
    </Wrapper>
  );
};
