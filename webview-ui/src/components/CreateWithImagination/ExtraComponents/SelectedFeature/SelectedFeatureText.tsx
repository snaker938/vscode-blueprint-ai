import React, { useState, useEffect } from 'react';
import {
  Text,
  TextField,
  IconButton,
  Icon,
  PrimaryButton,
  Spinner,
} from '@fluentui/react';
import './SelectedFeatureText.css';
import { getVsCodeApi } from './utils/vscodeApi';

interface SelectedFeatureTextProps {
  openModal: () => void;
}

const SelectedFeatureText: React.FC<SelectedFeatureTextProps> = ({
  openModal,
}) => {
  // State: user’s text prompt
  const [textValue, setTextValue] = useState<string>('');

  // State: image file & local preview
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // UI loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Listen for messages from the VS Code extension backend.
   * Specifically, we look for 'blueprintAI.result' messages.
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { command, payload } = event.data || {};
      if (command === 'blueprintAI.result') {
        // We got a response from the extension for the "generateLayout" call
        setLoading(false); // stop the spinner
        if (payload.error) {
          console.error('AI error:', payload.error);
        } else if (payload.layoutJson) {
          console.log('AI result (layout JSON):', payload.layoutJson);
        }
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
   * Handle "Generate" click
   *   1) Convert the image to an ArrayBuffer
   *   2) Post a message to the VS Code extension
   *   3) Wait for the extension's response and log to console
   */
  const handleGenerateClick = async () => {
    // If no prompt and no image, possibly warn user?
    if (!textValue && !uploadedImage) {
      alert('Please enter text or select an image first.');
      return;
    }

    setLoading(true);

    try {
      // If there's an image, convert it to raw bytes
      let rawBytes: number[] | null = null;
      if (uploadedImage) {
        const arrayBuffer = await uploadedImage.arrayBuffer();
        rawBytes = Array.from(new Uint8Array(arrayBuffer));
      }

      // Send the data to the extension
      const vsCode = getVsCodeApi();
      if (!vsCode) {
        console.error('VSCode API is not available.');
        setLoading(false);
        return;
      }
      vsCode.postMessage({
        command: 'blueprintAI.generateLayout',
        payload: {
          userText: textValue,
          arrayBuffer: rawBytes, // could be null if no image
        },
      });
    } catch (err: any) {
      setLoading(false);
      console.error('Error preparing data for AI:', err);
      alert(`Error preparing data for AI: ${err.message ?? String(err)}`);
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
