import React from 'react';
import { IconButton } from '@fluentui/react';

const ExportButton: React.FC = () => {
  const handleExport = () => {
    // TODO: Implement export functionality
  };

  return (
    <IconButton
      iconProps={{ iconName: 'Export' }}
      title="Export"
      ariaLabel="Export"
      onClick={handleExport}
    />
  );
};

export default ExportButton;
