import React, { useEffect, useState } from 'react';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';
import { useNode } from '@craftjs/core';
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';

// Import the Fluent UI Label
import { Label, ILabelStyles } from '@fluentui/react';

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
  custom?: {
    isRootContainer?: boolean;
  };
};

const defaultProps: Partial<ContainerProps> = {
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
  const props = { ...defaultProps, ...incomingProps };

  // Retrieve custom data from Craft's node.
  const { data } = useNode((node) => ({ data: node.data }));
  const isRoot = data.custom?.isRootContainer === true;

  const [pageName, setPageName] = useState(
    () => getGlobalSelectedPage()?.name ?? 'Untitled Page'
  );

  useEffect(() => {
    const unsub = subscribeSelectedPageChange(() => {
      setPageName(getGlobalSelectedPage()?.name ?? 'Untitled Page');
    });
    return () => unsub();
  }, []);

  // Safely handle color/spacing properties.
  const safeBackground = props.background ?? defaultProps.background!;
  const safeColor = props.color ?? defaultProps.color!;
  const safeMargin = Array.isArray(props.margin)
    ? props.margin
    : defaultProps.margin!;
  const safePadding = Array.isArray(props.padding)
    ? props.padding
    : defaultProps.padding!;

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

  // Non-root containers can keep the user-defined shadow
  const computedBoxShadow =
    isRoot || shadow === 0
      ? 'none'
      : `0px 3px 100px ${shadow}px rgba(0, 0, 0, 0.13)`;

  // Base container style
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent,
    flexDirection: flexDirection as React.CSSProperties['flexDirection'],
    alignItems,
    background: `rgba(${safeBackground.r}, ${safeBackground.g}, ${safeBackground.b}, ${safeBackground.a})`,
    color: `rgba(${safeColor.r}, ${safeColor.g}, ${safeColor.b}, ${safeColor.a})`,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    boxShadow: computedBoxShadow,
    borderRadius: `${radius}px`,
    flex: fillSpace === 'yes' ? 1 : 'unset',
    width,
    height,
  };

  // If it's the root container, add a subtle border & soft shadow
  if (isRoot) {
    containerStyle.border = '1px solid rgba(0, 0, 0, 0.1)';
    containerStyle.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.05)';
  }

  /**
   * Fluent UI Label styles:
   * - Slight offset at top-left
   * - Blueish color (#0078D4 is MS brand)
   * - Double underline for a "neat" stylized effect
   */
  const rootLabelStyles: ILabelStyles = {
    root: {
      position: 'absolute',
      top: '-25px',
      left: '15px',
      color: '#0078D4',
      textDecoration: 'underline double',
      textUnderlineOffset: '3px',
      fontWeight: 'bold',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 10000,
    },
  };

  if (isRoot) {
    return (
      <Resizer
        propKey={{ width: 'width', height: 'height' }}
        style={containerStyle}
      >
        {/* Use a Fluent UI Label for the root container title */}
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </Resizer>
    );
  }

  // For non-root containers
  return (
    <Resizer
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
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

export default Container;
