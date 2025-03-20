import React, { FC, useMemo, CSSProperties } from 'react';
import { Node, useNode, useEditor, Element } from '@craftjs/core';

import { Resizer } from '../Utils/Resizer';
import { ButtonProperties } from './ButtonProperties';
import { Text } from '../Text';

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
export interface ButtonProps extends Record<string, unknown> {
  background?: { r: number; g: number; b: number; a: number } | string;
  buttonStyle?: ButtonStyle;

  margin?: FourNumberArray;
  padding?: FourNumberArray;

  width?: number | string;
  height?: number | string;

  borderWidth?: number;
  borderRadius?: number;
  borderColor?: { r: number; g: number; b: number; a: number } | string;

  boxShadow?: string;
  cursor?: string;
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
};

/**
 * Extend FC so we can attach Craft config
 */
interface CraftButtonFC<
  P extends Record<string, unknown> = Record<string, unknown>
> extends FC<P> {
  craft?: {
    displayName: string;
    props?: Partial<P>;
    rules?: {
      canMoveIn?: (incomingNodes: Node[]) => boolean;
    };
    related?: {
      settings?: React.ComponentType<any>;
    };
  };
}

/**
 * The Button component
 */
const ButtonComponent: CraftButtonFC<ButtonProps> = (incomingProps) => {
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
  } = props;

  const { node } = useNode((node) => ({ node }));
  const editor = useEditor();
  const { connectors } = editor;
  const isEditorEnabled = editor.query.getOptions().enabled;

  const containerStyle: CSSProperties = useMemo(() => {
    const safeMargin = margin ?? [0, 0, 0, 0];
    const finalWidth = typeof width === 'number' ? `${width}px` : width;
    const finalHeight = typeof height === 'number' ? `${height}px` : height;

    return {
      position: 'relative',
      display: 'inline-block',
      width: finalWidth,
      height: finalHeight,
      margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
      boxShadow,
    };
  }, [margin, width, height, boxShadow]);

  const buttonStyleObj: CSSProperties = useMemo(() => {
    const usedBorderColor = borderColor ?? background;
    const bgColor =
      buttonStyle === 'full' ? parseColor(background) : 'transparent';
    const borderCol =
      buttonStyle === 'outline' ? parseColor(usedBorderColor) : 'transparent';
    const safePadding = padding ?? [0, 0, 0, 0];

    return {
      width: '100%',
      height: '100%',
      background: bgColor,
      border: `${borderWidth}px solid ${borderCol}`,
      borderRadius: borderRadius || 0,
      padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
      cursor: cursor || 'pointer',
    };
  }, [
    buttonStyle,
    background,
    borderColor,
    borderWidth,
    borderRadius,
    padding,
    cursor,
  ]);

  const connectRef = (dom: HTMLDivElement | null) => {
    if (!dom) return;
    connectors.connect(dom, node.id);
    connectors.drag(dom, node.id);
  };

  return (
    <Resizer
      ref={connectRef}
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
    >
      <Element
        /* ↓↓↓ This ID prop is required ↓↓↓ */
        id="button_element"
        is="button"
        canvas
        style={buttonStyleObj}
        disabled={!isEditorEnabled}
      >
        <Text text="Button" fontSize={16} textAlign="center" />
      </Element>
    </Resizer>
  );
};

/**
 * Attach Craft.js config
 */
ButtonComponent.craft = {
  displayName: 'Button',
  props: {
    ...defaultProps,
  },
  rules: {
    canMoveIn: (incomingNodes: Node[]) => {
      // Only allow <Text> inside
      return incomingNodes.every((node) => node.data.type === Text);
    },
  },
  related: {
    settings: ButtonProperties,
  },
};

export const Button = ButtonComponent;
