import React, { useState } from 'react';
import {
  Text,
  PrimaryButton,
  Icon,
  Spinner,
  MessageBar,
  MessageBarType,
} from '@fluentui/react';
// import { useNavigate } from 'react-router-dom';
import './SelectedFeatureScreenshot.css';

const SelectedFeatureScreenshot: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];

      // Validate file type
      if (!selectedFile.type.startsWith('image/')) {
        setErrorMessage('Please upload a valid image file.');
        setFile(null);
        setFilePreview(null);
        return;
      }

      setFile(selectedFile);

      // Generate a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleGenerateClick = () => {
    if (!file) {
      setErrorMessage('Please upload a screenshot before proceeding.');
      return;
    }

    setLoading(true);

    // Simulate a loading process
    setTimeout(() => {
      setLoading(false);
      // Redirect to /editing-interface
      // navigate('/editing-interface');
    }, 3000);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
    setErrorMessage('');
  };

  return (
    <div className="selected-feature-screenshot-container">
      <div className="header-container">
        <Text variant="xLarge" className="header-text">
          Upload Your Screenshot
        </Text>
        <Text variant="mediumPlus" className="subheader-text">
          Convert your screenshot into a beautiful design.
        </Text>
      </div>

      {errorMessage && (
        <MessageBar
          messageBarType={MessageBarType.error}
          className="error-message"
        >
          {errorMessage}
        </MessageBar>
      )}

      <div className="upload-section">
        {!filePreview ? (
          <>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="file-upload" className="upload-label">
              <Icon iconName="CloudUpload" className="upload-icon" />
              <span className="upload-text">
                Click or drag & drop to upload your screenshot
              </span>
            </label>
          </>
        ) : (
          <div className="file-preview">
            <img
              src={filePreview}
              alt="Uploaded Screenshot"
              className="preview-image"
            />
            <div className="file-details">
              <Text variant="mediumPlus" className="file-name">
                {file?.name}
              </Text>
              <Icon
                iconName="Cancel"
                className="remove-file-icon"
                onClick={handleRemoveFile}
                title="Remove file"
              />
            </div>
          </div>
        )}
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
          <Spinner label="Processing your screenshot..." />
        </div>
      )}
    </div>
  );
};

export default SelectedFeatureScreenshot;
