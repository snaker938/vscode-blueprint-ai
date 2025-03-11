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

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose }) => {
  const { query } = useEditor();
  const theme = getTheme();

  const contentStyles = mergeStyleSets({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: 15, // space between sections
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

  const handleSaveToLocalStorage = () => {
    const json = query.serialize();
    localStorage.setItem('craftjs-data', json);
    alert('Data saved to local storage.');
  };

  const handleClearLocalStorage = () => {
    localStorage.removeItem('craftjs-data');
    alert('Local storage cleared.');
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
          width: 600, // Increased width to provide more space for content
          backgroundColor: theme.palette.white,
          boxShadow: theme.effects.elevation8,
          borderRadius: 4,
          outline: 'none',
          padding: 20,
          maxHeight: '80vh', // Prevents the modal from growing too tall
          overflowY: 'auto', // Enables vertical scrolling if needed
        },
      }}
    >
      <div className={contentStyles.container}>
        <div className={contentStyles.header}>
          <h2 className={contentStyles.title}>Save Project</h2>
          <IconButton
            iconProps={cancelIcon}
            ariaLabel="Close modal"
            onClick={onClose}
          />
        </div>
        <div className={contentStyles.body}>
          <p>
            Save your current state to local storage or delete any existing
            saved state.
          </p>
        </div>
        <div className={contentStyles.footer}>
          <PrimaryButton onClick={handleSaveToLocalStorage}>
            Save to Local Storage
          </PrimaryButton>
          <DefaultButton onClick={handleClearLocalStorage}>
            Delete Local Save
          </DefaultButton>
        </div>
      </div>
    </Modal>
  );
};
