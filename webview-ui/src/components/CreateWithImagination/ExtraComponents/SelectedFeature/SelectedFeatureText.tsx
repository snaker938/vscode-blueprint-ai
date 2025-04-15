// SelectedFeatureText.tsx

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

import returnedComponentString from './CustomComponentString';
import { createCustomComponent } from '../../../AiComponentGeneration/CreateCustomComponent';
import { useBlueprintContext } from '../../../../store/useBlueprintContext';
import {
  getSelectedPage,
  getSelectedPageId,
  updatePage,
} from '../../../../store/store';
// import { getSelectedPage, updatePage } from '../../../../store/store';

interface SelectedFeatureTextProps {
  openModal?: () => void;
}

const robotIcon: IIconProps = { iconName: 'Robot' };
const pictureIcon: IIconProps = { iconName: 'Picture' };

const SelectedFeatureText: React.FC<SelectedFeatureTextProps> = ({
  openModal,
}) => {
  // User-entered text prompt
  const [textValue, setTextValue] = useState<string>('');

  // Image file & local preview
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Loading indicator
  const [loading, setLoading] = useState<boolean>(false);

  // Access your context and the setter to store the compiled component
  const { registerCustomComponent } = useBlueprintContext();

  // React Router navigation
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

  const handleGenerateClick = async () => {
    if (!textValue && !uploadedImage) {
      alert('Please enter text or select an image first.');
      return;
    }

    setLoading(true);
    try {
      // 1) Create & register the component
      const generatedComponent = createCustomComponent(returnedComponentString);
      const customName = 'MyGeneratedCmp';
      registerCustomComponent(customName, generatedComponent);

      // 2) Load the existing layout JSON
      const pageId = getSelectedPageId();
      const page = getSelectedPage();
      const layoutJson = page && page.layout ? JSON.parse(page.layout) : {};

      // 3) Insert a new node under layoutJson.ROOT
      if (layoutJson.ROOT) {
        const newNodeId = 'MyGeneratedCmpNode_' + Date.now(); // unique ID

        // The new node is stored directly at layoutJson[newNodeId]
        layoutJson[newNodeId] = {
          type: { resolvedName: customName },
          isCanvas: false,
          props: {},
          displayName: customName,
          hidden: false,
          parent: 'ROOT',
          // Use "nodes" instead of "children" here
          nodes: [],
          linkedNodes: {},
        };

        // Then reference it in ROOT.nodes (not ROOT.children)
        if (!layoutJson.ROOT.nodes) {
          layoutJson.ROOT.nodes = [];
        }
        layoutJson.ROOT.nodes.push(newNodeId);
      }

      // 4) Save updated layout back to the store
      updatePage(pageId, { layout: JSON.stringify(layoutJson) });

      // 5) Navigate away after a short delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate('/editing');
    } catch (err) {
      console.error('Failed to create custom component:', err);
    } finally {
      setLoading(false);
    }
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
          <IconButton
            className="remove-image-button"
            iconProps={{ iconName: 'ChromeClose' }}
            onClick={removeImage}
            ariaLabel="Remove image"
          />
        </div>
      )}

      {/* User text input */}
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

      {/* Feature buttons */}
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

      {/* Generate layout button */}
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
