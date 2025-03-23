// Container.tsx

import React, { CSSProperties, FC, MouseEvent } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';

/** A 4-number tuple representing top, right, bottom, left in px */
type FourNumberArray = [number, number, number, number];

/** Border styling props */
export interface IBorderProps {
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
}

/**
 * Primary layout choices:
 * - 'container': Basic flex container (the original Container behavior)
 * - 'row':       A row-based flex container
 * - 'section':   A section (also a flex container, but conceptually used for large layout blocks)
 * - 'grid':      A CSS grid container
 */
type LayoutType = 'container' | 'row' | 'section' | 'grid';

export interface ContainerProps {
  /** Which layout style this container should use */
  layoutType?: LayoutType;

  /** Common background color */
  background?: string;

  /** Whether to fill available space in the parent container */
  fillSpace?: 'yes' | 'no';

  /** Explicit width (e.g. 'auto', '100%', '400px') */
  width?: string;

  /** Explicit height (e.g. 'auto', '100%', '300px') */
  height?: string;

  /** Margin around the container: [top, right, bottom, left] in px */
  margin?: FourNumberArray;

  /** Padding within the container: [top, right, bottom, left] in px */
  padding?: FourNumberArray;

  /** Shadow intensity (0 = no shadow) */
  shadow?: number;

  /** Border radius in px */
  radius?: number;

  /** Border configuration */
  border?: IBorderProps;

  /** Nested children */
  children?: React.ReactNode;

  /**
   * --- Props primarily relevant for 'container' and 'section' layouts ---
   * (though 'row' also leverages alignItems/justifyContent in practice)
   */
  flexDirection?: 'row' | 'column';
  alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch'
    // For Grid usage, some folks prefer 'start'/'end' vs. 'flex-start'/'flex-end':
    | 'start'
    | 'end';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';

  /**
   * --- Props primarily relevant for 'row' layout ---
   */
  gap?: number;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /**
   * --- Props primarily relevant for 'grid' layout ---
   */
  columns?: number;
  rows?: number;
  rowGap?: number;
  columnGap?: number;
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  // For clarity, keep a distinct name here to avoid confusion with "alignItems" from flex:
  alignGridItems?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * Default property values for all layout types.
 * (You can tweak these as needed or break them into separate defaults if desired.)
 */
const defaultProps: Partial<ContainerProps> = {
  layoutType: 'container',

  // Common
  background: '#ffffff',
  fillSpace: 'no',
  width: 'auto',
  height: 'auto',
  margin: [10, 10, 10, 10],
  padding: [20, 20, 20, 20],
  shadow: 5,
  radius: 8,
  border: {
    borderStyle: 'solid',
    borderColor: '#cccccc',
    borderWidth: 1,
  },

  // Container/Section defaults
  flexDirection: 'row',
  alignItems: 'flex-start',
  justifyContent: 'center',

  // Row layout defaults
  gap: 0,
  flexWrap: 'nowrap',

  // Grid layout defaults
  columns: 2,
  rows: 2,
  rowGap: 10,
  columnGap: 10,
  justifyItems: 'stretch',
  alignGridItems: 'stretch',
};

export const Container: FC<ContainerProps> & { craft?: any } = (
  incomingProps
) => {
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  // Merge with defaults
  const props = { ...defaultProps, ...incomingProps };

  const isRoot = data.custom?.isRootContainer === true;

  // Safely handle margin & padding arrays
  const safeMargin: FourNumberArray = Array.isArray(props.margin)
    ? props.margin
    : [0, 0, 0, 0];
  const safePadding: FourNumberArray = Array.isArray(props.padding)
    ? props.padding
    : [0, 0, 0, 0];

  // Box shadow logic
  const boxShadow =
    isRoot || !props.shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${props.shadow}px rgba(0,0,0,0.2)`;

  // Base container style (common to all)
  const containerStyle: CSSProperties = {
    position: 'relative',
    background: props.background,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    boxShadow,
    borderRadius: `${props.radius || 0}px`,
    flex: props.fillSpace === 'yes' ? 1 : 'unset',
    width: props.width || 'auto',
    height: props.height || 'auto',
    boxSizing: 'border-box',
    borderStyle: props.border?.borderStyle || 'none',
    borderColor: props.border?.borderColor || 'transparent',
    borderWidth: props.border?.borderWidth
      ? `${props.border.borderWidth}px`
      : '0px',
  };

  // Apply layout-specific styling:
  switch (props.layoutType) {
    case 'row':
      // Row -> display: flex, flexDirection: row
      containerStyle.display = 'flex';
      containerStyle.flexDirection = 'row';
      containerStyle.alignItems =
        props.alignItems as CSSProperties['alignItems'];
      containerStyle.justifyContent =
        props.justifyContent as CSSProperties['justifyContent'];
      if (props.gap) {
        containerStyle.gap = `${props.gap}px`;
      }
      containerStyle.flexWrap = props.flexWrap;
      break;

    case 'section':
      // Section -> basically a flexible block
      containerStyle.display = 'flex';
      containerStyle.flexDirection = props.flexDirection;
      containerStyle.alignItems =
        props.alignItems as CSSProperties['alignItems'];
      containerStyle.justifyContent =
        props.justifyContent as CSSProperties['justifyContent'];
      break;

    case 'grid':
      // Grid -> display: grid
      containerStyle.display = 'grid';
      containerStyle.gridTemplateColumns = `repeat(${props.columns}, 1fr)`;
      containerStyle.gridTemplateRows = `repeat(${props.rows}, 1fr)`;
      containerStyle.rowGap = `${props.rowGap}px`;
      containerStyle.columnGap = `${props.columnGap}px`;
      if (props.justifyItems) {
        containerStyle.justifyItems = props.justifyItems;
      }
      if (props.alignGridItems) {
        containerStyle.alignItems = props.alignGridItems;
      }
      break;

    default:
      // 'container' (the original default flex container)
      containerStyle.display = 'flex';
      containerStyle.flexDirection = props.flexDirection;
      containerStyle.alignItems =
        props.alignItems as CSSProperties['alignItems'];
      containerStyle.justifyContent =
        props.justifyContent as CSSProperties['justifyContent'];
      break;
  }

  // Root container styling overrides
  if (isRoot) {
    containerStyle.borderStyle = 'solid';
    containerStyle.borderColor = 'rgba(0,0,0,0.2)';
    containerStyle.borderWidth = '2px';
    containerStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
  }

  const dropRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      connectors.connect(ref);
    }
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  // If root, just return a plain <div> (no Resizer handles)
  if (isRoot) {
    return (
      <div style={containerStyle} ref={dropRef}>
        {props.children}
      </div>
    );
  }

  // Otherwise, wrap in Resizer (so user can drag to resize width/height)
  return (
    <Resizer
      ref={(ref) => ref && connectors.connect(ref)}
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
      onClick={handleClick}
    >
      {props.children}
    </Resizer>
  );
};

Container.craft = {
  displayName: 'Container',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrag: (node: Node) => !node.data.custom?.isRootContainer,
    canMove: (node: Node) => !node.data.custom?.isRootContainer,
    canDelete: (node: Node) => !node.data.custom?.isRootContainer,
    canSelect: (node: Node) => !node.data.custom?.isRootContainer,
  },
  related: {
    settings: ContainerProperties,
  },
};
