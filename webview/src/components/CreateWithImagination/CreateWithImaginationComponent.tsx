// CreateWithImaginationComponent.tsx

import React, { useState } from 'react';
import {
  TextField,
  Stack,
  Text,
  IconButton,
  Modal,
  Icon,
} from '@fluentui/react';
import './CreateWithImaginationComponent.css';

const CreateWithImagination: React.FC = () => {
  const [isAIFeaturesModalOpen, setIsAIFeaturesModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState('text'); // 'text', 'screenshot', 'sketch'

  const openAIFeaturesModal = () => setIsAIFeaturesModalOpen(true);
  const closeAIFeaturesModal = () => setIsAIFeaturesModalOpen(false);

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const handleFeatureClick = (feature: string) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="create-with-imagination-container">
      <Stack tokens={{ childrenGap: 20 }} horizontalAlign="center">
        <Text variant="xxLarge" className="header-text">
          Hey! How can I help?
        </Text>
        <Text variant="mediumPlus" className="subheader-text">
          Ask Blueprint AI anything, or try our suggested features.
        </Text>

        {/* Suggested Features */}
        <Stack
          horizontal
          tokens={{ childrenGap: 20 }}
          className="suggested-features"
        >
          <Stack
            horizontalAlign="center"
            className={`feature-item ${
              selectedFeature === 'screenshot' ? 'selected-feature' : ''
            }`}
            onClick={() => handleFeatureClick('screenshot')}
          >
            <Icon iconName="Camera" className="feature-icon" />
            <Text>Convert a screenshot to a design</Text>
          </Stack>
          <Stack
            horizontalAlign="center"
            className={`feature-item ${
              selectedFeature === 'text' ? 'selected-feature' : ''
            }`}
            onClick={() => handleFeatureClick('text')}
          >
            <Icon iconName="TextField" className="feature-icon" />
            <Text>Generate a design from text</Text>
          </Stack>
          <Stack
            horizontalAlign="center"
            className={`feature-item ${
              selectedFeature === 'sketch' ? 'selected-feature' : ''
            }`}
            onClick={() => handleFeatureClick('sketch')}
          >
            <Icon iconName="Design" className="feature-icon" />
            <Text>Convert a sketch to a design</Text>
          </Stack>
        </Stack>

        {selectedFeature === 'text' && (
          <>
            {/* Description Text */}
            <Text variant="mediumPlus" className="description-text">
              Enter a description of your website...
            </Text>

            {/* Input Box */}
            <div className="input-box-container">
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
                    onClick={openAIFeaturesModal}
                    className="icon-button ai-features-button"
                    title="AI features"
                  />
                  <IconButton
                    iconProps={{ iconName: 'Camera' }}
                    onClick={openImageModal}
                    className="icon-button"
                    title="Upload image"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedFeature === 'screenshot' && (
          <div className="feature-content">
            <Text variant="mediumPlus">
              Upload a screenshot to convert into a design.
            </Text>
            {/* Additional components for uploading a screenshot */}
          </div>
        )}

        {selectedFeature === 'sketch' && (
          <div className="feature-content">
            <Text variant="mediumPlus">
              Upload a sketch to convert into a design.
            </Text>
            {/* Additional components for uploading a sketch */}
          </div>
        )}
      </Stack>

      {/* AI Features Modal */}
      <Modal
        isOpen={isAIFeaturesModalOpen}
        onDismiss={closeAIFeaturesModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <div className="modal-header">
          <Text variant="xLarge">AI Features</Text>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={closeAIFeaturesModal}
          />
        </div>
        <div className="modal-body">
          {/* Improved UI for AI Features Modal */}
          <Stack tokens={{ childrenGap: 20 }}>
            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              verticalAlign="center"
              className="modal-feature-item"
            >
              <Icon iconName="Camera" className="modal-feature-icon" />
              <Text variant="large">Convert a screenshot to a design</Text>
            </Stack>
            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              verticalAlign="center"
              className="modal-feature-item"
            >
              <Icon iconName="TextField" className="modal-feature-icon" />
              <Text variant="large">Generate a design from text</Text>
            </Stack>
            <Stack
              horizontal
              tokens={{ childrenGap: 10 }}
              verticalAlign="center"
              className="modal-feature-item"
            >
              <Icon iconName="Design" className="modal-feature-icon" />
              <Text variant="large">Convert a sketch to a design</Text>
            </Stack>
          </Stack>
        </div>
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onDismiss={closeImageModal}
        isBlocking={false}
        containerClassName="modal-container"
      >
        <div className="modal-header">
          <Text variant="xLarge">Image Modal</Text>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel="Close popup modal"
            onClick={closeImageModal}
          />
        </div>
        <div className="modal-body">
          <Text>Image button modal</Text>
        </div>
      </Modal>
    </div>
  );
};

export default CreateWithImagination;
