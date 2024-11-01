import React from 'react';
import { useNode } from '@craftjs/core';

interface ContainerProps {
  background?: string;
  padding?: number;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> & { craft?: any } = ({
  background,
  padding,
  children,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        background,
        padding: `${padding}px`,
        minHeight: '20px',
      }}
    >
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  props: {
    background: '#ffffff',
    padding: 20,
  },
  rules: {
    canMoveIn: (incomingNodes: any) => true,
  },
};
