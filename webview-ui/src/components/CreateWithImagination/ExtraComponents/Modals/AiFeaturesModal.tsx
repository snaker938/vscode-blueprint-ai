import React from 'react';
import { Modal, Stack, Text, Icon, IconButton } from '@fluentui/react';

interface AiFeaturesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AiFeaturesModal: React.FC<AiFeaturesModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <>
      <style>{`
        .ai-modal-container {
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          margin: 0 auto;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff, #f9f9ff);
          border-radius: 12px;
          box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.15);
          overflow-y: auto;
        }
        .ai-modal-content {
          display: flex;
          flex-direction: column;
        }
        .ai-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 15px;
          border-bottom: 2px solid #ececec;
          margin-bottom: 20px;
        }
        .ai-modal-title {
          font-weight: 700;
          color: #333333;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .ai-modal-close-button {
          color: #5c2d91;
          font-size: 20px;
          transition: color 0.2s;
        }
        .ai-modal-close-button:hover {
          color: #3e1a6a;
        }
        .ai-modal-body {
          padding-top: 10px;
        }
        .ai-modal-feature-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          border-radius: 10px;
          background-color: #fafafa;
          transition: transform 0.2s, background-color 0.2s;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          min-width: 220px;
          margin: 10px;
        }
        .ai-modal-feature-item:hover {
          transform: scale(1.02);
          background-color: #f0f0ff;
        }
        .ai-modal-feature-icon {
          font-size: 48px;
          color: #5c2d91;
          margin-right: 15px;
        }
        .ai-modal-feature-text {
          display: flex;
          flex-direction: column;
        }
        .ai-modal-feature-title {
          font-weight: 600;
          color: #333333;
          margin-bottom: 5px;
        }
        .ai-modal-feature-description {
          color: #666666;
          line-height: 1.5;
        }
      `}</style>
      <Modal
        isOpen={isOpen}
        onDismiss={onClose}
        isBlocking={false}
        containerClassName="ai-modal-container"
      >
        <div className="ai-modal-content">
          <header className="ai-modal-header">
            <Text variant="xLarge" className="ai-modal-title">
              Explore AI Features
            </Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel="Close modal"
              onClick={onClose}
              className="ai-modal-close-button"
            />
          </header>

          <section className="ai-modal-body">
            <Stack
              horizontal
              wrap
              horizontalAlign="center"
              tokens={{ childrenGap: 30 }}
            >
              <div className="ai-modal-feature-item">
                <Icon iconName="Camera" className="ai-modal-feature-icon" />
                <div className="ai-modal-feature-text">
                  <Text variant="large" className="ai-modal-feature-title">
                    Screenshot to Design
                  </Text>
                  <Text
                    variant="small"
                    className="ai-modal-feature-description"
                  >
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
                  <Text
                    variant="small"
                    className="ai-modal-feature-description"
                  >
                    Describe your vision and let AI craft a design tailored for
                    you.
                  </Text>
                </div>
              </div>

              {/* Additional features can be added here */}
            </Stack>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default AiFeaturesModal;
