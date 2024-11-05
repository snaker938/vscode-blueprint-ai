import React, { useState } from 'react';
import {
  TextField,
  Stack,
  Text,
  IconButton,
  Modal,
  Icon,
  DefaultButton,
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
      <Stack tokens={{ childrenGap: 15 }} horizontalAlign="center">
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
                <div className="ai-features" onClick={openAIFeaturesModal}>
                  <Icon iconName="Robot" className="ai-icon" />
                  <Text>AI features</Text>
                </div>
                <div className="separator-vertical" />
                <IconButton
                  iconProps={{ iconName: 'Camera' }}
                  onClick={openImageModal}
                  className="icon-button"
                />
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
          <Stack tokens={{ childrenGap: 20 }}>
            <Stack horizontalAlign="center" className="modal-feature-item">
              <Icon iconName="Camera" className="feature-icon" />
              <Text>Convert a screenshot to a design</Text>
              <DefaultButton
                text="Try it out"
                onClick={() => handleFeatureClick('screenshot')}
              />
            </Stack>
            <Stack horizontalAlign="center" className="modal-feature-item">
              <Icon iconName="TextField" className="feature-icon" />
              <Text>Generate a design from text</Text>
              <DefaultButton
                text="Try it out"
                onClick={() => handleFeatureClick('text')}
              />
            </Stack>
            <Stack horizontalAlign="center" className="modal-feature-item">
              <Icon iconName="Design" className="feature-icon" />
              <Text>Convert a sketch to a design</Text>
              <DefaultButton
                text="Try it out"
                onClick={() => handleFeatureClick('sketch')}
              />
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
