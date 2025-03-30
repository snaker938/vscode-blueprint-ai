// CreateSelectedPage.tsx

import { useState, useEffect, CSSProperties, ChangeEvent, FC } from 'react';
import { getVsCodeApi } from '../CreateWithImagination/ExtraComponents/SelectedFeature/utils/vscodeApi';

/**
 * Props for CreateSelectedPage component.
 * - pageName: the user-selected page name (from SuggestedPages).
 * - onClose: a function to close/dismiss this component (if needed).
 */
interface CreateSelectedPageProps {
  pageName: string;
  onClose: () => void;
}

const CreateSelectedPage: FC<CreateSelectedPageProps> = ({
  pageName,
  onClose,
}) => {
  // Prompt / text description
  const [prompt, setPrompt] = useState<string>('');

  // Image file selection + preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // UI states
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  // Fade in on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  // Helper: Truncate a long filename, e.g. "my_super_long_filename.png" -> "my_super_lo...png"
  const truncateFileName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) return name;
    const extension = name.slice(name.lastIndexOf('.'));
    const truncatedName = name.slice(0, maxLength - extension.length - 3);
    return `${truncatedName}...${extension}`;
  };

  // Handle uploading an image (with basic validation)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, etc.).');
      return;
    }
    // Validate file size (e.g. 5 MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setImageFile(file);

    // Preview the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Remove the selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  /**
   * Handle "Create" submission.
   * This method sends the prompt, page name, and screenshot to the backend
   * or to the VS Code extension (via postMessage).
   */
  const handleSubmit = async () => {
    if (!prompt && !imageFile) {
      alert(
        'Please enter a prompt or select an image before creating the page.'
      );
      return;
    }

    setLoading(true);

    try {
      let rawBytes: number[] | null = null;

      // If an image is uploaded, convert it to raw bytes
      if (imageFile) {
        const arrayBuffer = await imageFile.arrayBuffer();
        rawBytes = Array.from(new Uint8Array(arrayBuffer));
      }

      // Example: Sending data to a VS Code extension
      const vsCode = getVsCodeApi();
      if (vsCode) {
        vsCode.postMessage({
          command: 'blueprintAI.generateLayoutSuggested',
          payload: {
            pageName, // the selected page name
            userText: prompt,
            arrayBuffer: rawBytes, // raw bytes or null
          },
        });
      } else {
        console.error('VS Code API is not available.');
      }

      // Optionally close after success
      onClose();
    } catch (error: any) {
      console.error('Error sending data:', error);
      alert(`Error creating page: ${error.message ?? String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Container style for the single, parent-based "modal" content.
   * The parent (SuggestedPages) is responsible for the backdrop & centering.
   */
  const containerStyle: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(0.95)',
    transition: 'opacity 0.2s ease-out, transform 0.2s ease-out',
  };

  const labelStyle: CSSProperties = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
  };

  const inputStyle: CSSProperties = {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };

  const buttonBarStyle: CSSProperties = {
    marginTop: '24px',
    textAlign: 'right' as const,
  };

  const cancelBtnStyle: CSSProperties = {
    background: '#ddd',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const createBtnStyle: CSSProperties = {
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '8px',
  };

  return (
    <div style={containerStyle}>
      {/* Close (X) button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          fontSize: '1.25rem',
          cursor: 'pointer',
        }}
        aria-label="Close"
      >
        &times;
      </button>

      <h2 id="createPageTitle" style={{ margin: '0 0 8px' }}>
        Create Page
      </h2>

      {/* Display the selected page name */}
      <p style={{ margin: '0 0 16px', color: '#555' }}>
        You are creating a page for: <strong>{pageName}</strong>
      </p>

      {/* Prompt/Text input field */}
      <label htmlFor="pagePrompt" style={labelStyle}>
        Prompt:
      </label>
      <input
        id="pagePrompt"
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a description..."
        style={inputStyle}
        disabled={loading}
      />

      {/* If image is selected, show preview container + remove button */}
      {imageFile ? (
        <div
          style={{
            display: 'flex',
            marginBottom: '16px',
            alignItems: 'center',
          }}
        >
          {/* Preview Thumbnail */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '4px',
                objectFit: 'cover',
                marginRight: '8px',
              }}
            />
          )}

          {/* File Info + Remove Button */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '12px',
                  color: '#333',
                  marginRight: '8px',
                }}
              >
                Referencing {truncateFileName(imageFile.name, 20)}
              </span>
              <button
                onClick={removeImage}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#777',
                  fontSize: '14px',
                }}
                title="Remove image"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Image upload label & input (only shown if no image selected) */}
          <label htmlFor="imageUpload" style={labelStyle}>
            Reference Image:
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: '16px' }}
            disabled={loading}
          />
        </>
      )}

      {/* Action buttons */}
      <div style={buttonBarStyle}>
        <button onClick={onClose} style={cancelBtnStyle} disabled={loading}>
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          style={createBtnStyle}
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Page'}
        </button>
      </div>
    </div>
  );
};

export default CreateSelectedPage;
