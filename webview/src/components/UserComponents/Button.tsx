import React from 'react';
import { useNode } from '@craftjs/core';

interface ButtonProps {
  text?: string;
}

export const Button: React.FC<ButtonProps> & { craft?: any } = ({ text }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return <button ref={(ref) => connect(drag(ref))}>{text}</button>;
};

Button.craft = {
  displayName: 'Button',
  props: {
    text: 'Click me',
  },
};
