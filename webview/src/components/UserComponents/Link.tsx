import React from 'react';
import { useNode } from '@craftjs/core';

interface LinkProps {
  href?: string;
  text?: string;
}

export const LinkComponent: React.FC<LinkProps> & { craft?: any } = ({
  href,
  text,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <a
      href={href}
      ref={(ref) => connect(drag(ref))}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </a>
  );
};

LinkComponent.craft = {
  displayName: 'Link',
  props: {
    href: '#',
    text: 'Click here',
  },
};
