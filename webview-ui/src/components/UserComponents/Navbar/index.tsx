/** Link/index.tsx */

import React, { CSSProperties, FC, MouseEvent } from 'react';
import { useNode } from '@craftjs/core';
import { NavbarProperties } from './NavbarProperties';

/**
 * Props for the Navbar component
 */
export interface INavbarProps {
  /** Background color of the navbar */
  background?: string;

  /** Brand or logo text */
  brandName?: string;

  /** Inline style object for the brand text (e.g. custom font, color) */
  brandStyle?: CSSProperties;

  /** Navigation items to display (e.g. 'Home', 'About', 'Contact') */
  navItems?: string[];

  /** Padding for the navbar [top, right, bottom, left] */
  padding?: [number, number, number, number];

  /** Child elements, if any */
  children?: React.ReactNode;
}

/**
 * Default property values for the Navbar
 */
const defaultProps: Partial<INavbarProps> = {
  background: '#ffffff',
  brandName: 'MySite',
  navItems: ['Home', 'About', 'Contact'],
  padding: [10, 15, 10, 15],
};

/**
 * Navbar component
 */
export const Navbar: FC<INavbarProps> & {
  craft: {
    displayName: string;
    props: Partial<INavbarProps>;
    isCanvas: boolean;
    rules: {
      canDrag: () => boolean;
      canMove: () => boolean;
      canDelete: () => boolean;
      canSelect: () => boolean;
    };
    related: {
      settings: typeof NavbarProperties;
    };
  };
} = (incomingProps) => {
  const { connectors } = useNode();

  // Combine defaultProps with incoming props
  const props = { ...defaultProps, ...incomingProps };
  const { background, brandName, brandStyle, navItems, padding, children } =
    props;

  // Compute the container style
  const navbarStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background,
    padding: `${padding?.[0]}px ${padding?.[1]}px ${padding?.[2]}px ${padding?.[3]}px`,
  };

  // Stop propagation so clicks only select this component
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={(ref) => connectors.connect(ref as HTMLElement)}
      style={navbarStyle}
      onClick={handleClick}
    >
      <div style={{ fontWeight: 'bold', ...brandStyle }}>{brandName}</div>
      <nav>
        {navItems?.map((item, index) => (
          <a key={index} style={{ marginLeft: 16, textDecoration: 'none' }}>
            {item}
          </a>
        ))}
      </nav>

      {/* If any child elements are dropped inside */}
      {children}
    </div>
  );
};

Navbar.craft = {
  displayName: 'Navbar',
  props: defaultProps,
  // Mark this component as a Canvas so it can contain children
  isCanvas: true,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  // Where the navbar's settings panel is defined
  related: {
    settings: NavbarProperties,
  },
};

export default Navbar;
