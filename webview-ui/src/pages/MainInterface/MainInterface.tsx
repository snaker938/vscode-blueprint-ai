// MainInterface.tsx

import React, { useEffect, useState } from 'react';
import { Editor, Frame, Element, Resolver } from '@craftjs/core';
import { Icon } from '@fluentui/react';

import {
  subscribeSelectedPageChange,
  getSelectedPage,
  updatePage,
  getSelectedPageId,
} from '../../store/store';
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
 * A helper that returns the CraftJS resolver for "built-ins" plus dynamic
 */
function buildResolver(dynamicComponents: Record<string, React.FC>): Resolver {
  return {
    // built-ins
    Container,
    Text,
    Navigation,
    Video,
    StarRating,
    SearchBox,
    Slider,
    Button,
    Image,
    // dynamic
    ...dynamicComponents,
  };
}

/**
 * Main editor interface.
 */
const MainInterface: React.FC = () => {
  const { customComponents } = useBlueprintContext();
  const [editorKey, setEditorKey] = useState(0);

  // States for the initial AI modal, AI sidebar, and spinner
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false);

  // Hover state for AI icon
  const [isHoveringAiIcon, setIsHoveringAiIcon] = useState(false);

  const selectedPage = getSelectedPage();
  // parse the page layout if it exists, or fallback to {}
  const initialNodes = selectedPage?.layout
    ? JSON.parse(selectedPage.layout)
    : {};

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

  const currentResolver = buildResolver(customComponents);

  // Inline style for the floating AI button, including hover/click animations
  const aiIconStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    // Change color to indicate open/close state
    backgroundColor: isAiSidebarOpen ? '#8b0000' : '#0078d4',
    transition: 'all 0.3s ease',
    // Simple scale-up on hover
    transform: isHoveringAiIcon ? 'scale(1.1)' : 'scale(1.0)',
    boxShadow: isHoveringAiIcon
      ? '0 4px 8px rgba(0, 0, 0, 0.3)'
      : '0 2px 4px rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
  };

  return (
    <Editor
      key={editorKey}
      resolver={currentResolver}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
      // Save to store whenever the user changes anything
      onNodesChange={(query) => {
        const jsonString = query.serialize();
        const pageId = getSelectedPageId();
        updatePage(pageId, { layout: jsonString });
      }}
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
            <Frame data={initialNodes}>
              <Element
                is={Container}
                canvas
                custom={{ isRootContainer: true }}
                width="800px"
                height="2595px"
                background="#ffffff"
                margin={[0, 0, 0, 0]}
                padding={[20, 20, 20, 20]}
              />
            </Frame>
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

      {/* Floating AI Button */}
      <div
        style={aiIconStyle}
        onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
        onMouseEnter={() => setIsHoveringAiIcon(true)}
        onMouseLeave={() => setIsHoveringAiIcon(false)}
      >
        <Icon
          // Change the icon if the sidebar is open or closed
          iconName={isAiSidebarOpen ? 'ChromeClose' : 'Robot'}
          styles={{ root: { fontSize: 24, color: '#fff' } }}
        />
      </div>
    </Editor>
  );
};

export default MainInterface;
