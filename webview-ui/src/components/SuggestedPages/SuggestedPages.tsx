// components/SuggestedPages/SuggestedPages.tsx

import React, { useState, useEffect } from 'react';
import { Modal, IconButton, PrimaryButton } from '@fluentui/react';
import { getSuggestedPages } from '../PrimarySidebar/PagesTab/suggestedPageStore';
import './SuggestedPages.css';

interface SuggestedPagesProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuggestedPages: React.FC<SuggestedPagesProps> = ({ isOpen, onClose }) => {
  const pages = getSuggestedPages();
  const [selectedPage, setSelectedPage] = useState('');
  const [hasConfirmed, setHasConfirmed] = useState(false);

  // Whenever the modal is opened (isOpen goes from false -> true),
  // reset the states so it starts fresh each time.
  useEffect(() => {
    if (isOpen) {
      setSelectedPage('');
      setHasConfirmed(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (!selectedPage) return;
    setHasConfirmed(true);
  };

  return (
    <Modal isOpen={isOpen} onDismiss={onClose} isBlocking={false}>
      <div className="suggested-pages-modal">
        <div className="suggested-pages-header">
          <h2 className="suggested-pages-title">
            {hasConfirmed
              ? 'TODO: PROMPT & SCREENSHOT AI SCREEN'
              : 'Suggested Pages'}
          </h2>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            title="Close"
            ariaLabel="Close"
            onClick={onClose}
            className="suggested-pages-close"
          />
        </div>

        {!hasConfirmed && (
          <div className="suggested-pages-body">
            <p className="suggested-pages-subtitle">
              Perhaps develop one of these pages next:
            </p>
            <div className="pages-list">
              {pages.map((pageName) => (
                <label key={pageName} className="page-option">
                  <input
                    type="radio"
                    name="suggestedPage"
                    value={pageName}
                    checked={selectedPage === pageName}
                    onChange={() => setSelectedPage(pageName)}
                  />
                  <span className="page-option-name">{pageName}</span>
                </label>
              ))}
            </div>

            <div className="suggested-pages-footer">
              <PrimaryButton
                text="Confirm"
                onClick={handleConfirm}
                disabled={!selectedPage}
              />
            </div>
          </div>
        )}

        {hasConfirmed && (
          <div className="suggested-pages-todo-body">
            {/* This screen is empty except for the title above, 
                but you can expand as needed. */}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SuggestedPages;
