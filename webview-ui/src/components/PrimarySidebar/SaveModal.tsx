import React from 'react';
import { useEditor } from '@craftjs/core';
import {
  Modal,
  IconButton,
  PrimaryButton,
  DefaultButton,
  TextField,
  getTheme,
  Stack,
  IIconProps,
  Text,
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
  const { query } = useEditor();
  const theme = getTheme();

  // Grab the serialized JSON from Craft
  const craftJsLayout = query.serialize();

  // Icon for closing the modal
  const cancelIcon: IIconProps = { iconName: 'Cancel' };

  /**
   * Save the Craft state to the store & localStorage
   */
  const handleSaveClick = () => {
    const selectedPageId = getSelectedPageId();
    updatePage(selectedPageId, { layout: craftJsLayout });
    saveStoreToLocalStorage();
    alert('Page layout saved in combined store & persisted to localStorage.');
  };

  /**
   * Clear all store data from localStorage
   */
  const handleClearClick = () => {
    clearStoreFromLocalStorage();
    alert('Local storage cleared & in-memory store reset.');
  };

  /**
   * Copy JSON to clipboard
   */
  const handleCopyJson = () => {
    navigator.clipboard.writeText(craftJsLayout).then(
      () => alert('JSON copied to clipboard!'),
      (err) => console.error('Failed to copy JSON: ', err)
    );
  };

  /**
   * Download JSON as a file
   */
  const handleDownloadJson = () => {
    const blob = new Blob([craftJsLayout], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'page-layout.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onDismiss={onClose}
      isBlocking={false}
      // Styles for the modal container
      styles={{
        main: {
          // Allows the modal to center itself in the viewport
          maxWidth: '700px',
          width: '90%',
          margin: 'auto',
          // Enough space to avoid vertical clipping
          maxHeight: '80vh',
          overflowY: 'auto',
          backgroundColor: theme.palette.white,
          boxShadow: theme.effects.elevation8,
          borderRadius: 4,
          padding: 20,
        },
        // Extra: remove default inner scroll if desired
        scrollableContent: {
          overflowY: 'visible',
        },
      }}
    >
      <Stack tokens={{ childrenGap: 20 }}>
        {/* HEADER */}
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
        >
          <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
            Save Project
          </Text>
          <IconButton
            iconProps={cancelIcon}
            ariaLabel="Close"
            onClick={onClose}
          />
        </Stack>

        {/* BODY */}
        <Stack tokens={{ childrenGap: 10 }}>
          <Text
            variant="medium"
            styles={{
              root: {
                whiteSpace: 'normal',
                wordWrap: 'break-word',
              },
            }}
          >
            Manage your project layout with ease. This interface allows you to
            save your current design configuration to a centralized store using
            localStorage. You can also clear all data to start fresh at any
            time.
          </Text>

          {/* JSON Section */}
          <Stack tokens={{ childrenGap: 10 }}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
            >
              <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
                Page Layout JSON
              </Text>
              <Stack horizontal tokens={{ childrenGap: 8 }}>
                <DefaultButton
                  iconProps={{ iconName: 'Copy' }}
                  onClick={handleCopyJson}
                >
                  Copy JSON
                </DefaultButton>
                <DefaultButton
                  iconProps={{ iconName: 'Download' }}
                  onClick={handleDownloadJson}
                >
                  Download JSON
                </DefaultButton>
              </Stack>
            </Stack>

            <div
              style={{
                maxHeight: 400,
                overflowY: 'auto',
                border: `1px solid ${theme.palette.neutralLight}`,
                padding: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.neutralLighterAlt,
              }}
            >
              <TextField
                value={craftJsLayout}
                readOnly
                multiline
                // Enable manual resizing
                resizable
                // Larger default height
                rows={10}
              />
            </div>
          </Stack>
        </Stack>

        {/* FOOTER */}
        <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 10 }}>
          <PrimaryButton onClick={handleSaveClick}>Save Store</PrimaryButton>
          <DefaultButton onClick={handleClearClick}>Clear Store</DefaultButton>
        </Stack>
      </Stack>
    </Modal>
  );
};
