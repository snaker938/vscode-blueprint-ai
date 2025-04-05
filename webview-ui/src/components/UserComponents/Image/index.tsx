// Image/index.tsx

import React from 'react';
import { useNode } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { SimpleProperties } from './ImageProperties';

/**
 * Minimal props (no image-related properties anymore).
 */
interface BoxProps {
  width?: string;
  height?: string;
  margin?: [number, number, number, number];
  padding?: [number, number, number, number];
  shadow?: number;
  borderRadius?: number;
  border?: string;
  children?: React.ReactNode;
}

/**
 * Default props for our simple box.
 */
const defaultProps: BoxProps = {
  width: '300px',
  height: '200px',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  borderRadius: 0,
  border: 'none',
};

/**
 * A simple "Box" component (formerly "Image") that no longer handles images.
 */
export const Image: React.FC<BoxProps> & { craft?: any } = (props) => {
  const {
    width,
    height,
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    shadow = 0,
    borderRadius = 0,
    border = 'none',
    children,
  } = props;

  const {
    connectors: { connect, drag },
  } = useNode();

  // Style for the resizable container (excluding margin)
  const containerStyle: React.CSSProperties = {
    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
    boxShadow:
      shadow && shadow !== 0
        ? `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`
        : 'none',
    borderRadius: borderRadius ? `${borderRadius}px` : undefined,
    border: border || 'none',
    width,
    height,
  };

  // Outer margin style
  const marginStyle: React.CSSProperties = {
    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
  };

  return (
    <div ref={(ref) => ref && connect(drag(ref))} style={marginStyle}>
      <Resizer
        propKey={{ width: 'width', height: 'height' }}
        style={containerStyle}
      >
        {/* Simple container div that can hold children */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            borderRadius: borderRadius ? `${borderRadius}px` : undefined,
          }}
        >
          {children}
        </div>
      </Resizer>
    </div>
  );
};

Image.craft = {
  displayName: 'Image',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrop: () => true,
  },
  related: {
    settings: SimpleProperties, // <-- The new properties panel
  },
};
