import React, { useEffect, useState } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';
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

  if (isRoot) {
    // Emphasized root container border & shadow
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

  // Root container: pointerEvents="none" to prevent selection/clicks,
  // but an inner div re-enables pointer events for dropping children.
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

  // Non-root containers remain resizable + selectable
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
    // typed node parameter
    canDrag: (node: Node) => !node.data.custom?.isRootContainer,
  },
  related: {
    settings: ContainerProperties,
  },
};

export default Container;
