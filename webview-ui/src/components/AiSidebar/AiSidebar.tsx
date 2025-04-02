import React, { useState, useRef } from 'react';
import { useEditor } from '@craftjs/core';

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

  const [userInput, setUserInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
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
    }
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
    setUserInput('');
    removeImage();
  };

  const handleGenerateClick = () => {
    if (!userInput && !uploadedImage) {
      alert('Please enter text or upload an image first.');
      return;
    }
    if (onGenerate) {
      onGenerate(userInput, uploadedImage);
    }
  };

  return (
    <div
      className={`ai-sidebar ${isOpen ? 'open' : ''}`}
      style={{
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
      }}
    >
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
        <p style={{ margin: '6px 0', color: '#555', fontSize: '0.85rem' }}>
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
        <p style={{ margin: '6px 0', color: '#555', fontSize: '0.85rem' }}>
          Briefly describe the changes or designs you want to generate.
        </p>
        <textarea
          placeholder="Describe your desired features..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
          style={{
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            resize: 'none',
            fontSize: '0.9rem',
          }}
        />
      </div>
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
            style={{ fontSize: '0.9rem', color: '#555', margin: '6px 0 12px' }}
          >
            We have generated new suggestions based on your prompt. Would you
            like to accept them?
          </p>
          <div>
            <button
              onClick={onAcceptChanges}
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
              onClick={onRejectChanges}
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
  );
};
