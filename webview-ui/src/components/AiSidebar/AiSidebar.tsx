import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from '@craftjs/core';

// Import the store utilities
import {
  getUserPrompt,
  setUserPrompt,
  subscribePromptChange,
} from '../../store/store';

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
  /** ---------- CRAFT.JS SELECTION INFO ---------- */
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

  /** ---------- LOCAL STATE ---------- */
  // Text area input (the user's "current" prompt while typing)
  const [userInput, setUserInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Whether to show the generated preview
  const [showGenerated, setShowGenerated] = useState(false);

  // Let the user manually close the preview, even if the parent sets showAcceptChanges
  const [previewClosed, setPreviewClosed] = useState(false);

  // Overlay to show while "generating"
  const [isLoading, setIsLoading] = useState(false);

  // Store-based prompt (what we display in the "Generated Preview" after Generate)
  const [storePrompt, setStorePrompt] = useState(getUserPrompt());

  // Listen to store changes so if userPrompt changes in the store, we see it here
  useEffect(() => {
    const unsubscribe = subscribePromptChange(() => {
      setStorePrompt(getUserPrompt());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Message to display once generation is complete
  const POST_GENERATE_MESSAGE =
    'I have removed the Books category and replaced it with a Trending categories image with a call to action button as requested.';

  /** File input ref for hidden input */
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /** ---------- HANDLERS ---------- */

  // File upload
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];

    // Basic validations
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

  // Clear text + image
  const handleClearAll = () => {
    setUserInput('');
    removeImage();
  };

  // Generate button
  const handleGenerateClick = () => {
    if (!userInput && !uploadedImage) {
      alert('Please enter text or upload an image first.');
      return;
    }

    // Capture the current user input locally so it doesn't get lost
    const localUserInput = userInput;

    // Show overlay
    setIsLoading(true);

    // Hide any previously shown preview
    setShowGenerated(false);
    setPreviewClosed(false);

    // Simulate an async call for 3s
    setTimeout(() => {
      // Once "generation" is done:
      setIsLoading(false);

      // Store this prompt as the "previous prompt" in our global store
      setUserPrompt(localUserInput);

      // Now show the preview
      setShowGenerated(true);

      // Notify parent
      onGenerate?.(localUserInput, uploadedImage);
    }, 3000);
  };

  // X button in the generated preview
  const handleCloseGeneratedView = () => {
    setShowGenerated(false);
    setPreviewClosed(true);
  };

  // Accept button
  const handleAccept = () => {
    setShowGenerated(false);
    setPreviewClosed(true);
    onAcceptChanges?.();
  };

  // Reject button
  const handleReject = () => {
    setShowGenerated(false);
    setPreviewClosed(true);
    onRejectChanges?.();
  };

  // If we haven't manually closed the preview, and either local generation or parent acceptance is true:
  const isPreviewVisible =
    !previewClosed && (showGenerated || showAcceptChanges);

  return (
    <>
      {/* Indeterminate progress bar keyframes */}
      <style>
        {`
          @keyframes indeterminate-progress {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>

      {/* Overlay + Indeterminate Loading Bar */}
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(5px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <p
            style={{ marginBottom: '16px', fontSize: '1.2rem', color: '#444' }}
          >
            Generating...
          </p>
          <div
            style={{
              position: 'relative',
              width: '50%',
              height: '10px',
              background: '#ccc',
              overflow: 'hidden',
              borderRadius: '5px',
            }}
          >
            {/* The animated bar */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: '-100%',
                width: '100%',
                background: '#6942f5',
                animation: 'indeterminate-progress 1.5s infinite linear',
              }}
            />
          </div>
        </div>
      )}

      <div
        className={`ai-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          display: isOpen ? 'flex' : 'none',
          flexDirection: 'column',
          width: '300px',
          border: '1px solid #ddd',
          background: '#fff',
          height: '100%',
          overflowY: 'auto',
        }}
      >
        {/* ---------- HEADER ---------- */}
        <div
          style={{
            position: 'relative',
            padding: '16px',
            borderBottom: '1px solid #eee',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontWeight: 600,
              fontSize: '1.3rem',
              color: '#333',
            }}
          >
            Blueprint AI
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#555' }}>
            Generate new designs or refine existing ones.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                border: 'none',
                background: 'transparent',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* ---------- SELECTED ELEMENT INFO ---------- */}
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #eee',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#444',
            }}
          >
            Selected Element
          </h4>
          {isSelected && selectedElementName ? (
            <p style={{ margin: '6px 0 0', color: '#333', fontSize: '0.9rem' }}>
              Currently referencing: <strong>{selectedElementName}</strong>
            </p>
          ) : (
            <p style={{ margin: '6px 0 0', color: '#999', fontSize: '0.9rem' }}>
              No element selected
            </p>
          )}
        </div>

        {/* ---------- CONDITIONAL: SHOW PROMPT UI IF NOT SHOWING PREVIEW ---------- */}
        {!isPreviewVisible && (
          <>
            {/* ---------- IMAGE UPLOAD SECTION ---------- */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#444',
                }}
              >
                Image Upload
              </h4>
              <p
                style={{ margin: '6px 0', color: '#555', fontSize: '0.85rem' }}
              >
                Optionally include a reference image.
              </p>

              {uploadedImage ? (
                <div
                  style={{
                    position: 'relative',
                    border: '1px solid #ccc',
                    marginTop: '8px',
                  }}
                >
                  <img
                    src={imagePreviewUrl || ''}
                    alt="User upload"
                    style={{
                      width: '100%',
                      display: 'block',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '6px 8px',
                      backgroundColor: '#fafafa',
                      borderTop: '1px solid #ccc',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', color: '#555' }}>
                      Referencing{' '}
                      <em style={{ fontStyle: 'italic', color: '#777' }}>
                        {truncateFileName(uploadedImage.name, 20)}
                      </em>
                    </span>
                    <button
                      onClick={removeImage}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: '#d00',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  style={{
                    width: '100%',
                    border: '1px dashed #aaa',
                    padding: '10px',
                    cursor: 'pointer',
                    marginTop: '8px',
                    backgroundColor: '#fff',
                  }}
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

            {/* ---------- AI PROMPT SECTION ---------- */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#444',
                }}
              >
                AI Prompt
              </h4>
              <p
                style={{ margin: '6px 0', color: '#555', fontSize: '0.85rem' }}
              >
                Briefly describe the changes or designs you want to generate.
              </p>
              <textarea
                placeholder="Describe your desired features..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '10px',
                  boxSizing: 'border-box',
                  resize: 'none',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  color: '#333',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  // width: '100%',
                  // padding: '8px',
                  // boxSizing: 'border-box',
                  // resize: 'none',
                  // fontSize: '0.9rem',
                }}
              />
            </div>

            {/* ---------- BUTTONS: GENERATE / CLEAR ---------- */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                gap: '8px',
              }}
            >
              <button
                onClick={handleGenerateClick}
                style={{
                  flex: 1,
                  backgroundColor: '#6942f5',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 0',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                Generate
              </button>
              <button
                onClick={handleClearAll}
                style={{
                  backgroundColor: '#bbb',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                Clear
              </button>
            </div>
          </>
        )}

        {/* ---------- GENERATED PREVIEW SECTION ---------- */}
        {isPreviewVisible && (
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #eee',
            }}
          >
            {/* Header Row with "Generated Preview" and the X button */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <h4
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#444',
                }}
              >
                Generated Preview
              </h4>
              <button
                onClick={handleCloseGeneratedView}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '18px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            {/* ---------- SHOW USER'S PROMPT FROM THE STORE ---------- */}
            <div
              style={{
                marginBottom: '16px',
                padding: '8px',
                backgroundColor: '#f9f9f9',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <h5 style={{ margin: '0 0 4px', fontWeight: 'bold' }}>
                Your Prompt:
              </h5>
              <p style={{ margin: 0, color: '#333' }}>{storePrompt}</p>
            </div>

            {/* ---------- SHOW USER'S IMAGE (IF ANY) ---------- */}
            {uploadedImage && imagePreviewUrl && (
              <div
                style={{
                  marginBottom: '16px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imagePreviewUrl}
                  alt="Uploaded"
                  style={{
                    width: '100%',
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              </div>
            )}

            {/* ---------- FIXED MESSAGE ---------- */}
            <div
              style={{
                padding: '8px',
                backgroundColor: '#e1f5fe',
                border: '1px solid #b3e5fc',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: '#0277bd',
                  fontSize: '0.9rem',
                }}
              >
                {POST_GENERATE_MESSAGE}
              </p>
            </div>
          </div>
        )}

        {/* ---------- ACCEPT / REJECT CHANGES SECTION ---------- */}
        {showAcceptChanges && (
          <div
            style={{
              padding: '16px',
              margin: '16px',
              border: '1px solid #ccc',
              background: '#f9f9f9',
              borderRadius: '4px',
            }}
          >
            <h3
              style={{
                marginTop: 0,
                fontSize: '1rem',
                fontWeight: 600,
                color: '#333',
              }}
            >
              Accept These Changes?
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: '#555',
                margin: '6px 0 12px',
              }}
            >
              We have generated new suggestions based on your prompt. Would you
              like to accept them?
            </p>
            <div>
              <button
                onClick={handleAccept}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  marginRight: '6px',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                Accept
              </button>
              <button
                onClick={handleReject}
                style={{
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                }}
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
