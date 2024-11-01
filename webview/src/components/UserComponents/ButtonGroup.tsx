import React from 'react';
import { useNode } from '@craftjs/core';

interface ButtonGroupProps {
  buttons?: string[];
}

export const ButtonGroup: React.FC<ButtonGroupProps> & { craft?: any } = ({
  buttons,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{ display: 'flex', gap: '8px' }}
    >
      {buttons?.map((buttonText, index) => (
        <button key={index}>{buttonText}</button>
      ))}
    </div>
  );
};

ButtonGroup.craft = {
  displayName: 'Button Group',
  props: {
    buttons: ['Button 1', 'Button 2'],
  },
};
