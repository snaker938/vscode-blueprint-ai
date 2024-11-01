import React from 'react';
import { useNode } from '@craftjs/core';

interface TextboxProps {
  placeholder?: string;
}

export const Textbox: React.FC<TextboxProps> & { craft?: any } = ({
  placeholder,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <input
      type="text"
      ref={(ref) => connect(drag(ref))}
      placeholder={placeholder}
    />
  );
};

Textbox.craft = {
  displayName: 'Textbox',
  props: {
    placeholder: 'Enter text',
  },
};
