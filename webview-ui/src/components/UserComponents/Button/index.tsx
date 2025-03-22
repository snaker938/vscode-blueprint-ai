import { CSSProperties, useMemo } from 'react';
import { useNode, useEditor, UserComponent } from '@craftjs/core';

import { Container } from '../Container'; // Adjust path as needed
import { ContainerProps } from '../Container'; // Adjust path as needed
import { Text } from '../Text'; // Adjust path as needed
import { Resizer } from '../Utils/Resizer'; // Adjust path as needed
import { ButtonProperties } from './ButtonProperties'; // Adjust path as needed

/**
 * A helper to parse RGBA or string color into a valid CSS color.
 */
function parseColor(
  c?: { r: number; g: number; b: number; a: number } | string
): string {
  if (!c) return 'transparent';
  if (typeof c === 'string') return c;
  const { r, g, b, a } = c;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Utility type for margin/padding: [top, right, bottom, left]
 */
type FourNumberArray = [number, number, number, number];

/**
 * Button styles
 */
export type ButtonStyle = 'full' | 'outline' | string;

/**
 * Main props for the Button
 */
export interface ButtonProps {
  /**
   * The "background" can be RGBA object or string.
   * If buttonStyle='full', it becomes the background color.
   * If buttonStyle='outline', background is transparent (and we use border).
   */
  background?: { r: number; g: number; b: number; a: number } | string;
  /**
   * 'full' = background is used, border is optional
   * 'outline' = transparent background, colored border
   */
  buttonStyle?: ButtonStyle;

  margin?: FourNumberArray;
  padding?: FourNumberArray;
  width?: number | string;
  height?: number | string;
  borderWidth?: number;
  borderRadius?: number;
  /**
   * When buttonStyle='outline', this is used for the border color.
   */
  borderColor?: { r: number; g: number; b: number; a: number } | string;
  /**
   * Box shadow as a raw CSS string.
   */
  boxShadow?: string;
  /**
   * Mouse cursor: 'pointer', etc.
   */
  cursor?: string;
  /**
   * The text shown in the button.
   */
  text?: string;
}

/**
 * Default values
 */
const defaultProps: Partial<ButtonProps> = {
  background: { r: 255, g: 255, b: 255, a: 0.5 },
  buttonStyle: 'full',
  margin: [5, 0, 5, 0],
  padding: [10, 20, 10, 20],
  width: 200,
  height: 50,
  borderWidth: 2,
  borderRadius: 4,
  borderColor: { r: 0, g: 0, b: 0, a: 1 },
  boxShadow: '',
  cursor: 'pointer',
  text: 'Button',
};

/**
 * Our Button component as a single node: it’s really just a Container + Text.
 */
export const Button: UserComponent<ButtonProps> = (incomingProps) => {
  // Merge defaults + incoming
  const props = { ...defaultProps, ...incomingProps };
  const {
    background,
    buttonStyle,
    margin,
    padding,
    width,
    height,
    borderWidth,
    borderRadius,
    borderColor,
    boxShadow,
    cursor,
    text,
  } = props;

  // Access Craft’s node/editor, typically for connecting
  const { node } = useNode((node) => ({ node }));
  const editor = useEditor();
  const { connectors } = editor;

  /**
   * Translate ButtonProps to ContainerProps
   */
  const containerProps: ContainerProps = useMemo(() => {
    const safeMargin = margin ?? [0, 0, 0, 0];
    const safePadding = padding ?? [0, 0, 0, 0];
    const finalWidth = typeof width === 'number' ? `${width}px` : width;
    const finalHeight = typeof height === 'number' ? `${height}px` : height;

    const isOutline = buttonStyle === 'outline';
    const isFull = buttonStyle === 'full';
    const finalBackground = isFull ? parseColor(background) : 'transparent';
    const finalBorderColor = isOutline
      ? parseColor(borderColor)
      : 'transparent';
    const finalBorderStyle = isOutline ? 'solid' : 'none';

    return {
      // Layout
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      fillSpace: 'no',
      width: finalWidth,
      height: finalHeight,

      // Spacing
      margin: safeMargin,
      padding: safePadding,

      // Border
      borderStyle: finalBorderStyle,
      borderColor: finalBorderColor,
      borderWidth: borderWidth,
      radius: borderRadius,

      // Background
      background: finalBackground,
    };
  }, [
    background,
    borderColor,
    borderWidth,
    borderRadius,
    buttonStyle,
    height,
    margin,
    padding,
    width,
  ]);

  /**
   * Connect the outer div to Craft for dragging/resizing
   */
  const connectRef = (dom: HTMLDivElement | null) => {
    if (!dom) return;
    connectors.connect(dom, node.id);
    connectors.drag(dom, node.id);
  };

  /**
   * Inline style for outer wrapper. We handle boxShadow + cursor here.
   */
  const wrapperStyle: CSSProperties = useMemo(() => {
    return {
      position: 'relative',
      display: 'inline-flex',
      boxShadow: boxShadow || undefined,
      cursor: cursor,
    };
  }, [boxShadow, cursor]);

  return (
    <Resizer
      ref={connectRef}
      propKey={{ width: 'width', height: 'height' }}
      style={wrapperStyle}
    >
      <Container {...containerProps}>
        {/* We simply render a Text component inside. */}
        <Text text={text} fontSize={16} textAlign="center" />
      </Container>
    </Resizer>
  );
};

/**
 * Attach Craft.js config
 */
Button.craft = {
  displayName: 'Button',
  props: {
    ...defaultProps,
  },
  /**
   * No other elements can be moved into this node
   */
  rules: {
    canMoveIn: () => false,
  },
  related: {
    settings: ButtonProperties,
  },
};
