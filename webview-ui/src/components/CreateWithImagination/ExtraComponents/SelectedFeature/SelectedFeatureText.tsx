import React, { useState } from 'react';
import {
  Text,
  TextField,
  Spinner,
  PrimaryButton,
  DefaultButton,
  IconButton,
  IIconProps,
  Icon,
} from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import './SelectedFeatureText.css';

interface SelectedFeatureTextProps {
  openModal?: () => void;
}

const robotIcon: IIconProps = { iconName: 'Robot' };
const pictureIcon: IIconProps = { iconName: 'Picture' };

const SelectedFeatureText: React.FC<SelectedFeatureTextProps> = ({
  openModal,
}) => {
  // State: user's text prompt
  const [textValue, setTextValue] = useState<string>('');

  // State: image file & local preview
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // UI loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  // React Router navigate hook
  const navigate = useNavigate();

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
   * Handle "Generate" click:
   * 1) Show spinner (loading).
   * 2) After 3 seconds, navigate to /editing with correct location state
   *    if "Amazon" or "Youtube" is found in the prompt.
   */
  const handleGenerateClick = () => {
    if (!textValue && !uploadedImage) {
      alert('Please enter text or select an image first.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const lowerPrompt = textValue.toLowerCase();

      if (lowerPrompt.includes('amazon')) {
        navigate('/editing', { state: { location: 'amazon' } });
      } else if (lowerPrompt.includes('youtube')) {
        navigate('/editing', { state: { location: 'youtube' } });
      } else {
        // If neither Amazon nor Youtube is found, just go to /editing with no special state.
        navigate('/editing');
      }
    }, 3000);
  };

  return (
    <div className="selected-feature-text-container">
      <Text variant="mediumPlus" className="description-text" block>
        Enter a description of your website...
      </Text>

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

          {/* Replace the DefaultButton with an IconButton showing a modern "X" */}
          <IconButton
            className="remove-image-button"
            iconProps={{ iconName: 'ChromeClose' }}
            onClick={removeImage}
            ariaLabel="Remove image"
          />
        </div>
      )}

      {/* Group the text field & feature buttons side by side */}
      <div className="input-row">
        <TextField
          placeholder="Talk with Blueprint AI..."
          className="input-textbox"
          multiline
          rows={5}
          value={textValue}
          onChange={(_, val) => setTextValue(val || '')}
        />
      </div>

      {/* Moved feature buttons below the text field */}
      <div className="feature-buttons-container">
        <DefaultButton
          className="feature-button"
          iconProps={robotIcon}
          text="AI"
          onClick={() => {
            if (openModal) {
              openModal();
            } else {
              alert('AI Features modal not implemented.');
            }
          }}
        />
        <span className="feature-button-separator" />
        <DefaultButton
          className="feature-button"
          iconProps={pictureIcon}
          text="Image"
          onClick={handleUploadClick}
        />
        <input
          id="imageUploadInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
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
