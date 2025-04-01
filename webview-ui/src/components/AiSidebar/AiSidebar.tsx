import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '@craftjs/core';
import { getVsCodeApi } from '../CreateWithImagination/ExtraComponents/SelectedFeature/utils/vscodeApi';
import './AiSidebar.css';

/**
 * Props for the AiSidebar component
 */
export interface AiSidebarProps {
  /**
   * Optional callbacks when the user clicks the "suggested features" buttons.
   */
  onConvertScreenshot?: () => void;
  onGenerateDesign?: () => void;

  /**
   * Optional callback for submitting AI requests, e.g. "Chat with Blueprint AI".
   */
  onSubmitChat?: (message: string) => void;

  /**
   * (Optional) Handler for closing this sidebar.
   * Useful if you want to hide/unmount the AiSidebar when a close button is clicked.
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
  onConvertScreenshot,
  onGenerateDesign,
  onSubmitChat,
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
   * But per your instructions, we won't do anything after the response is received.
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { command, payload } = event.data || {};
      if (command === 'blueprintAI.result') {
        setLoading(false);
        console.log('AI response received:', payload);
        // Do nothing else per your instructions.
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
      {/* Optional close button */}
      {onClose && (
        <button className="ai-sidebar-close" onClick={onClose}>
          ✕
        </button>
      )}

      {/* Header */}
      <div className="ai-sidebar-header">
        <h2>Blueprint AI</h2>
        <p>Generate new designs, or refine existing ones.</p>
      </div>

      {/* Selected element reference from useEditor */}
      {isSelected && selectedElementName ? (
        <div className="ai-sidebar-reference">
          Currently referencing: <strong>{selectedElementName}</strong>
        </div>
      ) : (
        <div className="ai-sidebar-reference ai-sidebar-reference-inactive">
          No element selected
        </div>
      )}

      {/* Suggested features */}
      <div className="ai-sidebar-suggested-features">
        <button
          className="ai-sidebar-feature-button"
          onClick={onConvertScreenshot}
          title="Convert screenshot to design"
        >
          Convert screenshot
        </button>
        <button
          className="ai-sidebar-feature-button"
          onClick={onGenerateDesign}
          title="Generate design from text"
        >
          Generate from text
        </button>
      </div>

      {/* Image upload section */}
      <div className="ai-sidebar-upload-section">
        {uploadedImage ? (
          <div className="ai-sidebar-upload-preview">
            <img
              src={imagePreviewUrl || ''}
              alt="User upload"
              className="ai-sidebar-image-preview"
            />
            <div className="ai-sidebar-upload-info">
              <span>
                Referencing <em>{truncateFileName(uploadedImage.name, 20)}</em>
              </span>
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
            Upload an Image
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
        <label
          htmlFor="ai-sidebar-textarea"
          className="ai-sidebar-prompt-label"
        >
          AI Prompt:
        </label>
        <textarea
          id="ai-sidebar-textarea"
          className="ai-sidebar-textarea"
          placeholder="Describe your desired features..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={5}
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
