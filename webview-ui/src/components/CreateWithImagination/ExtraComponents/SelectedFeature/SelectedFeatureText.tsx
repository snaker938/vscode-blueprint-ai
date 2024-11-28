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

interface SelectedFeatureTextProps {
  openModal: () => void;
}

const SelectedFeatureText: React.FC<SelectedFeatureTextProps> = ({
  openModal,
}) => {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleUploadClick = () => {
    document.getElementById('imageUploadInput')?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Error checks
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit.');
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

  const handleGenerateClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <>
      <div className="selected-feature-text-container">
        {/* Description Text */}
        <Text variant="mediumPlus" className="description-text" block>
          Enter a description of your website...
        </Text>

        {/* Input Box */}
        <div className="input-box-container">
          {uploadedImage && (
            <div className="uploaded-image-container">
              <img
                src={imagePreviewUrl!}
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

        {/* Generate Button Section */}
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
    </>
  );
};

export default SelectedFeatureText;
