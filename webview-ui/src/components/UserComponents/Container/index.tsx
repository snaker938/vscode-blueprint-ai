import React, { useEffect, useState } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';

import { Label, ILabelStyles } from '@fluentui/react';

export type ContainerProps = {
  background?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  fillSpace?: 'yes' | 'no';
  width?: string;
  height?: string;
  margin?: number[];
  padding?: number[];
  shadow?: number;
  radius?: number;
  children?: React.ReactNode;
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
  background: '#ffffff',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  radius: 0,
  width: '300px',
  height: '150px',
};

export const Container = (incomingProps: ContainerProps) => {
  const props = { ...defaultProps, ...incomingProps };
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  const dropRef = (ref: HTMLElement | null) => {
    if (!ref) return;
    (connectors as any).drop?.(ref);
  };

  const connectRef = (ref: HTMLElement | null) => {
    if (!ref) return;
    connectors.connect(ref);
  };

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

  const computedBoxShadow =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

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

  if (border) {
    containerStyle.borderStyle = border.style || 'solid';
    containerStyle.borderColor = border.Colour || '#000000';
    containerStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

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
      fontWeight: 'bold',
      pointerEvents: 'none',
      zIndex: 10000,
    },
  };

  if (isRoot) {
    return (
      <div style={containerStyle} ref={dropRef}>
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </div>
    );
  }

  return (
    <Resizer
      ref={(ref) => {
        if (ref) {
          connectRef(ref);
        }
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
    canDrag: (node: Node) => {
      const isRoot = !!node.data.custom?.isRootContainer;
      return !isRoot;
    },
    canMove: (node: Node) => {
      const isRoot = !!node.data.custom?.isRootContainer;
      return !isRoot;
    },
    canDelete: (node: Node) => {
      const isRoot = !!node.data.custom?.isRootContainer;
      return !isRoot;
    },
    canSelect: (node: Node) => {
      const isRoot = !!node.data.custom?.isRootContainer;
      return !isRoot;
    },
  },
  related: {
    settings: ContainerProperties,
  },
};
