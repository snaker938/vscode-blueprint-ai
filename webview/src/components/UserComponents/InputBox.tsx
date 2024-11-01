import React from 'react';
import { useNode } from '@craftjs/core';

interface InputBoxProps {
  placeholder?: string;
}

export const InputBox: React.FC<InputBoxProps> & { craft?: any } = ({
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

InputBox.craft = {
  displayName: 'Input Box',
  props: {
    placeholder: 'Enter text here...',
  },
};
