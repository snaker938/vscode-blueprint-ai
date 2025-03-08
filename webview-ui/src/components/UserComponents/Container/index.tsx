import React, { useEffect, useState } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';

import { Label, ILabelStyles } from '@fluentui/react';

/**
 * ContainerProps for our Container component.
 * Removed the TextColour property (previously `Colour?`).
 */
export type ContainerProps = {
  /** A string like "#ffffff" or "rgba(...)" for background color */
  background?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  fillSpace?: 'yes' | 'no';
  /** e.g. "100%", "auto", "300px", etc. */
  width?: string;
  height?: string;
  /** margin/padding arrays: [top, right, bottom, left] in px */
  margin?: number[];
  padding?: number[];
  /** Box-shadow & radius */
  shadow?: number;
  radius?: number;
  children?: React.ReactNode;
  /** Optional border object with color, style, and width */
  border?: {
    Colour?: string;
    style?: string;
    width?: number;
  };
  custom?: {
    isRootContainer?: boolean;
  };
};

const defaultProps: Partial<ContainerProps> = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  background: '#ffffff',
  shadow: 0,
  radius: 0,
  width: '100%',
  height: 'auto',
};

export const Container = (incomingProps: ContainerProps) => {
  const props = { ...defaultProps, ...incomingProps };

  const {
    connectors: { connect },
    data,
  } = useNode((node: Node) => ({
    data: node.data,
  }));

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

  // Pull out numeric arrays for margin/padding
  const safeMargin = Array.isArray(props.margin) ? props.margin : [0, 0, 0, 0];
  const safePadding = Array.isArray(props.padding)
    ? props.padding
    : [0, 0, 0, 0];

  const {
    background,
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    shadow,
    radius,
    width,
    height,
    border,
    children,
  } = props;

  // If there's a shadow set, use a subtle box-shadow.
  // If it's the root container, override the shadow for a simpler style.
  const computedBoxShadow =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  // Build the main container style
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection,
    alignItems,
    justifyContent,
    background: background,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    boxShadow: computedBoxShadow,
    borderRadius: `${radius || 0}px`,
    flex: fillSpace === 'yes' ? 1 : 'unset',
    width: width || 'auto',
    height: height || 'auto',
  };

  // Handle border if defined
  if (border) {
    containerStyle.borderStyle = border.style || 'solid';
    containerStyle.borderColor = border.Colour || '#000000';
    containerStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  if (isRoot) {
    // A special style for the root container
    containerStyle.border = '2px solid rgba(0, 0, 0, 0.2)';
    containerStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
  }

  const rootLabelStyles: ILabelStyles = {
    root: {
      position: 'absolute',
      top: '-30px',
      left: '15px',
      color: '#0078D4',
      display: 'inline-block',
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: 10000,
      whiteSpace: 'nowrap',
      selectors: {
        ':before': {
          content: "''",
          position: 'absolute',
          width: '50%',
          height: '2px',
          backgroundColor: '#0078D4',
          bottom: '-5px',
          left: 0,
        },
        ':after': {
          content: "''",
          position: 'absolute',
          width: '100%',
          height: '2px',
          backgroundColor: '#0078D4',
          bottom: '-2px',
          left: 0,
        },
      },
    },
  };

  // For the root container, we wrap the actual content in a pointer-enabled DIV
  if (isRoot) {
    return (
      <div style={{ ...containerStyle, pointerEvents: 'none' }}>
        <Label styles={rootLabelStyles}>{pageName}</Label>
        <div
          style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}
          ref={(ref) => {
            if (ref) connect(ref);
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  // Otherwise, render a resizable container
  return (
    <Resizer
      ref={(ref) => {
        if (ref) connect(ref);
      }}
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
    // Allow dragging unless it is a root container
    canDrag: (node: Node) => !node.data.custom?.isRootContainer,
  },
  related: {
    settings: ContainerProperties,
  },
};

export default Container;
