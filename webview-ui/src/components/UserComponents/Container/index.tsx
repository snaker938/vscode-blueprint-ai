// Container.tsx

import React, { CSSProperties, FC, MouseEvent } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';

type FourNumberArray = [number, number, number, number];

export interface ContainerProps {
  background?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  fillSpace?: 'yes' | 'no';
  width?: string;
  height?: string;
  margin?: FourNumberArray;
  padding?: FourNumberArray;
  shadow?: number;
  radius?: number;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;
  children?: React.ReactNode;
}

const defaultProps: Partial<ContainerProps> = {
  background: '#ffffff',
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',
  fillSpace: 'no',
  width: 'auto',
  height: 'auto',
  margin: [10, 10, 10, 10],
  padding: [20, 20, 20, 20],
  shadow: 5,
  radius: 8,
  borderStyle: 'solid',
  borderColor: '#cccccc',
  borderWidth: 1,
};

export const Container: FC<ContainerProps> & { craft?: any } = (
  incomingProps
) => {
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  const props = { ...defaultProps, ...incomingProps };
  const isRoot = data.custom?.isRootContainer === true;

  const safeMargin: FourNumberArray = Array.isArray(props.margin)
    ? props.margin
    : [0, 0, 0, 0];
  const safePadding: FourNumberArray = Array.isArray(props.padding)
    ? props.padding
    : [0, 0, 0, 0];

  const boxShadow =
    isRoot || !props.shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${props.shadow}px rgba(0,0,0,0.2)`;

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: props.flexDirection,
    alignItems: props.alignItems,
    justifyContent: props.justifyContent,
    background: props.background,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    boxShadow,
    borderRadius: `${props.radius || 0}px`,
    flex: props.fillSpace === 'yes' ? 1 : 'unset',
    width: props.width || 'auto',
    height: props.height || 'auto',
    // Ensure the border + padding stay inside the measured box:
    boxSizing: 'border-box',
    // By default, honor the user-specified border:
    borderStyle: props.borderStyle || 'none',
    borderColor: props.borderColor || 'transparent',
    borderWidth: props.borderWidth ? `${props.borderWidth}px` : '0px',
  };

  if (isRoot) {
    // If you still want a distinct root style, you can just override
    // the same keys rather than assigning containerStyle.border = '...'
    containerStyle.borderStyle = 'solid';
    containerStyle.borderColor = 'rgba(0,0,0,0.2)';
    containerStyle.borderWidth = '2px';
    containerStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
  }

  const dropRef = (ref: HTMLDivElement | null) => {
    if (ref) connectors.connect(ref);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  if (isRoot) {
    return (
      <div style={containerStyle} ref={dropRef}>
        {props.children}
      </div>
    );
  }

  return (
    <Resizer
      ref={(ref) => ref && connectors.connect(ref)}
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
      onClick={handleClick}
    >
      {props.children}
    </Resizer>
  );
};

Container.craft = {
  displayName: 'Container',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrag: (node: Node) => !node.data.custom?.isRootContainer,
    canMove: (node: Node) => !node.data.custom?.isRootContainer,
    canDelete: (node: Node) => !node.data.custom?.isRootContainer,
    canSelect: (node: Node) => !node.data.custom?.isRootContainer,
  },
  related: {
    settings: ContainerProperties,
  },
};
