import React, {
  CSSProperties,
  FC,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { GridProperties } from './GridProperties'; // Do NOT provide this file
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';
import { Label, ILabelStyles } from '@fluentui/react';

/** Border properties for the grid */
interface IBorderProps {
  Colour?: string;
  style?: string;
  width?: number;
}

/** Custom data on the grid node */
interface IGridCustomProps {
  /** Mark this node as a root grid to handle it differently */
  isRootGrid?: boolean;
}

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Grid component props */
export interface IGridProps {
  /** Background color for the grid container */
  background?: string;
  /** Number of columns in the grid */
  columns?: number;
  /** Number of rows in the grid */
  rows?: number;
  /** Gap between rows in px */
  rowGap?: number;
  /** Gap between columns in px */
  columnGap?: number;
  /** Horizontal alignment of grid items */
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Vertical alignment of grid items */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Whether the grid container should fill available space */
  fillSpace?: 'yes' | 'no';
  /** Explicit width of the grid container */
  width?: string;
  /** Explicit height of the grid container */
  height?: string;
  /** Margin (top, right, bottom, left) */
  margin?: FourNumberArray;
  /** Padding (top, right, bottom, left) */
  padding?: FourNumberArray;
  /** Shadow intensity */
  shadow?: number;
  /** Border radius */
  radius?: number;
  /** Border details */
  border?: IBorderProps;
  /** Any nested children */
  children?: React.ReactNode;
  /** Custom data for the grid node */
  custom?: IGridCustomProps;
}

/** Default values for the Grid props */
const defaultProps: Partial<IGridProps> = {
  background: '#ffffff',
  columns: 2,
  rows: 2,
  rowGap: 10,
  columnGap: 10,
  justifyItems: 'stretch',
  alignItems: 'stretch',
  fillSpace: 'no',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  radius: 0,
  width: '400px',
  height: '200px',
};

/**
 * Extend FC with a "craft" property signature
 * so we can define Grid.craft without TS errors.
 */
interface IGridCraft {
  displayName: string;
  props: Partial<IGridProps>;
  isCanvas: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof GridProperties;
  };
}

/** Grid component type with a "craft" static field */
interface IGrid extends FC<IGridProps> {
  craft: IGridCraft;
}

/**
 * Grid component for layout within Craft.js.
 */
export const Grid: IGrid = (incomingProps) => {
  // Access node data from Craft.js
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  // Merge defaultProps with incoming
  const props: IGridProps = { ...defaultProps, ...incomingProps };

  // Detect if this node is a "root" grid
  const isRoot: boolean = data.custom?.isRootGrid === true;

  // Subscribe to page name changes
  const [pageName, setPageName] = useState<string>(
    () => getGlobalSelectedPage()?.name ?? 'Untitled Page'
  );

  useEffect(() => {
    const unsub = subscribeSelectedPageChange(() => {
      const newPageName = getGlobalSelectedPage()?.name ?? 'Untitled Page';
      setPageName(newPageName);
    });
    return () => {
      unsub();
    };
  }, []);

  // Ensure margin/padding is a 4-number array
  const safeMargin: FourNumberArray = Array.isArray(props.margin)
    ? props.margin
    : [0, 0, 0, 0];
  const safePadding: FourNumberArray = Array.isArray(props.padding)
    ? props.padding
    : [0, 0, 0, 0];

  // Extract relevant props
  const {
    background,
    columns,
    rows,
    rowGap,
    columnGap,
    justifyItems,
    alignItems,
    fillSpace,
    shadow,
    radius,
    width,
    height,
    border,
    children,
  } = props;

  // Compute a box-shadow unless this is the root grid or shadow is 0
  const computedBoxShadow: string =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  // Base grid styling
  const gridStyle: CSSProperties = {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, auto)`,
    gap: `${rowGap}px ${columnGap}px`,
    justifyItems,
    alignItems,
    background,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    boxShadow: computedBoxShadow,
    borderRadius: `${radius || 0}px`,
    flex: fillSpace === 'yes' ? 1 : 'unset',
    width: width || 'auto',
    height: height || 'auto',
  };

  // Optional border styling
  if (border) {
    gridStyle.borderStyle = border.style || 'solid';
    gridStyle.borderColor = border.Colour || '#000000';
    gridStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  // Root grid styling
  if (isRoot) {
    gridStyle.border = '2px solid rgba(0, 0, 0, 0.2)';
    gridStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
  }

  // Styles for the root label
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

  // Connect the grid to Craft
  const dropRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  // For non-root grids, we still want Resizer + droppability
  const connectRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  // Root grids are not selectable or resizable
  if (isRoot) {
    return (
      <div style={gridStyle} ref={dropRef}>
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </div>
    );
  }

  // Handle clicks on non-root grids
  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  // Non-root grids are selectable & resizable
  return (
    <Resizer
      ref={(ref) => {
        if (ref) connectRef(ref);
      }}
      propKey={{ width: 'width', height: 'height' }}
      style={gridStyle}
      onClick={handleClick}
    >
      {children}
    </Resizer>
  );
};

/**
 * Craft.js configuration for selection/draggability
 * and marking the Grid as a "Canvas" node to allow children.
 */
Grid.craft = {
  displayName: 'Grid',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrag: (node: Node) => !node.data.custom?.isRootGrid,
    canMove: (node: Node) => !node.data.custom?.isRootGrid,
    canDelete: (node: Node) => !node.data.custom?.isRootGrid,
    canSelect: (node: Node) => !node.data.custom?.isRootGrid,
  },
  related: {
    settings: GridProperties,
  },
};
