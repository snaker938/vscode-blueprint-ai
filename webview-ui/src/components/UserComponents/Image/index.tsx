import React from 'react';
import { useNode } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ImageProperties } from './ImageProperties';
// Import the placeholder image
import placeholderSrc from './PlaceholderImage.png';

interface IImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  margin?: [number, number, number, number];
  padding?: [number, number, number, number];
  shadow?: number;
  borderRadius?: number;
  border?: string;
  children?: React.ReactNode;
}

const defaultProps: IImageProps = {
  src: '',
  alt: '',
  width: '300px',
  height: '200px',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  borderRadius: 0,
  border: 'none',
};

export const Image: React.FC<IImageProps> & { craft?: any } = (props) => {
  const {
    src = '',
    alt,
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
  } = useNode(); // get CraftJS connectors for this node

  // Fallback to the placeholder if src is empty
  const effectiveSrc = src || placeholderSrc;

  // Style for the resizable container (excluding margin, which is applied to outer wrapper)
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
        {/* Inner container to hold the image and children */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: borderRadius ? `${borderRadius}px` : undefined,
            overflow: 'hidden',
          }}
        >
          <img
            src={effectiveSrc}
            alt={alt || ''}
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              // Use 'fill' to stretch the image, ignoring aspect ratio
              objectFit: 'fill',
            }}
          />
          {/* Child elements overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {children}
          </div>
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
    settings: ImageProperties,
  },
};
