import React, { useEffect, useState } from 'react';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';
import { useNode } from '@craftjs/core';
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';

// Fluent UI Label
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

  // Retrieve custom data from Craft's node
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

  // Safely handle color/spacing
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

  // Non-root containers can keep user-defined shadow
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

  // Make the root container's border more noticeable + subtle shadow
  if (isRoot) {
    containerStyle.border = '2px solid rgba(0, 0, 0, 0.2)';
    containerStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
  }

  /**
   * Fluent UI Label styles for the root container title:
   * We use pseudo-elements to create two underscoring lines:
   * - A line at full width
   * - A second line at half width, slightly below the first
   */
  const rootLabelStyles: ILabelStyles = {
    root: {
      position: 'absolute',
      // Slightly higher offset so the lines remain above the container
      top: '-30px',
      left: '15px',
      color: '#0078D4',
      display: 'inline-block',
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: 10000,
      whiteSpace: 'nowrap',

      // Pseudo-element lines
      selectors: {
        ':before': {
          content: "''",
          position: 'absolute',
          width: '50%',
          height: '2px',
          backgroundColor: '#0078D4',
          bottom: '-5px', // further from the text
          left: 0,
        },
        ':after': {
          content: "''",
          position: 'absolute',
          width: '100%',
          height: '2px',
          backgroundColor: '#0078D4',
          bottom: '-2px', // closer to the text
          left: 0,
        },
      },
    },
  };

  // Root container: add label plus children
  if (isRoot) {
    return (
      <Resizer
        propKey={{ width: 'width', height: 'height' }}
        style={containerStyle}
      >
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </Resizer>
    );
  }

  // Non-root container
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
