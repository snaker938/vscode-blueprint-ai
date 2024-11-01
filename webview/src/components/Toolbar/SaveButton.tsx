import React from 'react';
import { IconButton } from '@fluentui/react';

const SaveButton: React.FC = () => {
  const handleSave = () => {
    // TODO: Implement undo functionality
  };

  return (
    <IconButton
      iconProps={{ iconName: 'Save' }}
      title="Save"
      ariaLabel="Save"
      onClick={handleSave}
    />
  );
};

export default SaveButton;
