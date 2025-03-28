import React from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

import './MainInterface.css';
import { Button } from '../../components/UserComponents/Button';
import { Container } from '../../components/UserComponents/Container';
import { Text } from '../../components/UserComponents/Text';
import { Navigation } from '../../components/UserComponents/Navigation';
import { Video } from '../../components/UserComponents/Video';
import { StarRating } from '../../components/UserComponents/StarRating';
import { SearchBox } from '../../components/UserComponents/SearchBox';
import { Slider } from '../../components/UserComponents/Slider';

/**
 * A wrapper that detects clicks on empty canvas space to unselect all nodes.
 */
const CanvasBorderWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { actions } = useEditor();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Unselect if user clicked the wrapper itself.
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

export const DroppableCanvas: React.FC = () => {
  return (
    <Frame>
      {/* 
        The root Container: 
        - Marked with custom={{ isRootContainer: true }} to signal special styling rules.
        - Set a large width and height for demonstration (e.g., 800x1235).
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
        {/* 1) Top Navigation Bar */}
      </Element>
    </Frame>
  );
};

const MainInterface: React.FC = () => {
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
            <DroppableCanvas />
          </CanvasBorderWrapper>
        </main>

        {/* PropertiesSidebar on the right */}
        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>
      </div>
    </Editor>
  );
};

export default MainInterface;
