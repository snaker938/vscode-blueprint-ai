import React from 'react';
import { Editor, Frame, Element } from '@craftjs/core';
import { Container } from '../../components/UserComponents/Container';
import { Text as CraftText } from '../../components/UserComponents/Text';
import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';

import './MainInterface.css';

const CanvasBorderWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return (
    <div id="droppable-canvas-border" className="canvas-border-wrapper">
      {children}
    </div>
  );
};

const DroppableCanvas: React.FC = () => {
  return (
    <Frame>
      <Element
        is={Container}
        canvas
        custom={{ isRootContainer: true }}
        width="800px"
        height="1235px"
        background={{ r: 255, g: 255, b: 255, a: 1 }}
        padding={['20', '20', '20', '20']}
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
      resolver={{ Container, Text: CraftText }}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
      // Removed custom event handlers to rely on our manual hover handling.
    >
      <div className="main-interface-container">
        <aside className="sidebar left-sidebar">
          <PrimarySidebar />
        </aside>

        <main className="editor-canvas-area">
          <CanvasBorderWrapper>
            <DroppableCanvas />
          </CanvasBorderWrapper>
        </main>

        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>
      </div>
    </Editor>
  );
};

export default MainInterface;
