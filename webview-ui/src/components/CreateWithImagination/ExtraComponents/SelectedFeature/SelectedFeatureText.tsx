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
import { getVsCodeApi } from './utils/vscodeApi';

import './SelectedFeatureText.css';

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
      // 1) Send the request to the VS Code extension
      const vsCodeApi = getVsCodeApi();
      if (!vsCodeApi) {
        console.error(
          'VS Code API not available. Are you running inside VS Code?'
        );
        return;
      }

      // Post to extension with `command: 'blueprintAI.generateLayout'`
      vsCodeApi.postMessage({
        command: 'blueprintAI.generateLayout',
        payload: {
          userText: textValue,
          // If `uploadedImage` is an array of bytes, pass it directly;
          // otherwise, convert it to an array of bytes.
          arrayBuffer: uploadedImage || [],
        },
      });

      // 2) Wait for the extension to send back `command: 'blueprintAI.result'`
      const rawCodeSnippet = await new Promise<string>((resolve, reject) => {
        function handleMessage(event: MessageEvent) {
          const message = event.data;
          // Make sure we only catch the correct response
          if (message.command === 'blueprintAI.result') {
            window.removeEventListener('message', handleMessage);

            if (message.payload?.error) {
              // If the extension sent an error
              reject(new Error(message.payload.error));
            } else {
              // The extension is currently sending `layoutJson`;
              // rename it or treat it as your "code snippet"
              resolve(message.payload.layoutJson);
            }
          }
        }
        window.addEventListener('message', handleMessage);
      });

      console.log('Received code snippet:', rawCodeSnippet);

      // 3) Clean up the snippet if necessary
      // Example snippet-cleaning steps (optional, adapt as needed):
      let cleanedSnippet = rawCodeSnippet;

      // Remove everything before "const"
      const constIndex = cleanedSnippet.indexOf('const');
      if (constIndex !== -1) {
        cleanedSnippet = cleanedSnippet.substring(constIndex);
      }

      const match = cleanedSnippet.match(/const\s+([A-Za-z0-9_]+)/);
      let componentName = 'MyGeneratedComponent';
      if (match && match[1]) {
        componentName = match[1];
      }

      // Remove any colon if present (e.g. `const AmazonBlueprint:`)
      cleanedSnippet = cleanedSnippet.replace(
        new RegExp(`const\\s+${componentName}\\s*:`),
        `const ${componentName} =`
      );

      // Remove everything after `export default Xyz;`
      const defaultExportLine = `export default ${componentName};`;
      const exportIndex = cleanedSnippet.indexOf(defaultExportLine);
      if (exportIndex !== -1) {
        cleanedSnippet = cleanedSnippet.substring(
          0,
          exportIndex + defaultExportLine.length
        );
      }

      // 4) Store the final snippet
      const returnedComponentString = cleanedSnippet;

      // 5) Dynamically create & register the component
      const generatedComponent = createCustomComponent(returnedComponentString);
      registerCustomComponent(componentName, generatedComponent);

      // 6) Load the existing layout JSON
      const pageId = getSelectedPageId();
      const page = getSelectedPage();
      const layoutJson = page?.layout ? JSON.parse(page.layout) : {};

      // 7) Insert the new node in your layout
      if (layoutJson.ROOT) {
        const newNodeId = `${componentName}_Node_${Date.now()}`;

        layoutJson[newNodeId] = {
          type: { resolvedName: componentName },
          isCanvas: false,
          props: {},
          displayName: componentName,
          hidden: false,
          parent: 'ROOT',
          nodes: [],
          linkedNodes: {},
        };

        if (!layoutJson.ROOT.nodes) {
          layoutJson.ROOT.nodes = [];
        }
        layoutJson.ROOT.nodes.push(newNodeId);
      }

      // 8) Save updated layout back to the store
      updatePage(pageId, { layout: JSON.stringify(layoutJson) });

      // 9) Navigate away after a short delay
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
