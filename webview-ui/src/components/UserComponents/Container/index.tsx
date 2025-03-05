import React from 'react';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';

export type ContainerProps = {
  background: Record<'r' | 'g' | 'b' | 'a', number>;
  color: Record<'r' | 'g' | 'b' | 'a', number>;
  flexDirection: string;
  alignItems: string;
  justifyContent: string;
  fillSpace: string;
  width: string;
  height: string;
  padding: string[];
  margin: string[];
  marginTop: number;
  marginLeft: number;
  marginBottom: number;
  marginRight: number;
  shadow: number;
  radius: number;
  children?: React.ReactNode;
};

const defaultProps = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  padding: ['0', '0', '0', '0'],
  margin: ['0', '0', '0', '0'],
  background: { r: 255, g: 255, b: 255, a: 1 },
  color: { r: 0, g: 0, b: 0, a: 1 },
  shadow: 0,
  radius: 0,
  width: '100%',
  height: 'auto',
};

export const Container = (incomingProps: Partial<ContainerProps>) => {
  // Merge defaults with incoming props
  const props = { ...defaultProps, ...incomingProps };

  // Safely fall back for arrays/objects
  const safeBackground = props.background || defaultProps.background;
  const safeColor = props.color || defaultProps.color;
  const safeMargin = Array.isArray(props.margin)
    ? props.margin
    : defaultProps.margin;
  const safePadding = Array.isArray(props.padding)
    ? props.padding
    : defaultProps.padding;

  const {
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    shadow,
    radius,
    width,
    height,
    children,
  } = props;

  return (
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      style={{
        display: 'flex',
        justifyContent,
        flexDirection,
        alignItems,
        background: `rgba(${Object.values(safeBackground)})`,
        color: `rgba(${Object.values(safeColor)})`,
        padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
        margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
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

Container.craft = {
  displayName: 'Container',
  props: defaultProps,
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: ContainerProperties,
  },
};
