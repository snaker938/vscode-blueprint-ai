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
        <Element
          is={Navigation}
          navType="navbar"
          displayName="Blueprint AI"
          background="#f8f9fa"
          textColor="#333"
          highlightSelected={true}
          collapsible={true}
          expandedWidth="250px"
          collapsedWidth="60px"
          width="200px"
          height="60px"
          margin="0 0 20px 0"
          padding="10px"
        />

        {/* 2) Hero / Introduction Section */}
        <Element
          is={Container}
          layoutType="section"
          background="#f0f0f0"
          padding={[40, 40, 40, 40]}
          shadow={5}
          radius={8}
          margin={[0, 0, 20, 0]}
          border={{
            borderStyle: 'solid',
            borderColor: '#ddd',
            borderWidth: 1,
          }}
        >
          {/* Hero Content: Large Title, Subtitle, Button */}
          <Element
            is={Text}
            renderMode="textbox"
            text="Welcome to Blueprint AI"
            fontSize={32}
            fontWeight="bold"
            textAlign="center"
            textColor="#333333"
            margin={[0, 0, 10, 0]}
            background="transparent"
            borderWidth={0}
          />
          <Element
            is={Text}
            renderMode="textbox"
            text="Build your pages with ease using our drag-and-drop interface!"
            fontSize={18}
            fontWeight="normal"
            textAlign="center"
            textColor="#555555"
            margin={[0, 0, 20, 0]}
            background="transparent"
            borderWidth={0}
          />
          <Element
            is={Button}
            label="Get Started"
            variant="button"
            color="#ffffff"
            background="#007bff"
            radius={6}
            shadow={5}
            padding={[12, 24, 12, 24]}
            onClick={() => alert('Get Started clicked!')}
          />
        </Element>

        {/* 3) Search Section */}
        <Element
          is={Container}
          layoutType="container"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          background="#ffffff"
          padding={[20, 20, 20, 20]}
          margin={[0, 0, 20, 0]}
          shadow={5}
          radius={8}
        >
          <Element
            is={Text}
            renderMode="textbox"
            text="Looking for something?"
            fontSize={16}
            fontWeight="600"
            textAlign="right"
            textColor="#333333"
            margin={[0, 20, 0, 0]}
            background="transparent"
            borderWidth={0}
          />
          <Element
            is={SearchBox}
            placeholder="Search in Blueprint AI..."
            searchText=""
            backgroundColor="#ffffff"
            textColor="#000000"
            borderColor="#cccccc"
            borderRadius={4}
            width="300px"
            shadow={2}
          />
        </Element>

        {/* 4) Features Section (using a row layout to highlight features) */}
        <Element
          is={Container}
          layoutType="row"
          gap={20}
          flexWrap="wrap"
          background="#ffffff"
          padding={[30, 30, 30, 30]}
          margin={[0, 0, 20, 0]}
          shadow={5}
          radius={8}
          border={{
            borderStyle: 'solid',
            borderColor: '#ccc',
            borderWidth: 1,
          }}
        >
          {/* Feature 1 */}
          <Element
            is={Container}
            layoutType="container"
            background="#fafafa"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
            width="220px"
            height="auto"
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Smart Components"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="AI-powered suggestions for optimal design and layout."
              fontSize={14}
              fontWeight="normal"
              textColor="#666"
            />
          </Element>

          {/* Feature 2 */}
          <Element
            is={Container}
            layoutType="container"
            background="#fafafa"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
            width="220px"
            height="auto"
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Flexible Layouts"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="Use rows, grids, sections, and containers to get the perfect arrangement."
              fontSize={14}
              fontWeight="normal"
              textColor="#666"
            />
          </Element>

          {/* Feature 3 */}
          <Element
            is={Container}
            layoutType="container"
            background="#fafafa"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
            width="220px"
            height="auto"
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Developer Friendly"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="Easily integrate custom code or components without friction."
              fontSize={14}
              fontWeight="normal"
              textColor="#666"
            />
          </Element>
        </Element>

        {/* 5) A Grid Section to showcase additional items (e.g., user testimonials, updates, etc.) */}
        <Element
          is={Container}
          layoutType="grid"
          columns={2}
          rows={2}
          rowGap={20}
          columnGap={20}
          background="#ffffff"
          padding={[20, 20, 20, 20]}
          margin={[0, 0, 20, 0]}
          shadow={5}
          radius={8}
        >
          {/* Grid Cell #1 */}
          <Element
            is={Container}
            layoutType="container"
            background="#e9f7ff"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Testimonial 1"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="Blueprint AI revolutionized how I build websites. It's intuitive and powerful!"
              fontSize={14}
              textColor="#333"
            />
            <Element
              is={StarRating}
              rating={5}
              maxRating={5}
              starColor="#FFD700"
              starSpacing={4}
              margin={[10, 0, 0, 0]}
            />
          </Element>

          {/* Grid Cell #2 */}
          <Element
            is={Container}
            layoutType="container"
            background="#fff4e7"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Announcements"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="We just rolled out new components: Buttons, Sliders, and more!"
              fontSize={14}
              textColor="#333"
            />
          </Element>

          {/* Grid Cell #3 */}
          <Element
            is={Container}
            layoutType="container"
            background="#f3ffee"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Feature Spotlight"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="Learn how to use the row and grid layouts like a pro!"
              fontSize={14}
              textColor="#333"
            />
          </Element>

          {/* Grid Cell #4 */}
          <Element
            is={Container}
            layoutType="container"
            background="#fff3f3"
            padding={[20, 20, 20, 20]}
            radius={4}
            shadow={2}
          >
            <Element
              is={Text}
              renderMode="textbox"
              text="Tutorials & Guides"
              fontSize={16}
              fontWeight="bold"
              margin={[0, 0, 5, 0]}
            />
            <Element
              is={Text}
              renderMode="textbox"
              text="Check out our comprehensive guides for building advanced UIs with Blueprint AI."
              fontSize={14}
              textColor="#333"
            />
          </Element>
        </Element>

        {/* 6) Interactive Slider Section */}
        <Element
          is={Container}
          layoutType="container"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          background="#ffffff"
          padding={[20, 20, 20, 20]}
          margin={[0, 0, 20, 0]}
          shadow={5}
          radius={8}
        >
          <Element
            is={Text}
            renderMode="textbox"
            text="Adjust Settings"
            fontSize={18}
            fontWeight="bold"
            textAlign="center"
            textColor="#333333"
            margin={[0, 0, 10, 0]}
          />
          <Element
            is={Slider}
            custom={{
              min: 0,
              max: 100,
              step: 5,
              currentValue: 50,
              orientation: 'horizontal',
              width: '400px',
              height: '40px',
              thumbColor: '#ffffff',
              trackColor: '#0078d4',
              showValue: true,
              valueColor: '#000000',
              valueFontSize: '14px',
            }}
          />
        </Element>

        {/* 7) Footer / Call-to-Action Section */}
        <Element
          is={Container}
          layoutType="section"
          background="#343a40"
          padding={[30, 30, 30, 30]}
          radius={8}
          margin={[0, 0, 0, 0]}
          shadow={5}
        >
          <Element
            is={Text}
            renderMode="textbox"
            text="Ready to build your next project with Blueprint AI?"
            fontSize={20}
            fontWeight="bold"
            textAlign="center"
            textColor="#ffffff"
            margin={[0, 0, 10, 0]}
          />
          <Element
            is={Button}
            label="Contact Us"
            color="#fff"
            background="#28a745"
            radius={6}
            padding={[12, 24, 12, 24]}
            onClick={() => alert('Contact form coming soon!')}
          />
        </Element>
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
