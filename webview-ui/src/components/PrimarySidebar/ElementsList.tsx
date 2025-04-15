import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditor } from '@craftjs/core';
import {
  TextField,
  Text as FluentText,
  Icon as FluentIcon, // Renamed to avoid collision
  Separator,
} from '@fluentui/react';

import { Container as CraftContainer } from '../UserComponents/Container';

import './sidebarStyles.css';
import { Text } from '../UserComponents/Text';
import { Button } from '../UserComponents/Button';
import { Navigation } from '../UserComponents/Navigation';
import { Video } from '../UserComponents/Video';
import { StarRating } from '../UserComponents/StarRating';
import { SearchBox } from '../UserComponents/SearchBox';
import { Slider } from '../UserComponents/Slider';
import { Image } from '../UserComponents/Image';

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
      return <CraftContainer />;
    case 'text':
      return <Text />;
    case 'navigation':
      return <Navigation />;
    case 'searchBox':
      return <SearchBox />;
    case 'starRating':
      return <StarRating />;
    case 'slider':
      return <Slider />;
    case 'video':
      return <Video />;
    case 'button':
      return <Button />;
    case 'image':
      return <Image />;
    default:
      return null;
  }
};

export const ElementsList: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const { connectors } = useEditor();

  /* ----- SMART ITEMS (Container, Button, Text, Heading, etc.) ----- */
  const smartItems = [
    { key: 'container', icon: 'CubeShape', name: 'Container' },
    { key: 'text', icon: 'AlignLeft', name: 'Text' },
    { key: 'navigation', icon: 'NavigateForward', name: 'Navigation' },
    { key: 'button', icon: 'ButtonControl', name: 'Button' },
  ];

  // const mediaItems = [
  //   { key: 'image', icon: 'FileImage', name: 'Image' },
  //   { key: 'video', icon: 'Video', name: 'Video' },
  // ];

  const formItems = [
    { key: 'slider', icon: 'Slider', name: 'Slider' },
    { key: 'starRating', icon: 'FavoriteStar', name: 'Star Rating' },
    { key: 'searchBox', icon: 'Search', name: 'Search Box' },
  ];

  /* ----- Filter by search text ----- */
  const filterBySearch = (item: { name: string }) =>
    item.name.toLowerCase().includes(searchText.toLowerCase());

  const filteredSmart = smartItems.filter(filterBySearch);

  // const filteredMedia = mediaItems.filter(filterBySearch);
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
        Smart Elements
      </FluentText>
      <GridArea>
        {filteredSmart.map((item) => {
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

      {/* <Separator
        styles={{ root: { margin: '15px 0', borderTop: '2px solid #5c2d91' } }}
      /> */}

      {/* ----- MEDIA ELEMENTS -----
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
      </GridArea> */}

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
