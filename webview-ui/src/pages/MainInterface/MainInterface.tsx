import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

import { getPageById, getSuggestedPages } from '../../store/store';

import { parseAiOutput } from '../../components/CreateWithImagination/ExtraComponents/SelectedFeature/utils/AiParser';

import './MainInterface.css';
import { Button } from '../../components/UserComponents/Button';
import { Container } from '../../components/UserComponents/Container';
import { Text } from '../../components/UserComponents/Text';
import { Navigation } from '../../components/UserComponents/Navigation';
import { Video } from '../../components/UserComponents/Video';
import { StarRating } from '../../components/UserComponents/StarRating';
import { SearchBox } from '../../components/UserComponents/SearchBox';
import { Slider } from '../../components/UserComponents/Slider';
import { Image } from '../../components/UserComponents/Image';

// Example modal component import
// Adjust this import path depending on your actual file structure
import SuggestedPages from '../../components/SuggestedPages/SuggestedPages';

/**
 * A wrapper that detects clicks on empty canvas space to unselect all nodes.
 */
const CanvasBorderWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { actions } = useEditor();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Unselect if user clicked the wrapper itself
    if (e.target === e.currentTarget) {
      actions.selectNode([]);
    }
  };

  return (
    <div
      id="droppable-canvas-border"
      className="canvas-border-wrapper"
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

/**
 * A canvas component that optionally loads parsed layout data into the Frame.
 */
export const DroppableCanvas: React.FC<{ initialData?: any }> = ({
  initialData,
}) => {
  return (
    <Frame data={initialData}>
      {/* 
        Root Container (marked with custom={{ isRootContainer: true }} 
        to signal special styling rules for your design).
      */}
      <Element
        is={Container}
        canvas
        custom={{ isRootContainer: true }}
        width="800px"
        height="1235px"
        background="#ffffff"
        margin={[0, 0, 0, 0]}
        padding={[20, 20, 20, 20]}
      >
        {/* Example: a top nav bar could go here */}
      </Element>
    </Frame>
  );
};

const MainInterface: React.FC = () => {
  // Local state controlling whether the SuggestedPages modal is open
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false);

  // On component mount, load Page #1’s layout from the store
  // and also check if we have suggested pages
  useEffect(() => {
    const suggested = getSuggestedPages();
    if (suggested && suggested.length > 0) {
      setIsSuggestedOpen(true);
    }
  }, []);

  // Fetch Page #1
  const page1 = getPageById(1);

  // Convert the stored layout into a CraftJS-serialized tree
  let parsedTree = null;
  if (page1 && page1.layout) {
    try {
      parsedTree = parseAiOutput(JSON.stringify(page1.layout));
    } catch (err) {
      console.error('Failed to parse page1 layout:', err);
    }
  }

  return (
    <Editor
      resolver={{
        Container,
        Text,
        Navigation,
        Video,
        StarRating,
        SearchBox,
        Slider,
        Button,
        Image,
      }}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
    >
      <div className="main-interface-container">
        {/* PrimarySidebar on the left */}
        <aside className="sidebar left-sidebar">
          <PrimarySidebar />
        </aside>

        {/* The droppable canvas area */}
        <main className="editor-canvas-area">
          <CanvasBorderWrapper>
            <DroppableCanvas initialData={parsedTree} />
          </CanvasBorderWrapper>
        </main>

        {/* PropertiesSidebar on the right */}
        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>

        {/* Show the SuggestedPages modal if isSuggestedOpen is true */}
        {isSuggestedOpen && (
          <SuggestedPages onClose={() => setIsSuggestedOpen(false)} />
        )}
      </div>
    </Editor>
  );
};

export default MainInterface;
