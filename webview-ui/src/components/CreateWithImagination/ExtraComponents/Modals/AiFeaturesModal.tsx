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
        /* -------------------------------------------------------
           MODAL CONTAINER
        ------------------------------------------------------- */
        .ai-modal-container {
          /* Wider modal, large height */
          width: 80%;
          max-width: 1000px;
          max-height: 90vh;

          /* Centered in viewport */
          margin: 5vh auto;

          /* Rounded corners */
          border-radius: 16px;
          overflow: hidden;

          /* Eye-catching background gradient */
          background: linear-gradient(135deg, #fbc2eb, #a6c1ee);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        /* -------------------------------------------------------
           MODAL CONTENT OVERLAY
        ------------------------------------------------------- */
        .ai-modal-content {
          /* Translucent white overlay for the content area */
          background-color: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(8px);

          display: flex;
          flex-direction: column;
          padding: 30px;
          height: auto; /* let content define height */
        }

        /* -------------------------------------------------------
           HEADER
        ------------------------------------------------------- */
        .ai-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .ai-modal-title {
          font-weight: 800;
          font-size: 28px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        /* Close button styles */
        .ai-modal-close-button {
          color: #7d00c6;
          font-size: 20px;
          transition: color 0.3s ease;
        }
        .ai-modal-close-button:hover {
          color: #3e1a6a;
        }

        /* -------------------------------------------------------
           BODY (VERTICAL SCROLL)
        ------------------------------------------------------- */
        .ai-modal-body {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 60vh;
          padding-right: 10px; /* space for scrollbar */
        }

        /* -------------------------------------------------------
           FEATURE ITEMS
        ------------------------------------------------------- */
        .ai-modal-feature-item {
          /* Force consistent dimensions */
          width: 260px;
          height: 180px;

          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;

          padding: 20px;
          margin: 10px;
          border-radius: 12px;
          background-color: #fff;
          transition: transform 0.2s ease, background-color 0.2s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .ai-modal-feature-item:hover {
          transform: translateY(-2px);
          background-color: #f7f7ff;
        }

        /* Icon in the feature card */
        .ai-modal-feature-icon {
          font-size: 40px;
          color: #7d00c6;
          margin-bottom: 12px;
        }

        /* Title & text in the feature card */
        .ai-modal-feature-title {
          font-weight: 700;
          font-size: 16px;
          color: #333;
          margin-bottom: 6px;
        }
        .ai-modal-feature-description {
          font-size: 14px;
          color: #555;
          line-height: 1.4;
        }
      `}</style>

      <Modal
        isOpen={isOpen}
        onDismiss={onClose}
        isBlocking={false}
        containerClassName="ai-modal-container"
      >
        <div className="ai-modal-content">
          {/* HEADER */}
          <header className="ai-modal-header">
            <Text className="ai-modal-title">Explore AI Features</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel="Close modal"
              onClick={onClose}
              className="ai-modal-close-button"
            />
          </header>

          {/* BODY */}
          <section className="ai-modal-body">
            <Stack
              horizontal
              wrap
              horizontalAlign="center"
              tokens={{ childrenGap: 30 }}
            >
              {/* Feature 1 */}
              <div className="ai-modal-feature-item">
                <Icon iconName="Camera" className="ai-modal-feature-icon" />
                <Text className="ai-modal-feature-title">
                  Screenshot to Design
                </Text>
                <Text className="ai-modal-feature-description">
                  Quickly transform your screenshots into editable designs.
                </Text>
              </div>

              {/* Feature 2 */}
              <div className="ai-modal-feature-item">
                <Icon iconName="TextField" className="ai-modal-feature-icon" />
                <Text className="ai-modal-feature-title">
                  Generate from Text
                </Text>
                <Text className="ai-modal-feature-description">
                  Describe your vision and let AI craft a design tailored for
                  you.
                </Text>
              </div>

              {/* Add more features if needed */}
            </Stack>
          </section>
        </div>
      </Modal>
    </>
  );
};

export default AiFeaturesModal;
