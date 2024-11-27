import React from 'react';
import { Modal, Stack, Text, Icon, IconButton } from '@fluentui/react';
import './AiFeaturesModal.css';

interface AiFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiFeaturesModal: React.FC<AiFeaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      isBlocking={false}
      containerClassName="ai-modal-container"
    >
      <div className="ai-modal-header">
        <Text variant="xLarge" className="ai-modal-title">
          Explore AI Features
        </Text>
        <IconButton
          iconProps={{ iconName: 'Cancel' }}
          ariaLabel="Close popup modal"
          onClick={onClose}
          className="ai-modal-close-button"
        />
      </div>
      <div className="ai-modal-body">
        <Stack tokens={{ childrenGap: 20 }}>
          <div className="ai-modal-feature-item">
            <Icon iconName="Camera" className="ai-modal-feature-icon" />
            <div className="ai-modal-feature-text">
              <Text variant="large" className="ai-modal-feature-title">
                Screenshot to Design
              </Text>
              <Text variant="small">
                Quickly transform your screenshots into editable designs.
              </Text>
            </div>
          </div>
          <div className="ai-modal-feature-item">
            <Icon iconName="TextField" className="ai-modal-feature-icon" />
            <div className="ai-modal-feature-text">
              <Text variant="large" className="ai-modal-feature-title">
                Generate from Text
              </Text>
              <Text variant="small">
                Simply describe your vision, and AI will create a design
                tailored to your input.
              </Text>
            </div>
          </div>
          <div className="ai-modal-feature-item">
            <Icon iconName="EditNote" className="ai-modal-feature-icon" />
            <div className="ai-modal-feature-text">
              <Text variant="large" className="ai-modal-feature-title">
                Sketch to Design
              </Text>
              <Text variant="small">
                Upload a hand-drawn sketch and watch it transform into a
                professional-grade design.
              </Text>
            </div>
          </div>
        </Stack>
      </div>
    </Modal>
  );
};

export default AiFeaturesModal;
