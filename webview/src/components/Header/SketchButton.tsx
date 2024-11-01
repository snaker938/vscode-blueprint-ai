import React from 'react';
import { DefaultButton } from '@fluentui/react';

const SketchButton: React.FC = () => {
  const handleClick = () => {
    // TODO: Implement sketch functionality
  };

  return <DefaultButton text="Sketch" onClick={handleClick} />;
};

export default SketchButton;
