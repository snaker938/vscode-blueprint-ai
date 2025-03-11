import React, {
  CSSProperties,
  FC,
  MouseEvent,
  useEffect,
  useState,
} from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { SectionProperties } from './SectionProperties'; // <-- You'll need your own properties panel
import {
  getGlobalSelectedPage,
  subscribeSelectedPageChange,
} from '../../PrimarySidebar/PagesTab/pageStore';
import { Label, ILabelStyles } from '@fluentui/react';

/** Border props for the Section */
interface IBorderProps {
  Colour?: string;
  style?: string;
  width?: number;
}

/** Custom data on the Section node */
interface ISectionCustomProps {
  isRootSection?: boolean;
}

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Section component props */
export interface ISectionProps {
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
  custom?: ISectionCustomProps;
}

/** Default values for Section props */
const defaultProps: Partial<ISectionProps> = {
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
 * so we can define Section.craft without TS errors.
 */
interface ISectionCraft {
  displayName: string;
  props: Partial<ISectionProps>;
  isCanvas: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof SectionProperties;
  };
}

/** Section component type with a "craft" static field */
interface ISection extends FC<ISectionProps> {
  craft: ISectionCraft;
}

/**
 * Section component for layout & grouping within Craft.js.
 */
export const Section: ISection = (incomingProps) => {
  // Access node data from Craft.js
  const { connectors, data } = useNode((node: Node) => ({
    data: node.data,
  }));

  // Merge defaultProps with incoming
  const props: ISectionProps = { ...defaultProps, ...incomingProps };

  // Determine if this node is a "root" Section
  const isRoot: boolean = data.custom?.isRootSection === true;

  // Subscribe to page name changes (only really used if isRoot, but safe to keep)
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

  // Compute a box-shadow unless this is the root section or shadow is 0
  const computedBoxShadow: string =
    isRoot || !shadow
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  // Base styling for the Section
  const sectionStyle: CSSProperties = {
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
    sectionStyle.borderStyle = border.style || 'solid';
    sectionStyle.borderColor = border.Colour || '#000000';
    sectionStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  // Root section styling
  if (isRoot) {
    sectionStyle.border = '2px solid rgba(0, 0, 0, 0.2)';
    sectionStyle.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.07)';
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

  // Connect the Section to Craft
  const dropRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  // Non-root sections are selectable & resizable
  const connectRef = (ref: HTMLDivElement | null): void => {
    if (!ref) return;
    connectors.connect(ref);
  };

  // If this is a root section, we skip resizers & user selection
  if (isRoot) {
    return (
      <div style={sectionStyle} ref={dropRef}>
        <Label styles={rootLabelStyles}>{pageName}</Label>
        {children}
      </div>
    );
  }

  // Handle clicks on non-root sections
  const handleClick = (e: MouseEvent<HTMLDivElement>): void => {
    e.stopPropagation();
  };

  // Non-root sections get Resizer + droppability
  return (
    <Resizer
      ref={(ref) => {
        if (ref) connectRef(ref);
      }}
      propKey={{ width: 'width', height: 'height' }}
      style={sectionStyle}
      onClick={handleClick}
    >
      {children}
    </Resizer>
  );
};

/**
 * Craft.js configuration for selection/draggability
 * and marking the Section as a "Canvas" node to allow children.
 */
Section.craft = {
  displayName: 'Section',
  props: defaultProps,
  isCanvas: true,
  rules: {
    canDrag: (node: Node) => !node.data.custom?.isRootSection,
    canMove: (node: Node) => !node.data.custom?.isRootSection,
    canDelete: (node: Node) => !node.data.custom?.isRootSection,
    canSelect: (node: Node) => !node.data.custom?.isRootSection,
  },
  related: {
    settings: SectionProperties,
  },
};
