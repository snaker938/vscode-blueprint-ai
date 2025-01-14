import React, { CSSProperties } from 'react';
import { ContainerSettings } from './ContainerSettings';
import { Resizer } from '../Resizer';

/**
 * We allow either the standard CSS flex directions or any other string fallback.
 */
type FlexDir = CSSProperties['flexDirection'] | string;

/**
 * Props for the Container component
 */
export interface ContainerProps {
  background?: Record<'r' | 'g' | 'b' | 'a', number>;
  color?: Record<'r' | 'g' | 'b' | 'a', number>;
  flexDirection?: FlexDir;
  alignItems?: string;
  justifyContent?: string;
  fillSpace?: string;
  width?: string;
  height?: string;
  padding?: string[];
  margin?: string[];
  marginTop?: number;
  marginLeft?: number;
  marginBottom?: number;
  marginRight?: number;
  shadow?: number;
  radius?: number;
  children?: React.ReactNode;
}

/**
 * Default, fully populated ContainerProps
 */
const defaultProps: Required<ContainerProps> = {
  background: { r: 255, g: 255, b: 255, a: 1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  width: '100%',
  height: 'auto',
  padding: ['0', '0', '0', '0'],
  margin: ['0', '0', '0', '0'],
  marginTop: 0,
  marginLeft: 0,
  marginBottom: 0,
  marginRight: 0,
  shadow: 0,
  radius: 0,
  children: null,
};

/**
 * Extend React.FC so we can attach Container.craft
 */
interface ContainerComponent extends React.FC<Partial<ContainerProps>> {
  craft?: any;
}

/**
 * Container
 * A flexible container with adjustable width/height (via Resizer),
 * plus background/color, margin, padding, etc.
 */
const Container: ContainerComponent = (props) => {
  // Merge user props with defaults
  const mergedProps: Required<ContainerProps> = {
    ...defaultProps,
    ...props,
    background: props.background ?? defaultProps.background,
    color: props.color ?? defaultProps.color,
    padding: props.padding ?? defaultProps.padding,
    margin: props.margin ?? defaultProps.margin,
  };

  const {
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    background,
    color,
    padding,
    margin,
    shadow,
    radius,
    width,
    height,
    children,
  } = mergedProps;

  // Convert {r,g,b,a} => array for easy `rgba(...)` usage:
  const bgValues = Object.values(background);
  const colorValues = Object.values(color);

  return (
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      style={{
        // `flexDirection` can be any string or valid FlexDirection
        flexDirection: flexDirection as CSSProperties['flexDirection'],
        alignItems,
        justifyContent,
        background: `rgba(${bgValues.join(',')})`,
        color: `rgba(${colorValues.join(',')})`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        boxShadow:
          shadow === 0
            ? 'none'
            : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`,
        borderRadius: `${radius}px`,
        flex: fillSpace === 'yes' ? 1 : 'unset',
        width,
        height,
      }}
    >
      {children}
    </Resizer>
  );
};

// Attach the Craft metadata
Container.craft = {
  displayName: 'Container',
  props: defaultProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    toolbar: ContainerSettings,
  },
};

export { Container };
