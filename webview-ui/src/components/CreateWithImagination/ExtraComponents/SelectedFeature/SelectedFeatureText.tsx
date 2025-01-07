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

// Hypothetical utility that handles image compression + OCR => bounding boxes
import { processImageAndOcr } from './utils/ImageProcessing/imageProcessing';

// Parser
// import { parseAiOutput } from './utils/AiParser';

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
  // Image upload + preview states
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Loading state for the entire “Generate” action
  const [loading, setLoading] = useState<boolean>(false);

  // Text input from the user
  const [textValue, setTextValue] = useState<string>('');

  // AI raw response (JSON string)
  const [aiResponse, setAiResponse] = useState<string>('');

  /**
   * Listen for messages from the VSCode extension backend.
   * If we receive 'blueprintAI.result', we either show an error or display the AI output.
   */
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const { command, payload } = event.data;

      if (command === 'blueprintAI.result') {
        // Stop the spinner
        setLoading(false);

        if (payload.error) {
          // Show the error as an alert in VSCode
          window.vscode.postMessage({
            command: 'alert',
            text: `Error: ${payload.error}`,
          });
        } else {
          // We have a successful AI JSON output
          setAiResponse(payload.layoutJson);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  /**
   * Trigger hidden file input
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

      if (!file.type.startsWith('image/')) {
        // Not an image file
        window.vscode.postMessage({
          command: 'alert',
          text: 'Please upload a valid image file.',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // File too large
        window.vscode.postMessage({
          command: 'alert',
          text: 'File size exceeds the 5MB limit.',
        });
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
   */
  const handleGenerateClick = async () => {
    setLoading(true);

    let finalBase64: string | undefined;
    let boundingBoxes: any[] = [];
    let imageDimensions = { width: 0, height: 0 };
    let recognizedText = '';

    // If the user uploaded an image, run OCR + bounding box analysis
    if (uploadedImage && imagePreviewUrl) {
      try {
        const result = await processImageAndOcr(
          uploadedImage,
          {
            maxWidth: 1200,
            maxBBoxes: 80,
            minConfidence: 60,
          },
          true
        );

        finalBase64 = result.compressedBase64;
        boundingBoxes = result.boundingBoxes;
        imageDimensions = {
          width: result.imageWidth,
          height: result.imageHeight,
        };
        recognizedText = result.recognizedText;
      } catch (err: any) {
        window.vscode.postMessage({
          command: 'alert',
          text: `Image processing error: ${err?.message || String(err)}`,
        });
        setLoading(false);
        return;
      }
    }

    // Send a request to the extension with all relevant data
    window.vscode.postMessage({
      command: 'blueprintAI.generateLayout',
      payload: {
        userText: textValue,
        base64Image: finalBase64,
        recognizedText,
        boundingBoxes,
        imageDimensions,
      },
    });
  };

  /**
   * Optionally parse the AI output whenever it changes,
   * so we can convert it into actual CraftJS layout components, etc.
   */
  useEffect(() => {
    if (aiResponse) {
      // e.g., parseAiOutput might produce a structure that your parser uses
      // for a CraftJS page. We'll just log or handle it here.
      // const parsedLayout = parseAiOutput(aiResponse);
      // console.log('Parsed Layout:', parsedLayout);
      // You might store this in local state or pass to a CraftJS editor
    }
  }, [aiResponse]);

  return (
    <div className="selected-feature-text-container">
      <Text variant="mediumPlus" className="description-text" block>
        Enter a description of your website...
      </Text>

      <div className="input-box-container">
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

        <TextField
          placeholder="Talk with Blueprint AI..."
          className="input-textbox"
          multiline
          rows={5}
          value={textValue}
          onChange={(_, newVal) => setTextValue(newVal || '')}
        />

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

      {aiResponse && (
        <div className="ai-response-container">
          <Text variant="medium" block>
            AI Output (JSON):
          </Text>
          <pre>{aiResponse}</pre>
        </div>
      )}
    </div>
  );
};

export default SelectedFeatureText;
