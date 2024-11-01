// webview/src/components/Toolbar/UndoButton.tsx

import React from 'react';
import { IconButton } from '@fluentui/react';

const UndoButton: React.FC = () => {
  const handleUndo = () => {
    // TODO: Implement undo functionality
  };

  return (
    <IconButton
      iconProps={{ iconName: 'Undo' }}
      title="Undo"
      ariaLabel="Undo"
      onClick={handleUndo}
    />
  );
};

export default UndoButton;
