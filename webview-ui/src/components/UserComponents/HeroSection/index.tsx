import React, { CSSProperties, FC, MouseEvent } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { HeroSectionProperties } from './HeroSectionProperties';

/**
 * A strict 4-number array for margin/padding usage
 */
type FourNumberArray = [number, number, number, number];

/**
 * Optional border style for the hero section
 */
interface IBorderProps {
  color?: string;
  style?: string;
  width?: number;
}

/**
 * HeroSection component props
 */
interface IHeroSectionProps {
  background?: string;
  textAlign?: 'left' | 'center' | 'right';
  padding?: FourNumberArray;
  margin?: FourNumberArray;
  height?: string;
  width?: string;
  shadow?: number;
  radius?: number;
  border?: IBorderProps;
  children?: React.ReactNode;
}

/**
 * Default values for HeroSection props
 */
const defaultProps: Partial<IHeroSectionProps> = {
  background: '#f5f5f5',
  textAlign: 'left',
  padding: [20, 20, 20, 20],
  margin: [0, 0, 0, 0],
  height: '400px',
  width: '100%',
  shadow: 0,
  radius: 0,
};

/**
 * HeroSection component
 */
export const HeroSection: FC<IHeroSectionProps> & {
  craft: {
    displayName: string;
    props: Partial<IHeroSectionProps>;
    isCanvas: boolean;
    rules: {
      canDrag: (node: Node) => boolean;
      canMove: (node: Node) => boolean;
      canDelete: (node: Node) => boolean;
      canSelect: (node: Node) => boolean;
    };
    related: {
      settings: typeof HeroSectionProperties;
    };
  };
} = (incomingProps) => {
  // Access the Node connectors from Craft.js
  const { connectors } = useNode();

  // Merge incoming props with defaults
  const props = { ...defaultProps, ...incomingProps };

  const {
    background,
    textAlign,
    padding,
    margin,
    height,
    width,
    shadow,
    radius,
    border,
    children,
  } = props;

  // Safe handling for padding/margin
  const safePadding: FourNumberArray = Array.isArray(padding)
    ? padding
    : [20, 20, 20, 20];
  const safeMargin: FourNumberArray = Array.isArray(margin)
    ? margin
    : [0, 0, 0, 0];

  // Compute box-shadow if needed
  const boxShadow =
    shadow && shadow > 0
      ? `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`
      : 'none';

  // Base styling for the HeroSection
  const style: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      textAlign === 'left'
        ? 'flex-start'
        : textAlign === 'right'
        ? 'flex-end'
        : 'center',
    background,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    height,
    width,
    boxShadow,
    borderRadius: `${radius || 0}px`,
    textAlign,
    overflow: 'hidden',
  };

  // Optional border styling
  if (border) {
    style.borderStyle = border.style || 'solid';
    style.borderColor = border.color || '#000';
    style.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  // Handle clicks to avoid undesired selections
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Resizer
      // Safely call connectors.connect if ref is not null
      ref={(ref) => {
        if (ref) {
          connectors.connect(ref);
        }
      }}
      // Allow resizing width/height
      propKey={{ width: 'width', height: 'height' }}
      style={style}
      onClick={handleClick}
    >
      {children}
    </Resizer>
  );
};

/**
 * Craft.js configuration for the HeroSection
 */
HeroSection.craft = {
  displayName: 'HeroSection',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: HeroSectionProperties,
  },
};
