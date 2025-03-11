import React from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { Text as CraftText } from '../../components/UserComponents/Text';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

import './MainInterface.css';
import { Heading } from '../../components/UserComponents/Heading';
import { Grid } from '../../components/UserComponents/Grid';
import { Row } from '../../components/UserComponents/Row';
import { Section } from '../../components/UserComponents/Section';
import { TextBox } from '../../components/UserComponents/Textbox';
import { Icon } from '../../components/UserComponents/Icon';
import { Button } from '../../components/UserComponents/Button';

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

/**
 * The core Canvas area, with a root Container + sample text.
 */
export const DroppableCanvas: React.FC = () => {
  return (
    <Frame>
      <Element
        is={Container}
        canvas
        custom={{ isRootContainer: true }}
        width="800px"
        height="1235px"
        background="#ffffff"
        padding={[20, 20, 20, 20]}
      >
        <CraftText
          text="Welcome! Drag components from the left!"
          fontSize={22}
        />
      </Element>
    </Frame>
  );
};

const MainInterface: React.FC = () => {
  return (
    <Editor
      resolver={{
        Container,
        Text: CraftText,
        Heading,
        Grid,
        Row,
        Section,
        TextBox,
        Icon,
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
