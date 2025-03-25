import React from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';
import { useLocation } from 'react-router-dom';

import { parseAiOutput } from '../../components/CreateWithImagination/ExtraComponents/SelectedFeature/utils/AiParser';
import { setSuggestedPages } from '../../components/PrimarySidebar/PagesTab/suggestedPageStore';

import './MainInterface.css';
import { Button } from '../../components/UserComponents/Button';
import { Container } from '../../components/UserComponents/Container';
import { Text } from '../../components/UserComponents/Text';
import { Navigation } from '../../components/UserComponents/Navigation';
import { Video } from '../../components/UserComponents/Video';
import { StarRating } from '../../components/UserComponents/StarRating';
import { SearchBox } from '../../components/UserComponents/SearchBox';
import { Slider } from '../../components/UserComponents/Slider';
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
 * A canvas component that optionally loads parsed AI output into the Frame.
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
  // Extract data passed from the AI route via location.state
  const location = useLocation();
  let rawLayoutJson = location?.state?.layoutJson || '';

  let suggestedPageNames: string[] | string = 'Missing suggestedPageNames';
  let layoutJson: any = {};

  try {
    // 1. Locate the block containing suggestedPageNames via regex.
    //    Looks for: { "suggestedPageNames": [...] }
    const suggestedPagesRegex =
      /\{\s*"suggestedPageNames"\s*:\s*\[[^\]]*\]\s*\}/;

    // 2. Extract that JSON block if found.
    const match = rawLayoutJson.match(suggestedPagesRegex);
    if (match && match[0]) {
      // Parse the object containing suggestedPageNames
      const spnObject = JSON.parse(match[0]);
      if (spnObject?.suggestedPageNames) {
        suggestedPageNames = spnObject.suggestedPageNames;
      }
      // Remove this chunk so the remaining text is clean JSON (for layoutJson)
      rawLayoutJson = rawLayoutJson.replace(suggestedPagesRegex, '');
    }

    // 3. Now parse the remainder as your layoutJson.
    //    Use the "substring" technique to trim everything
    //    before the first '{' and after the last '}'.
    const firstCurlyIndex = rawLayoutJson.indexOf('{');
    const lastCurlyIndex = rawLayoutJson.lastIndexOf('}');
    if (firstCurlyIndex !== -1 && lastCurlyIndex !== -1) {
      const validJsonString = rawLayoutJson.substring(
        firstCurlyIndex,
        lastCurlyIndex + 1
      );
      layoutJson = JSON.parse(validJsonString);
    }
  } catch (err) {
    console.error('Failed to parse layoutJson:', err);
    layoutJson = {};
  }

  console.log('layoutJson:', layoutJson);
  console.log('suggestedPageNames:', suggestedPageNames);

  // Clean up so layoutJson doesn’t keep suggestedPageNames
  delete layoutJson.suggestedPageNames;

  // Convert the raw AI JSON to a CraftJS-serialized tree
  const parsedTree = layoutJson
    ? parseAiOutput(JSON.stringify(layoutJson))
    : null;

  console.log('Parsed CraftJS tree:', parsedTree);

  // If the AI provided suggested pages, store them globally
  if (Array.isArray(suggestedPageNames) && suggestedPageNames.length > 0) {
    setSuggestedPages(suggestedPageNames);
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

        {/* Conditionally render the SuggestedPages if present */}
        {suggestedPageNames && suggestedPageNames.length > 0 && (
          <SuggestedPages
            isOpen={true}
            onClose={() => {
              // implement your close logic if necessary
            }}
          />
        )}
      </div>
    </Editor>
  );
};

export default MainInterface;
