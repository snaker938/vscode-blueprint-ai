// SaveModal.tsx
import React from 'react';
import { useEditor } from '@craftjs/core';
import {
  Modal,
  IconButton,
  PrimaryButton,
  DefaultButton,
  getTheme,
  mergeStyleSets,
  IIconProps,
} from '@fluentui/react';

// 1) Import your combined store and its utility methods:
import {
  getSelectedPageId,
  updatePage,
  saveStoreToLocalStorage,
  clearStoreFromLocalStorage,
} from '../../store/store';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose }) => {
  // 2) Use the Craft.js editor for retrieving the current layout:
  const { query } = useEditor();
  const theme = getTheme();

  // Your styles remain the same...
  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: 15,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${theme.palette.neutralLight}`,
      paddingBottom: 10,
    },
    title: {
      margin: 0,
      fontSize: 20,
      fontWeight: 600,
      color: theme.palette.neutralPrimary,
    },
    body: {
      fontSize: 14,
      lineHeight: 1.5,
      color: theme.palette.neutralSecondary,
    },
    footer: {
      display: 'flex',
      justifyContent: 'center',
      gap: 10,
    },
  });

  const cancelIcon: IIconProps = { iconName: 'Cancel' };

  /**
   * When the user saves:
   * 1) Serialize the current CraftJS state.
   * 2) Update the store for the currently selected page.
   * 3) Save the entire store to localStorage.
   */
  const handleSaveClick = () => {
    // 1) Get CraftJS layout data
    const craftJsLayout = query.serialize();

    // 2) Update the currently selected page in the store
    const selectedPageId = getSelectedPageId();
    updatePage(selectedPageId, { layout: craftJsLayout });

    // 3) Persist to localStorage
    saveStoreToLocalStorage();
    alert('Page layout saved in combined store & persisted to localStorage.');
  };

  /**
   * Clear all store data from localStorage.
   */
  const handleClearClick = () => {
    clearStoreFromLocalStorage();
    alert('Local storage cleared & in-memory store reset.');
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      isBlocking={false}
      styles={{
        main: {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          backgroundColor: theme.palette.white,
          boxShadow: theme.effects.elevation8,
          borderRadius: 4,
          outline: 'none',
          padding: 20,
          maxHeight: '80vh',
          overflowY: 'auto',
        },
      }}
    >
      <div className={contentStyles.container}>
        {/* Header */}
        <div className={contentStyles.header}>
          <h2 className={contentStyles.title}>Save Project</h2>
          <IconButton
            iconProps={cancelIcon}
            ariaLabel="Close modal"
            onClick={onClose}
          />
        </div>
        {/* Body */}
        <div className={contentStyles.body}>
          <p>
            This will store or clear your current page layout and suggested
            pages in one combined store using localStorage for persistence.
          </p>
        </div>
        {/* Footer */}
        <div className={contentStyles.footer}>
          <PrimaryButton onClick={handleSaveClick}>Save Store</PrimaryButton>
          <DefaultButton onClick={handleClearClick}>Clear Store</DefaultButton>
        </div>
      </div>
    </Modal>
  );
};
