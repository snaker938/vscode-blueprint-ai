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
 */
export type ContainerProps = {
  /** A string like "#ffffff" or "rgba(...)" for background color */
  background?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  fillSpace?: 'yes' | 'no';
  /** e.g. "300px", "150px", "auto", "50%", etc. */
  width?: string;
  height?: string;
  /** margin/padding arrays: [top, right, bottom, left] in px */
  margin?: number[];
  padding?: number[];
  /** Box-shadow & corner radius */
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

/**
 * Default settings for a container.
 * Notice we use pixel-based defaults for width/height so it doesn't
 * automatically fill the entire space. The user can override with percentages if desired.
 */
const defaultProps: Partial<ContainerProps> = {
  background: '#ffffff',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  radius: 0,
  /** Default to a medium rectangular container size */
  width: '300px',
  height: '150px',
};

export const Container = (incomingProps: ContainerProps) => {
  const props = { ...defaultProps, ...incomingProps };

  const {
    connectors: { connect },
    data,
  } = useNode((node: Node) => ({
    data: node.data,
  }));

  // Check if this container is designated as root
  const isRoot = data.custom?.isRootContainer === true;

  // For page naming display if it's root
  const [pageName, setPageName] = useState(
    () => getGlobalSelectedPage()?.name ?? 'Untitled Page'
  );

  useEffect(() => {
    const unsub = subscribeSelectedPageChange(() => {
      setPageName(getGlobalSelectedPage()?.name ?? 'Untitled Page');
    });
    return () => unsub();
  }, []);

  // Safely pull out margin/padding arrays
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

  // If shadow is set, create a box-shadow. If root, use a simpler style
  const computedBoxShadow =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  // Main container style
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection,
    alignItems,
    justifyContent,
    background,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    boxShadow: computedBoxShadow,
    borderRadius: `${radius || 0}px`,
    flex: fillSpace === 'yes' ? 1 : 'unset',
    width: width || 'auto',
    height: height || 'auto',
  };

  // Optional border handling
  if (border) {
    containerStyle.borderStyle = border.style || 'solid';
    containerStyle.borderColor = border.Colour || '#000000';
    containerStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  // If it's root, override with a special border & shadow
  if (isRoot) {
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

  // Root container: pointer-events disabled on main, but re-enabled on a child div
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

  // Non-root containers are resizable & selectable
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
    // Disallow dragging if it's a root container
    canDrag: (node: Node) => !node.data.custom?.isRootContainer,
  },
  related: {
    settings: ContainerProperties,
  },
};

export default Container;
