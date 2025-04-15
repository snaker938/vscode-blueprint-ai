import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@craftjs/core';
import {
  getUserPrompt,
  setUserPrompt,
  subscribePromptChange,
} from '../../store/store';

import { LoadingOverlay } from './Components/LoadingOverlay';
import { HeaderSection } from './Components/HeaderSection';
import { SelectedElementInfo } from './Components/SelectedElementInfo';
import { ImageUploadSection } from './Components/ImageUploadSection';
import { AiPromptSection } from './Components/AiPromptSection';
import { GenerateButtons } from './Components/GenerateButtons';
import { GeneratedPreviewSection } from './Components/GeneratedPreviewSection';
import { AcceptRejectSection } from './Components/AcceptRejectSection';

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
  const { selectedElementName, isSelected } = useEditor((state, query) => {
    let elementName: string | undefined;
    let selected = false;
    if (state.events.selected && state.events.selected.size === 1) {
      selected = true;
      const nodeId = Array.from(state.events.selected)[0];
      if (nodeId) {
        const node = query.node(nodeId).get();
        if (node?.data?.displayName) {
          elementName = node.data.displayName;
        }
      }
    }
    return {
      selectedElementName: elementName,
      isSelected: selected,
    };
  });

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

  // Determines whether the preview should be displayed
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
          // Removed height: '100%' and overflowY: 'auto' to eliminate scrolling
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
