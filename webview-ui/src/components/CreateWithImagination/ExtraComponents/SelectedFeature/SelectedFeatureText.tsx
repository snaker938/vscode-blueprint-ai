import React, { useState } from 'react';
import {
  Text,
  TextField,
  IconButton,
  Icon,
  PrimaryButton,
  Spinner,
} from '@fluentui/react';
import './SelectedFeatureText.css';

declare global {
  interface Window {
    vscode: {
      postMessage: (msg: any) => void;
    };
  }
}

interface SelectedFeatureTextProps {
  openModal: () => void;
}

const SelectedFeatureText: React.FC<SelectedFeatureTextProps> = ({
  openModal,
}) => {
  // State for the uploaded image and preview
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Text input from the user
  const [textValue, setTextValue] = useState<string>('');

  // Loading state for spinner feedback
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Trigger hidden file input to choose an image
   */
  const handleUploadClick = () => {
    document.getElementById('imageUploadInput')?.click();
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
        window.vscode.postMessage({
          command: 'alert',
          text: 'Please upload a valid image file.',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        window.vscode.postMessage({
          command: 'alert',
          text: 'File size exceeds the 5MB limit.',
        });
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
   * Called when user clicks "Generate"
   * - Reads image as ArrayBuffer
   * - Sends { userText, arrayBuffer } to the extension
   */
  const handleGenerateClick = async () => {
    if (!uploadedImage) {
      window.vscode.postMessage({
        command: 'alert',
        text: 'Please select an image before generating.',
      });
      return;
    }

    setLoading(true);

    try {
      // Convert the File to an ArrayBuffer
      const arrayBuffer = await uploadedImage.arrayBuffer();
      // Convert arrayBuffer to a typed array, then to a normal array
      const rawBytes = Array.from(new Uint8Array(arrayBuffer));

      // Post everything to the extension backend
      window.vscode.postMessage({
        command: 'blueprintAI.generateLayout',
        payload: {
          userText: textValue,
          arrayBuffer: rawBytes,
        },
      });
    } catch (err: any) {
      window.vscode.postMessage({
        command: 'alert',
        text: `Error reading image file: ${err?.message || String(err)}`,
      });
      setLoading(false);
      return;
    }
  };

  return (
    <div className="selected-feature-text-container">
      <Text variant="mediumPlus" className="description-text" block>
        Enter a description of your website...
      </Text>

      <div className="input-box-container">
        {/* If image is chosen, show a small preview + remove button */}
        {uploadedImage && (
          <div className="uploaded-image-container">
            <img
              src={imagePreviewUrl || ''}
              alt="Preview"
              className="image-preview"
            />
            <div className="image-info">
              <Icon iconName="Attach" className="paperclip-icon" />
              <span className="referencing-text">
                Referencing {truncateFileName(uploadedImage.name, 20)}
              </span>
            </div>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              onClick={removeImage}
              className="remove-image-button"
              title="Remove image"
            />
          </div>
        )}

        {/* Text field for user's prompt */}
        <TextField
          placeholder="Talk with Blueprint AI..."
          className="input-textbox"
          multiline
          rows={5}
          value={textValue}
          onChange={(_, val) => setTextValue(val || '')}
        />

        {/* Icons for AI modal + file upload */}
        <div className="input-box-icons">
          <div className="icon-button-group">
            <IconButton
              iconProps={{ iconName: 'Robot' }}
              onClick={openModal}
              className="icon-button ai-features-button"
              title="AI features"
            />
            <div className="separator-vertical" />
            <IconButton
              iconProps={{ iconName: 'Picture' }}
              onClick={handleUploadClick}
              className="icon-button"
              title="Upload image"
            />
            <input
              id="imageUploadInput"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>

      <div className="generate-button-section">
        <PrimaryButton
          onClick={handleGenerateClick}
          disabled={loading}
          className="generate-button"
        >
          {loading ? 'Generating...' : 'Generate'}
        </PrimaryButton>
      </div>

      {/* Show a spinner if in loading state */}
      {loading && (
        <div className="loading-section">
          <Spinner
            label={
              uploadedImage
                ? 'Processing your prompt & image...'
                : 'Processing your prompt...'
            }
          />
        </div>
      )}
    </div>
  );
};

export default SelectedFeatureText;
