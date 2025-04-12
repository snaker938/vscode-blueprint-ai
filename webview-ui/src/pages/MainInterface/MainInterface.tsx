// MainInterface.tsx

import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element, Resolver } from '@craftjs/core';
import { Icon } from '@fluentui/react';

import { subscribeSelectedPageChange } from '../../store/store';
import { useBlueprintContext } from '../../store/useBlueprintContext';

import { PrimarySidebar } from '../../components/PrimarySidebar/PrimarySidebar';
import { PropertiesSidebar } from '../../components/PropertiesSidebar/PropertiesSidebar';
import { AiSidebar } from '../../components/AiSidebar/AiSidebar';
import SuggestedPages from '../../components/SuggestedPages/SuggestedPages';

import { RenderNode } from '../../components/UserComponents/Utils/RenderNode';
import { Button } from '../../components/UserComponents/Button';
import { Container } from '../../components/UserComponents/Container';
import { Text } from '../../components/UserComponents/Text';
import { Navigation } from '../../components/UserComponents/Navigation';
import { Video } from '../../components/UserComponents/Video';
import { StarRating } from '../../components/UserComponents/StarRating';
import { SearchBox } from '../../components/UserComponents/SearchBox';
import { Slider } from '../../components/UserComponents/Slider';
import { Image } from '../../components/UserComponents/Image';

import { AiImagesModal } from './Components/AiImagesModal';
import { CanvasBorderWrapper } from './Components/CanvasBorderWrapper';

import './MainInterface.css';

/**
 * A component that sets up the page’s Frame, with a root Container.
 * If a DynamicBlueprintComponent is available, render it directly.
 */
const DroppableCanvas: React.FC = () => {
  const { DynamicBlueprintComponent } = useBlueprintContext();

  return (
    <Frame>
      <Element
        is={Container}
        canvas
        custom={{ isRootContainer: true }}
        width="800px"
        height="2595px"
        background="#ffffff"
        margin={[0, 0, 0, 0]}
        padding={[20, 20, 20, 20]}
      >
        {DynamicBlueprintComponent && <DynamicBlueprintComponent />}
      </Element>
    </Frame>
  );
};

/**
 * Main editor interface.
 */
const MainInterface: React.FC = () => {
  const { DynamicBlueprintComponent } = useBlueprintContext();
  const [editorKey, setEditorKey] = useState(0);

  // States for the initial AI modal, AI sidebar, and spinner
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeSelectedPageChange(() => {
      reloadEditor();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const reloadEditor = () => {
    setEditorKey((prevKey) => prevKey + 1);
  };

  const handleGenerateImagesYes = () => {
    setIsGenerating(true);
    // Simulate an asynchronous image generation process
    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(false);
    }, 3000);
  };

  const handleGenerateImagesNo = () => {
    setShowModal(false);
  };

  // Build a base resolver with your standard components
  const baseResolver: Resolver = {
    Container,
    Text,
    Navigation,
    Video,
    StarRating,
    SearchBox,
    Slider,
    Button,
    Image,
  };

  // Conditionally add your dynamic component if it exists
  if (DynamicBlueprintComponent) {
    baseResolver.DynamicBlueprintComponent = DynamicBlueprintComponent;
  }

  return (
    <Editor
      key={editorKey}
      resolver={baseResolver}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
    >
      <div
        className={
          'main-interface-container' + (isAiSidebarOpen ? '' : ' ai-closed')
        }
      >
        {/* Left sidebar */}
        <aside className="sidebar left-sidebar">
          <PrimarySidebar />
        </aside>

        {/* AI Sidebar */}
        <div className="ai-sidebar-wrapper">
          {isAiSidebarOpen && (
            <AiSidebar isOpen onClose={() => setIsAiSidebarOpen(false)} />
          )}
        </div>

        {/* Main Canvas Area */}
        <main className="editor-canvas-area">
          <CanvasBorderWrapper>
            <DroppableCanvas />
          </CanvasBorderWrapper>
        </main>

        {/* Right sidebar */}
        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>
      </div>

      {/* Optional AI Images Modal */}
      {showModal && (
        <AiImagesModal
          isOpen={showModal}
          onDismiss={() => setShowModal(false)}
          onYes={handleGenerateImagesYes}
          onNo={handleGenerateImagesNo}
          isGenerating={isGenerating}
        />
      )}

      {/* Suggested Pages Overlay */}
      {isSuggestedOpen && (
        <SuggestedPages onClose={() => setIsSuggestedOpen(false)} />
      )}

      {/* Optional loading overlay */}
      {isGenerating && (
        <div className="loading-overlay">
          <div className="loading-bar"></div>
        </div>
      )}

      {/* Floating AI Button classname: ai-sidebar-icon*/}
      <div
        className="ai-sidebar-icon"
        onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
      >
        <Icon
          iconName="Robot"
          styles={{ root: { fontSize: 24, color: '#fff' } }}
        />
      </div>
    </Editor>
  );
};

export default MainInterface;
