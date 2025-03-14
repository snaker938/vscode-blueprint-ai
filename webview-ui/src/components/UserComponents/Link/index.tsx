import React, { CSSProperties, FC, MouseEvent } from 'react';
import { useNode } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { LinkProperties } from './LinkProperties';

/**
 * Represents the props for the Link component.
 */
export interface ILinkProps {
  /**
   * The display text for the link.
   * If not provided, children will be used instead (if any).
   */
  text?: string;

  /**
   * The URL to link to.
   */
  href?: string;

  /**
   * Specifies where to open the linked document.
   */
  target?: '_blank' | '_self' | '_parent' | '_top';

  /**
   * Text color of the link.
   */
  color?: string;

  /**
   * Background color of the link's container.
   */
  background?: string;

  /**
   * 4-number array for margin: [top, right, bottom, left].
   */
  margin?: [number, number, number, number];

  /**
   * 4-number array for padding: [top, right, bottom, left].
   */
  padding?: [number, number, number, number];

  /**
   * Rounding of corners (in px).
   */
  radius?: number;

  /**
   * Box-shadow intensity.
   * 0 = no shadow, higher = more shadow.
   */
  shadow?: number;

  /**
   * Width of the link container (e.g. "100px", "auto").
   */
  width?: string;

  /**
   * Height of the link container (e.g. "50px", "auto").
   */
  height?: string;

  /**
   * Border thickness (in px).
   */
  borderWidth?: number;

  /**
   * Border style (e.g. "solid", "dotted").
   */
  borderStyle?: string;

  /**
   * Border color.
   */
  borderColor?: string;

  /**
   * Child elements, if any. (e.g. icons, nested text, etc.)
   */
  children?: React.ReactNode;
}

/**
 * Default values for the Link component props.
 */
const defaultProps: Partial<ILinkProps> = {
  text: 'Click Here',
  href: '#',
  target: '_blank',
  color: '#000000',
  background: 'transparent',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  radius: 0,
  shadow: 0,
  width: 'auto',
  height: 'auto',
  borderWidth: 0,
  borderStyle: 'solid',
  borderColor: '#000000',
};

/**
 * Craft.js configuration for the Link component.
 */
interface ILinkCraft {
  displayName: string;
  props: Partial<ILinkProps>;
  isCanvas: boolean;
  related: {
    settings: typeof LinkProperties;
  };
}

/**
 * The Link component type with a "craft" static field.
 */
interface ILink extends FC<ILinkProps> {
  craft: ILinkCraft;
}

/**
 * A Link component for usage within Craft.js.
 * The link only navigates if CTRL is held down during click.
 */
export const Link: ILink = (incomingProps) => {
  const {
    connectors: { connect, drag },
  } = useNode(() => ({}));

  // Merge incoming props with defaults
  const props: ILinkProps = { ...defaultProps, ...incomingProps };

  const {
    text,
    href,
    target,
    color,
    background,
    margin,
    padding,
    radius,
    shadow,
    width,
    height,
    borderWidth,
    borderStyle,
    borderColor,
    children,
  } = props;

  // Compute safe margin/padding
  const safeMargin = margin || [0, 0, 0, 0];
  const safePadding = padding || [0, 0, 0, 0];

  // Build CSS style for the outer container (the resizable wrapper)
  const containerStyle: CSSProperties = {
    display: 'inline-block',
    position: 'relative',
    width,
    height,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    background,
    borderWidth: borderWidth ? `${borderWidth}px` : '0px',
    borderStyle: borderStyle || 'solid',
    borderColor: borderColor || '#000',
    borderRadius: radius || 0,
    boxShadow:
      shadow && shadow > 0 ? `0px 3px ${shadow}px rgba(0,0,0,0.2)` : 'none',
  };

  /**
   * Only navigate if CTRL is held.
   */
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!e.ctrlKey) {
      e.preventDefault();
    }
  };

  return (
    <Resizer
      ref={(ref) => ref && connect(drag(ref))}
      style={containerStyle}
      propKey={{ width: 'width', height: 'height' }}
    >
      <a
        href={href}
        target={target}
        style={{
          color: color || '#000',
          textDecoration: 'none',
          display: 'inline-block',
          width: '100%',
          height: '100%',
        }}
        onClick={handleClick}
      >
        {text && !children ? text : children}
      </a>
    </Resizer>
  );
};

/**
 * Configure how this component behaves in the editor.
 */
Link.craft = {
  displayName: 'Link',
  props: defaultProps,
  isCanvas: false, // set to true if you want this Link to contain other draggable components
  related: {
    settings: LinkProperties,
  },
};
