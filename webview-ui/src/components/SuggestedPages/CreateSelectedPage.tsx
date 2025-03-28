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
  const [prompt, setPrompt] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Optional: track a "loading" state if you want feedback while sending
  const [loading, setLoading] = useState<boolean>(false);

  // Fade-in animation on mount
  useEffect(() => {
    setVisible(true);
  }, []);

  // Handle cover image (screenshot) selection + preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  /**
   * Handle "Create" submission.
   * This method sends the prompt, page name, and screenshot to the backend
   * or to the VS Code extension (via postMessage).
   */
  const handleSubmit = async () => {
    // Enforce at least a prompt or an image
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
      // If you have a real backend API, you could do a `fetch` POST request instead.
      const vsCode = getVsCodeApi();
      if (vsCode) {
        vsCode.postMessage({
          command: 'blueprintAI.generateLayoutSuggested',
          payload: {
            pageName, // the selected page name
            userText: prompt, // the user-entered prompt
            arrayBuffer: rawBytes, // raw bytes of the image (or null)
          },
        });
      } else {
        console.error('VS Code API is not available.');
      }

      // Optionally, you might close after success:
      onClose();
    } catch (error: any) {
      console.error('Error sending data:', error);
      alert(`Error creating page: ${error.message ?? String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Overlay/backdrop styling
  const overlayStyle: CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  // Modal content box styling
  const modalStyle: CSSProperties = {
    position: 'relative',
    background: '#fff',
    color: '#000',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    overflowY: 'auto',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
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
    textAlign: 'right',
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
    <div style={overlayStyle}>
      <div
        style={modalStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby="createPageTitle"
      >
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
          Page Title or Prompt:
        </label>
        <input
          id="pagePrompt"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter page title or brief description..."
          style={inputStyle}
          disabled={loading}
        />

        {/* Image upload field */}
        <label
          htmlFor="imageUpload"
          style={{ ...labelStyle, marginTop: '8px' }}
        >
          Cover Image (optional):
        </label>
        <input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: '8px' }}
          disabled={loading}
        />

        {/* Preview of the selected image */}
        {imagePreview && (
          <div style={{ marginBottom: '16px' }}>
            <img
              src={imagePreview}
              alt="Image Preview"
              style={{ maxWidth: '100%', borderRadius: '4px' }}
            />
          </div>
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
    </div>
  );
};

export default CreateSelectedPage;
