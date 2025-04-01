import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '@craftjs/core';
import { getVsCodeApi } from '../CreateWithImagination/ExtraComponents/SelectedFeature/utils/vscodeApi';
import './AiSidebar.css';

/**
 * Props for the AiSidebar component
 */
export interface AiSidebarProps {
  /**
   * Optional callback for submitting AI requests, e.g. "Chat with Blueprint AI".
   */
  onSubmitChat?: (message: string) => void;

  /**
   * Whether the sidebar is currently detached from the main layout.
   */
  isDetached?: boolean;

  /**
   * Called to detach the sidebar from the main layout.
   */
  onDetach?: () => void;

  /**
   * Called to re-dock the sidebar into the main layout.
   */
  onDock?: () => void;

  /**
   * Called to close/hide the sidebar completely.
   */
  onClose?: () => void;
}

/**
 * A redesigned AiSidebar that references the currently selected Craft node
 * via the `useEditor` hook, rather than `useNode`. This avoids the error
 * "You can only use useNode in the context of <Editor />" when the AiSidebar
 * is not rendered as a direct child of a Craft node.
 */
export const AiSidebar: React.FC<AiSidebarProps> = ({
  onSubmitChat,
  isDetached,
  onDetach,
  onDock,
  onClose,
}) => {
  /**
   * Get the selected node from the CraftJS Editor context.
   * - If exactly one node is selected, we return its displayName as `selectedElementName`.
   * - Otherwise, we consider nothing selected.
   */
  const { selectedElementName, isSelected } = useEditor((state, query) => {
    let elementName: string | undefined = undefined;
    let selected = false;

    // If there's exactly one selected node, get its display name
    if (state.events.selected && state.events.selected.size === 1) {
      selected = true;
      const nodeId = Array.from(state.events.selected)[0];
      if (nodeId) {
        const node = query.node(nodeId).get();
        if (node && node.data && node.data.displayName) {
          elementName = node.data.displayName;
        }
      }
    }

    return {
      selectedElementName: elementName,
      isSelected: selected,
    };
  });

  // Text prompt state
  const [userInput, setUserInput] = useState('');

  // Image file & local preview
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Loading state (e.g. for showing a spinner/text)
  const [loading, setLoading] = useState(false);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Listen for AI responses from the VS Code extension (if you need to).
   * We won't do anything else when response is received.
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { command, payload } = event.data || {};
      if (command === 'blueprintAI.result') {
        setLoading(false);
        console.log('AI response received:', payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  /**
   * Trigger hidden file input to choose an image
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle user selecting a file
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Basic validation
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }

      setUploadedImage(file);

      // For preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Remove the selected image
   */
  const removeImage = () => {
    setUploadedImage(null);
    setImagePreviewUrl(null);
  };

  /**
   * Helper to truncate long file names
   */
  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    const extension = name.slice(name.lastIndexOf('.'));
    const truncatedName = name.slice(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension}`;
  };

  /**
   * Reset the text prompt and remove the uploaded image
   */
  const handleClearAll = () => {
    setUserInput('');
    removeImage();
  };

  /**
   * Send AI request to the backend (VS Code extension) with the text + optional image
   */
  const handleGenerateClick = async () => {
    if (!userInput && !uploadedImage) {
      alert('Please enter text or upload an image first.');
      return;
    }

    setLoading(true);

    try {
      let rawBytes: number[] | null = null;
      if (uploadedImage) {
        const arrayBuffer = await uploadedImage.arrayBuffer();
        rawBytes = Array.from(new Uint8Array(arrayBuffer));
      }

      const vsCode = getVsCodeApi();
      if (!vsCode) {
        console.error('VSCode API is not available.');
        setLoading(false);
        return;
      }

      vsCode.postMessage({
        command: 'blueprintAI.generateLayout',
        payload: {
          userText: userInput,
          arrayBuffer: rawBytes, // can be null if no image
        },
      });
    } catch (err) {
      console.error('Error preparing data for AI:', err);
      alert('An error occurred while sending data to AI. Check console.');
      setLoading(false);
    }

    // Optionally also submit user input to the parent or some chat callback
    if (onSubmitChat) {
      onSubmitChat(userInput);
    }
  };

  return (
    <div className="ai-sidebar">
      {/* A small draggable handle for the detached case */}
      {isDetached && <div className="ai-sidebar-drag-handle" />}

      {/* Top bar with docking/detach and close icons */}
      <div className="ai-sidebar-header-bar">
        <div className="ai-sidebar-header-icons">
          {isDetached ? (
            <button
              className="icon-button"
              onClick={onDock}
              title="Dock Sidebar"
            >
              {/* Dock icon (inline SVG) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                <path d="M2 12h20"></path>
              </svg>
            </button>
          ) : (
            <button
              className="icon-button"
              onClick={onDetach}
              title="Detach Sidebar"
            >
              {/* Detach icon (inline SVG) */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2"></rect>
                <path d="M2 7h20"></path>
              </svg>
            </button>
          )}

          <button
            className="icon-button"
            onClick={onClose}
            title="Close Sidebar"
          >
            {/* Close icon (inline SVG) */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="ai-sidebar-title">
          <h2>Blueprint AI</h2>
          <p>Generate and refine designs</p>
        </div>
      </div>

      {/* Selected element reference from useEditor */}
      {isSelected && selectedElementName ? (
        <div className="ai-sidebar-reference">
          <span>Targeting element:</span> <strong>{selectedElementName}</strong>
        </div>
      ) : (
        <div className="ai-sidebar-reference ai-sidebar-reference-inactive">
          No element selected
        </div>
      )}

      {/* Image upload section */}
      <div className="ai-sidebar-upload-section">
        <label className="ai-sidebar-label">Image (Optional)</label>
        {uploadedImage ? (
          <div className="ai-sidebar-upload-preview">
            <img
              src={imagePreviewUrl || ''}
              alt="User upload"
              className="ai-sidebar-image-preview"
            />
            <div className="ai-sidebar-upload-info">
              <span>{truncateFileName(uploadedImage.name, 18)}</span>
              <button
                className="ai-sidebar-upload-remove"
                onClick={removeImage}
                title="Remove image"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            className="ai-sidebar-upload-button"
            onClick={handleUploadClick}
          >
            Upload Image
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </div>

      {/* Prompt text area */}
      <div className="ai-sidebar-prompt-section">
        <label htmlFor="ai-sidebar-textarea" className="ai-sidebar-label">
          Prompt
        </label>
        <textarea
          id="ai-sidebar-textarea"
          className="ai-sidebar-textarea"
          placeholder="Describe what you want to design..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
        />
      </div>

      {/* Actions */}
      <div className="ai-sidebar-action-buttons">
        <button
          className="ai-sidebar-generate-button"
          onClick={handleGenerateClick}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <button
          className="ai-sidebar-clear-button"
          onClick={handleClearAll}
          disabled={loading}
        >
          Clear
        </button>
      </div>

      {/* Loading indicator */}
      {loading && <div className="ai-sidebar-loading">Sending to AI...</div>}
    </div>
  );
};
