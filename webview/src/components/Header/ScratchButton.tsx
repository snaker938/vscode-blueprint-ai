import React from 'react';
import { DefaultButton } from '@fluentui/react';

const ScratchButton: React.FC = () => {
  const handleClick = () => {
    // TODO: Implement sketch functionality
  };

  return <DefaultButton text="Scratch" onClick={handleClick} />;
};

export default ScratchButton;
