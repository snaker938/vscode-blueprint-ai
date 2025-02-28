import React from 'react';
import { useNode, Node } from '@craftjs/core';

/**
 * A helper type so we can attach the `craft` property
 * to our functional component without TypeScript errors.
 */
type CraftFC<P = object> = React.FC<P> & { craft?: any };

interface ContainerProps {
  background?: string;
  padding?: number;
  width?: string | number;
  height?: string | number;
  children?: React.ReactNode;
  /**
   * If true, node cannot be deleted.
   */
  isRootContainer?: boolean;
}

const Container: CraftFC<ContainerProps> = ({
  background,
  padding,
  width,
  height,
  children,
  // We don't need to use isRootContainer in the component,
  // Used to apply special styling to root containers
  isRootContainer = false,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      style={{
        background: background || '#fff',
        padding: padding || 0,
        border: isRootContainer ? '2px solid #3a85ff' : '1px solid #ccc',
        width: width || '800px',
        height: height || '600px',
        boxSizing: 'border-box',
        position: 'relative',
        ...(isRootContainer && {
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.15)',
        }),
      }}
    >
      {isRootContainer && (
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            left: '5px',
            fontSize: '12px',
            color: '#3a85ff',
          }}
        >
          Root Container
        </div>
      )}
      {children}
    </div>
  );
};

Container.craft = {
  displayName: 'Container',
  rules: {
    canDelete: (node: Node) => {
      if (node.data.props.isRootContainer) {
        return false;
      }
      return true;
    },
  },
};

export { Container };
