import React from 'react';
import { IconButton } from '@fluentui/react';

const RedoButton: React.FC = () => {
  const handleRedo = () => {
    // TODO: Implement redo functionality
  };

  return (
    <IconButton
      iconProps={{ iconName: 'Redo' }}
      title="Redo"
      ariaLabel="Redo"
      onClick={handleRedo}
    />
  );
};

export default RedoButton;
