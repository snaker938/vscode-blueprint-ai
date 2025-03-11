import React, {
  CSSProperties,
  FC,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';
import { Label, ILabelStyles } from '@fluentui/react';
import { RowProperties } from './RowProperties'; // Create this similarly to "ContainerProperties"

interface IBorderProps {
  colour?: string; // Spelled with lowercase here, can adapt to your naming
  style?: string; // 'solid', 'dashed', etc.
  width?: number; // Border width in pixels
}

interface IRowCustomProps {
  isRootRow?: boolean;
}

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Row component props */
export interface IRowProps {
  background?: string;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  fillSpace?: 'yes' | 'no';
  width?: string;
  height?: string;
  margin?: FourNumberArray;
  padding?: FourNumberArray;
  shadow?: number;
  radius?: number;
  gap?: number; // Additional: space between row items
  children?: React.ReactNode;
  border?: IBorderProps;
  custom?: IRowCustomProps;
}

const defaultProps: Partial<IRowProps> = {
  background: '#ffffff',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  fillSpace: 'no',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  radius: 0,
  width: '100%',
  height: 'auto',
  gap: 0,
};

interface IRowCraft {
  displayName: string;
  props: Partial<IRowProps>;
  isCanvas: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof RowProperties;
  };
}

interface IRow extends FC<IRowProps> {
  craft: IRowCraft;
}

export const Row: IRow = (incomingProps) => {
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  // Combine default and incoming props
  const props: IRowProps = { ...defaultProps, ...incomingProps };

  const isRoot: boolean = data.custom?.isRootRow === true;

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

  const safeMargin: FourNumberArray = Array.isArray(props.margin)
    ? props.margin
    : [0, 0, 0, 0];
  const safePadding: FourNumberArray = Array.isArray(props.padding)
    ? props.padding
    : [0, 0, 0, 0];

  const {
    background,
    alignItems,
    justifyContent,
    fillSpace,
    shadow,
    radius,
    width,
    height,
    border,
    gap,
    children,
  } = props;

  const computedBoxShadow: string =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  // Base styling for a row
  const rowStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row', // Always row
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
    gap: gap ? `${gap}px` : undefined, // spacing between row items
  };

  if (border) {
    rowStyle.borderStyle = border.style || 'solid';
    rowStyle.borderColor = border.colour || '#000000';
    rowStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  if (isRoot) {
    // Distinguish the root row visually
    rowStyle.border = '2px solid rgba(0, 0, 0, 0.2)';
    rowStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
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

  const dropRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  const connectRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  if (isRoot) {
    return (
      <div style={rowStyle} ref={dropRef}>
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </div>
    );
  }

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Resizer
      ref={(ref) => {
        if (ref) connectRef(ref);
      }}
      propKey={{ width: 'width', height: 'height' }}
      style={rowStyle}
      onClick={handleClick}
    >
      {children}
    </Resizer>
  );
};

Row.craft = {
  displayName: 'Row',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrag: (node: Node) => !node.data.custom?.isRootRow,
    canMove: (node: Node) => !node.data.custom?.isRootRow,
    canDelete: (node: Node) => !node.data.custom?.isRootRow,
    canSelect: (node: Node) => !node.data.custom?.isRootRow,
  },
  related: {
    settings: RowProperties,
  },
};
