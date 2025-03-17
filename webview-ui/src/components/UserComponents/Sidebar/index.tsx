import { CSSProperties, FC, useState } from 'react';
import { useNode } from '@craftjs/core';
import { SidebarProperties } from './SidebarProperties';

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Border properties for the Sidebar */
interface ISidebarBorder {
  color?: string;
  style?: string;
  width?: number;
}

/** Sidebar component props */
export interface ISidebarProps {
  /** Sidebar background color (CSS value) */
  background?: string;

  /**
   * If `collapsible` is false, the sidebar uses `width`.
   * If `collapsible` is true, it toggles between `collapsedWidth` and `expandedWidth`.
   */
  width?: string;

  /** The height of the sidebar, e.g., "100%" */
  height?: string;

  /** Margin in the format [top, right, bottom, left] */
  margin?: FourNumberArray;

  /** Padding in the format [top, right, bottom, left] */
  padding?: FourNumberArray;

  /** Border style object */
  border?: ISidebarBorder;

  /** If true, the sidebar can collapse/expand */
  collapsible?: boolean;

  /** The width when the sidebar is collapsed (only used if `collapsible` = true) */
  collapsedWidth?: string;

  /** The width when the sidebar is expanded (only used if `collapsible` = true) */
  expandedWidth?: string;

  /**
   * A list of nav item labels (e.g. page names) to render.
   * (No child elements or sub-components)
   */
  navItems?: string[];
}

/** Default values for Sidebar props */
const defaultProps: Partial<ISidebarProps> = {
  background: '#f1f1f1',
  collapsible: true,
  collapsedWidth: '60px',
  expandedWidth: '250px',
  width: '200px',
  height: '100%',
  margin: [0, 0, 0, 0],
  padding: [10, 10, 10, 10],
  navItems: ['Home', 'About', 'Contact'], // Example default nav items
};

/**
 * Extend FC with a "craft" property signature
 * so we can define Sidebar.craft without TS errors.
 */
interface ISidebarCraft {
  displayName: string;
  props: Partial<ISidebarProps>;
  isCanvas: boolean;
  rules: {
    canDrag: () => boolean;
    canMove: () => boolean;
    canDelete: () => boolean;
    canSelect: () => boolean;
  };
  related: {
    settings: typeof SidebarProperties;
  };
}

/** Sidebar component type with a "craft" static field */
interface ISidebar extends FC<ISidebarProps> {
  craft: ISidebarCraft;
}

/**
 * A purely navigational Sidebar component.
 * Renders a list of items (pages) and supports optional collapse/expand.
 */
export const Sidebar: ISidebar = (incomingProps) => {
  const { connectors } = useNode(() => ({}));

  // Merge defaultProps with incoming
  const props: ISidebarProps = { ...defaultProps, ...incomingProps };
  const {
    background,
    width,
    height,
    margin,
    padding,
    border,
    collapsible,
    collapsedWidth,
    expandedWidth,
    navItems,
  } = props;

  // Local state to track whether the sidebar is collapsed
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Determine the final width
  const finalWidth = collapsible
    ? isCollapsed
      ? collapsedWidth
      : expandedWidth
    : width;

  // Compute styling
  const containerStyle: CSSProperties = {
    position: 'relative',
    background,
    width: finalWidth,
    height,
    boxSizing: 'border-box',
    margin: margin
      ? `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`
      : undefined,
    padding: padding
      ? `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`
      : undefined,
    transition: 'width 0.3s ease',
    overflow: 'auto',
  };

  // Apply border styling if present
  if (border) {
    containerStyle.borderStyle = border.style || 'solid';
    containerStyle.borderColor = border.color || '#000000';
    containerStyle.borderWidth = border.width ? `${border.width}px` : '0px';
  }

  return (
    <div ref={(ref) => ref && connectors.connect(ref)} style={containerStyle}>
      {/* Optional collapse/expand toggle */}
      {collapsible && (
        <button
          type="button"
          onClick={() => setIsCollapsed((prev) => !prev)}
          style={{
            position: 'absolute',
            top: '10px',
            right: '-20px',
            width: '20px',
            height: '20px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            background: '#fff',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {isCollapsed ? '>' : '<'}
        </button>
      )}

      {/* Nav Items */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: collapsible ? '40px' : 0, // leave space for the toggle button
        }}
      >
        {navItems?.map((item) => (
          <a
            key={item}
            href="#"
            style={{
              display: 'block',
              textDecoration: 'none',
              color: '#333',
              padding: '5px 10px',
              borderRadius: '4px',
              background: '#fff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  );
};

/**
 * Craft.js config: Not a Canvas node (no children).
 * Enabling selection & drag within the Craft.js editor.
 */
Sidebar.craft = {
  displayName: 'Sidebar',
  props: defaultProps,
  // Since it doesn't allow children, set isCanvas: false
  isCanvas: false,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: SidebarProperties,
  },
};
