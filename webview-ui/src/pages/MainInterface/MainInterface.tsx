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

import AmazonHomeNoImages from '../../components/LocalPages/Page1/no-images';
import AmazonHomeYesImages from '../../components/LocalPages/Page1/yes-images';
import ChangedHome from '../../components/LocalPages/Page1/changed-home';
import AcceptChanges from '../../components/LocalPages/Page1/accept-changes';

import '../../store/store';

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
    // If user clicks empty space, deselect everything
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
 * A component that sets up the chosen page within a Frame.
 */
const DroppableCanvas: React.FC<{ RootComponent: React.ElementType }> = ({
  RootComponent,
}) => {
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
        <RootComponent />
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
  const PageNoImages = AmazonHomeNoImages;
  const PageYesImages = AmazonHomeYesImages;

  /**
   * If user accepted changes, we show ChangedHome.
   * If user loaded AI images, we show AmazonHomeYesImages.
   * Otherwise, we show AmazonHomeNoImages.
   *
   * BUT if the user clicks AI Generate, we'll display AcceptChanges.
   */
  const [isUsingYesImages, setIsUsingYesImages] = useState(false);
  const [hasAcceptedChanges, setHasAcceptedChanges] = useState(false);
  const [showAcceptChanges, setShowAcceptChanges] = useState(false);

  /**
   * Key used to force a complete unmount/remount of the <Editor>.
   * Each time we increment this key, it triggers a fresh editor instance.
   */
  const [editorKey, setEditorKey] = useState(0);

  // States for the initial AI modal, AI sidebar, and spinner
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false);
  const [isSuggestedOpen, setIsSuggestedOpen] = useState(false);

  // Decide which page layout to display
  const getRootComponent = (): React.ElementType => {
    // If we've triggered the AI Generation, show the AcceptChanges layout:
    if (showAcceptChanges) {
      return AcceptChanges;
    }

    // If the user accepted changes, show the final "ChangedHome"
    if (hasAcceptedChanges) {
      return ChangedHome;
    }

    // Otherwise, show either "Yes Images" or "No Images" pages
    return isUsingYesImages ? PageYesImages : PageNoImages;
  };

  // Force a brand-new Editor by incrementing "editorKey"
  const reloadEditor = () => {
    setEditorKey((prevKey) => prevKey + 1);
  };

  /**
   * The user picks "Yes" on the initial AI modal
   */
  const handleGenerateImagesYes = () => {
    setIsGenerating(true);
    // Simulate an async AI call
    setTimeout(() => {
      setIsGenerating(false);
      setIsUsingYesImages(true);
      setShowModal(false);

      // Force editor to re-mount
      reloadEditor();
    }, 3000);
  };

  /**
   * The user picks "No" on the initial AI modal
   */
  const handleGenerateImagesNo = () => {
    setShowModal(false);

    // Force editor to re-mount so we load the "no images" layout fresh
    reloadEditor();
  };

  /**
   * AI Sidebar triggers an AI generation
   * -> Show AcceptChanges layout in place of the others
   */
  const handleAiGenerate = () => {
    console.log('AI Generate button clicked');

    // Set the flag to display the AcceptChanges layout:
    setShowAcceptChanges(true);
    // Remount the editor so it displays AcceptChanges immediately:
    reloadEditor();
  };

  /**
   * The user accepts the AI changes
   * -> Show the final "ChangedHome"
   */
  const handleAcceptChanges = () => {
    console.log('Changes accepted!');
    setShowAcceptChanges(false);
    setHasAcceptedChanges(true);

    // Force editor to re-mount with the "ChangedHome" layout
    reloadEditor();
  };

  /**
   * The user rejects/closes the AI changes
   * -> Revert to the original layout (either with or without images)
   */
  const handleRejectChanges = () => {
    console.log('Changes rejected or closed');
    setShowAcceptChanges(false);

    // Reload the editor to go back to the prior page
    reloadEditor();
  };

  return (
    // Render a new <Editor> each time "editorKey" changes
    <Editor
      key={editorKey}
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
        ChangedHome,
        AcceptChanges,
      }}
      onRender={(nodeProps) => <RenderNode {...nodeProps} />}
    >
      {/* Main layout */}
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
            <DroppableCanvas RootComponent={getRootComponent()} />
          </CanvasBorderWrapper>
        </main>

        {/* Right sidebar */}
        <aside className="sidebar right-sidebar">
          <PropertiesSidebar />
        </aside>
      </div>

      {/* Modal: prompt if user wants AI images */}
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
