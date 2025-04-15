// AiSidebar.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import {
  getUserPrompt,
  setUserPrompt,
  subscribePromptChange,
  setSelectedNodeId,
  getSelectedNodeId,
} from '../../store/store';

// Overlay, sections, etc.
import { LoadingOverlay } from './Components/LoadingOverlay';
import { HeaderSection } from './Components/HeaderSection';
import { SelectedElementInfo } from './Components/SelectedElementInfo';
import { ImageUploadSection } from './Components/ImageUploadSection';
import { AiPromptSection } from './Components/AiPromptSection';
import { GenerateButtons } from './Components/GenerateButtons';
import { GeneratedPreviewSection } from './Components/GeneratedPreviewSection';
import { AcceptRejectSection } from './Components/AcceptRejectSection';

// The helper function that logs the snippet:
import { handleGenerateOutput } from './HandleChanges';

// For beautifying HTML:
import { html as beautifyHtml } from 'js-beautify';

export interface AiSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  showAcceptChanges?: boolean;
  onGenerate?: (userInput: string, uploadedImage: File | null) => void;
  onAcceptChanges?: () => void;
  onRejectChanges?: () => void;
}

export const AiSidebar: React.FC<AiSidebarProps> = ({
  isOpen,
  onClose,
  showAcceptChanges,
  onGenerate,
  onAcceptChanges,
  onRejectChanges,
}) => {
  // Pull in Craft.js state + actions
  const { actions, selectedElementName, isSelected } = useEditor(
    (state, query) => {
      let elementName: string | undefined;
      let selected = false;

      if (state.events.selected && state.events.selected.size === 1) {
        selected = true;
        const nodeId = Array.from(state.events.selected)[0];

        if (nodeId) {
          setSelectedNodeId(nodeId);

          const node = query.node(nodeId).get();
          if (node?.data?.displayName) {
            elementName = node.data.displayName;
          }
        }
      } else {
        // If multiple or none selected, clear out the store
        setSelectedNodeId(null);
      }

      return {
        selectedElementName: elementName,
        isSelected: selected,
        query,
      };
    }
  );

  // Local component state
  const [userInput, setUserInputState] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showGenerated, setShowGenerated] = useState(false);
  const [previewClosed, setPreviewClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storePrompt, setStorePrompt] = useState(getUserPrompt());
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubscribe = subscribePromptChange(() => {
      setStorePrompt(getUserPrompt());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const POST_GENERATE_MESSAGE =
    'I have removed the Books category and replaced it with a Trending categories image with a call to action button as requested.';

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    setUploadedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setImagePreviewUrl(null);
  };

  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    const extension = name.slice(name.lastIndexOf('.'));
    const truncatedName = name.slice(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension}`;
  };

  const handleClearAll = () => {
    setUserInputState('');
    removeImage();
  };

  const handleGenerateClick = () => {
    if (!userInput && !uploadedImage) {
      alert('Please enter text or upload an image first.');
      return;
    }

    // 1) Store the node ID so we can still find it after deselecting
    const nodeId = getSelectedNodeId();
    if (!nodeId) {
      alert('No node is selected.');
      return;
    }

    // 2) Deselect the node so there's no "selected" overlay in the DOM
    //    or any special "indicator-div-wrapper" elements.
    actions.clearEvents(); // Or: actions.selectNode(null)

    // 3) Wait a tick for the DOM to update
    setTimeout(() => {
      // Now that it's deselected, query the DOM
      const domElement = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (domElement) {
        // Clone so we can optionally remove any leftover indicators if they exist
        const cloned = domElement.cloneNode(true) as HTMLElement;

        // (Optionally, remove #indicator-div-wrapper if it remains in the DOM)
        const indicatorEls = cloned.querySelectorAll('#indicator-div-wrapper');
        indicatorEls.forEach((el) => el.remove());

        // Beautify HTML
        const rawHTML = cloned.outerHTML;
        const beautifiedHTML = beautifyHtml(rawHTML, {
          indent_size: 2,
          preserve_newlines: true,
        });

        const componentName = selectedElementName || 'MyComponent';
        handleGenerateOutput(componentName, beautifiedHTML);
      } else {
        console.warn(`No DOM element found for data-node-id="${nodeId}"`);
      }
    }, 0);

    // 4) Continue with any "generation" logic (API calls, etc.)
    const localUserInput = userInput;
    setIsLoading(true);
    setShowGenerated(false);
    setPreviewClosed(false);

    setTimeout(() => {
      setIsLoading(false);
      setUserPrompt(localUserInput);
      setShowGenerated(true);
      onGenerate?.(localUserInput, uploadedImage);
    }, 3000);
  };

  const handleCloseGeneratedView = () => {
    setShowGenerated(false);
    setPreviewClosed(true);
  };

  const handleAccept = () => {
    setShowGenerated(false);
    setPreviewClosed(true);
    onAcceptChanges?.();
  };

  const handleReject = () => {
    setShowGenerated(false);
    setPreviewClosed(true);
    onRejectChanges?.();
  };

  // Controls whether the preview is displayed
  const isPreviewVisible =
    !previewClosed && (showGenerated || showAcceptChanges);

  return (
    <>
      <LoadingOverlay isLoading={isLoading} />
      <div
        className={`ai-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          width: '300px',
          border: '1px solid #ddd',
          background: '#fff',
          overflow: 'hidden',
        }}
      >
        <HeaderSection onClose={onClose} />

        <SelectedElementInfo
          isSelected={isSelected}
          selectedElementName={selectedElementName}
        />

        {/* Only show the Upload + Prompt sections if the preview is not visible */}
        {!isPreviewVisible && (
          <>
            <ImageUploadSection
              uploadedImage={uploadedImage}
              imagePreviewUrl={imagePreviewUrl}
              onUploadClick={handleUploadClick}
              onImageChange={handleImageChange}
              removeImage={removeImage}
              fileInputRef={fileInputRef}
              truncateFileName={truncateFileName}
            />
            <AiPromptSection
              userInput={userInput}
              setUserInput={setUserInputState}
            />
            <GenerateButtons
              onGenerateClick={handleGenerateClick}
              onClearAll={handleClearAll}
            />
          </>
        )}

        {/* Show Generated Preview if indicated */}
        {isPreviewVisible && (
          <GeneratedPreviewSection
            storePrompt={storePrompt}
            uploadedImage={uploadedImage}
            imagePreviewUrl={imagePreviewUrl}
            message={POST_GENERATE_MESSAGE}
            onCloseGeneratedView={handleCloseGeneratedView}
          />
        )}

        {/* Make Accept/Reject visible if user has generated something OR the prop is true */}
        {(showAcceptChanges || showGenerated) && (
          <AcceptRejectSection
            onAccept={handleAccept}
            onReject={handleReject}
          />
        )}
      </div>
    </>
  );
};
