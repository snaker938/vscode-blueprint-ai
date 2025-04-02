import React, { useState } from 'react';
import { Editor, Frame, Element, useEditor } from '@craftjs/core';
import { Icon, Modal, Spinner } from '@fluentui/react';

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

import AmazonHomeNoImages from '../../components/DemoPages/Amazon/no-images';
import AmazonHomeYesImages from '../../components/DemoPages/Amazon/yes-images';

import ChangedHome from '../../components/DemoPages/Amazon/changed-home';

import './MainInterface.css';

/**
 * A small wrapper so clicking white-space on the canvas
 * deselects all currently selected nodes.
 */
const CanvasBorderWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const { actions } = useEditor();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
 * A component that sets up the initial demo page within a frame.
 */
export const DroppableCanvas: React.FC<{
  isUsingYesImages: boolean;
  SelectedPageComponent: React.ElementType;
}> = ({ isUsingYesImages, SelectedPageComponent }) => {
  return (
    <Frame key={isUsingYesImages ? 'withImages' : 'noImages'}>
      <Element
        is={Container}
        canvas
        custom={{ isRootContainer: true }}
        width="800px"
        height="3065px"
        background="#ffffff"
        margin={[0, 0, 0, 0]}
        padding={[20, 20, 20, 20]}
      >
        <SelectedPageComponent />
      </Element>
    </Frame>
  );
};

/**
 * Simple modal that asks the user if they'd like to generate images via AI.
 */
const AiImagesModal: React.FC<{
  onYes: () => void;
  onNo: () => void;
  isGenerating: boolean;
}> = ({ onYes, onNo, isGenerating }) => {
  return (
    <Modal
      isOpen
      onDismiss={onNo}
      isBlocking
      styles={{
        main: {
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '450px',
          margin: 'auto',
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Icon
            iconName="Image"
            styles={{ root: { fontSize: 36, color: '#0078d4' } }}
          />
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
            Load AI Images
          </h2>
        </div>
        {!isGenerating ? (
          <>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1rem',
                color: '#605e5c',
              }}
            >
              Would you like to load images using AI? This may take a few
              seconds.
            </p>
            <div
              style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}
            >
              <button
                onClick={onYes}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#0078d4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Yes
              </button>
              <button
                onClick={onNo}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f2f1',
                  color: '#323130',
                  border: '1px solid #c8c6c4',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Spinner label="Generating images... Please wait." />
          </div>
        )}
      </div>
    </Modal>
  );
};

/**
 * Main editor interface component.
 */
const MainInterface: React.FC = () => {
  // Demo page references
  const PageNoImages: React.ElementType = AmazonHomeNoImages;
  const PageYesImages: React.ElementType = AmazonHomeYesImages;

  // State
  const [isUsingYesImages, setIsUsingYesImages] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [showAcceptChanges, setShowAcceptChanges] = useState(false);
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false);

  // Determine which page to show
  const SelectedPageComponent = isUsingYesImages ? PageYesImages : PageNoImages;

  // Modal button handlers
  const handleGenerateImagesYes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setIsUsingYesImages(true);
      setShowModal(false);
    }, 3000);
  };

  const handleGenerateImagesNo = () => {
    setShowModal(false);
  };

  // AI generation logic
  const handleAiGenerate = () => {
    console.log('Generate Clicked');
    setShowAcceptChanges(true);
  };

  const handleAcceptChanges = () => {
    console.log('Changes accepted!');
    setShowAcceptChanges(false);
  };

  const handleRejectChanges = () => {
    console.log('Changes rejected or closed');
    setShowAcceptChanges(false);
  };

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
        AmazonHomeNoImages,
        AmazonHomeYesImages,
      }}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
    >
      {/* Main Interface Layout */}
      {/*
        Add "ai-closed" class if the AI sidebar is NOT open.
        This collapses the second grid column in CSS.
      */}
      <div
        className={
          'main-interface-container' + (isAiSidebarOpen ? '' : ' ai-closed')
        }
      >
        {/* Left sidebar (Primary) */}
        <aside className="sidebar left-sidebar">
          <PrimarySidebar />
        </aside>

        {/* AI Sidebar wrapper ALWAYS present; just conditionally render the content */}
        <div className="ai-sidebar-wrapper">
          {isAiSidebarOpen && (
            <AiSidebar
              isOpen
              onClose={() => setIsAiSidebarOpen(false)}
              onGenerate={handleAiGenerate}
              showAcceptChanges={showAcceptChanges}
              onAcceptChanges={handleAcceptChanges}
              onRejectChanges={handleRejectChanges}
            />
          )}
        </div>

        {/* Main Canvas Area */}
        <main className="editor-canvas-area">
          <CanvasBorderWrapper>
            <DroppableCanvas
              isUsingYesImages={isUsingYesImages}
              SelectedPageComponent={SelectedPageComponent}
            />
          </CanvasBorderWrapper>
        </main>

        {/* Right sidebar */}
        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>
      </div>

      {/* Modal to prompt AI image generation */}
      {showModal && (
        <AiImagesModal
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

      {/* Floating AI Button: toggles the AI Sidebar */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#6942f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 9999,
        }}
        onClick={() => {
          console.log('AI Floating Button Clicked');
          setIsAiSidebarOpen(!isAiSidebarOpen);
        }}
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
