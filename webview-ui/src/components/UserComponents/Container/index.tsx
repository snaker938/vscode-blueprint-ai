import React, {
  CSSProperties,
  FC,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { ContainerProperties } from './ContainerProperties';
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';
import { Label, ILabelStyles } from '@fluentui/react';

/** Border props for the container */
interface IBorderProps {
  Colour?: string;
  style?: string;
  width?: number;
}

/** Custom data on the container node */
interface IContainerCustomProps {
  isRootContainer?: boolean;
}

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Container component props */
export interface IContainerProps {
  background?: string;
  flexDirection?: 'row' | 'column';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  fillSpace?: 'yes' | 'no';
  width?: string;
  height?: string;
  margin?: FourNumberArray;
  padding?: FourNumberArray;
  shadow?: number;
  radius?: number;
  children?: React.ReactNode;
  border?: IBorderProps;
  custom?: IContainerCustomProps;
}

/** Default values for Container props */
const defaultProps: Partial<IContainerProps> = {
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

/**
 * Extend FC with a "craft" property signature
 * so we can define Container.craft without TS errors.
 */
interface IContainerCraft {
  displayName: string;
  props: Partial<IContainerProps>;
  isCanvas: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof ContainerProperties;
  };
}

/** Container component type with a "craft" static field */
interface IContainer extends FC<IContainerProps> {
  craft: IContainerCraft;
}

/**
 * Container component for layout & grouping within Craft.js.
 */
export const Container: IContainer = (incomingProps) => {
  // Access node data from Craft.js (excluding unused 'id')
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  // Merge defaultProps with incoming
  const props: IContainerProps = { ...defaultProps, ...incomingProps };

  // Detect if this node is a "root" container
  const isRoot: boolean = data.custom?.isRootContainer === true;

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

  // Compute a box-shadow unless this is the root container or shadow is 0
  const computedBoxShadow: string =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  // Base styling
  const containerStyle: CSSProperties = {
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

  // Optional border styling
  if (border) {
    containerStyle.borderStyle = border.style || 'solid';
    containerStyle.borderColor = border.Colour || '#000000';
    containerStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  // Root container styling
  if (isRoot) {
    containerStyle.border = '2px solid rgba(0, 0, 0, 0.2)';
    containerStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
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

  // Connect the container to Craft
  const dropRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    // “connect” makes this DOM node droppable (and draggable if needed)
    connectors.connect(ref);
  };

  // For non-root containers, we still want Resizer + droppability
  const connectRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  // Root containers are not selectable or resizable
  if (isRoot) {
    return (
      <div style={containerStyle} ref={dropRef}>
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </div>
    );
  }

  // Handle clicks on non-root containers
  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  // Non-root containers are selectable & resizable
  return (
    <Resizer
      ref={(ref) => {
        if (ref) connectRef(ref);
      }}
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
      onClick={handleClick}
    >
      {children}
    </Resizer>
  );
};

/**
 * Craft.js configuration for selection/draggability
 * and marking the Container as a "Canvas" node to allow children.
 */
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
