// AiImagesModal.tsx

import React from 'react';
import { Modal, Spinner } from '@fluentui/react';

interface AiImagesModalProps {
  /**
   * Callback when user clicks "Yes".
   */
  onYes: () => void;
  /**
   * Callback when user clicks "No".
   */
  onNo: () => void;
  /**
   * Whether the component is currently generating images.
   */
  isGenerating: boolean;
  /**
   * Whether the modal is open.
   */
  isOpen: boolean;
  /**
   * Called when the modal is dismissed (e.g. clicking outside or pressing escape).
   */
  onDismiss: () => void;
}

export const AiImagesModal: React.FC<AiImagesModalProps> = ({
  onYes,
  onNo,
  isGenerating,
  isOpen,
  onDismiss,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onDismiss}
      isBlocking
      styles={{
        main: {
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          maxWidth: '450px',
          margin: 'auto',
        },
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>
            Load AI Images
          </h2>
        </div>

        {!isGenerating ? (
          <>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1rem',
                color: '#605e5c',
              }}
            >
              Would you like to load images using AI? This may take a few
              seconds.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '20px',
              }}
            >
              <button
                onClick={onYes}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#0078d4',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                Yes
              </button>
              <button
                onClick={onNo}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#f3f2f1',
                  color: '#323130',
                  border: '1px solid #c8c6c4',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                No
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <Spinner label="Generating images... Please wait." />
          </div>
        )}
      </div>
    </Modal>
  );
};
