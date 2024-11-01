import React from 'react';
import { useNode } from '@craftjs/core';

interface HeadingProps {
  text?: string;
}

export const Heading: React.FC<HeadingProps> & { craft?: any } = ({ text }) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return <h2 ref={(ref) => connect(drag(ref))}>{text}</h2>;
};

Heading.craft = {
  displayName: 'Heading',
  props: {
    text: 'Heading Text',
  },
};
