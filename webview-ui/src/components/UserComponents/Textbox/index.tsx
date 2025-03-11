/**
 * index.tsx
 *
 * TextBox component for Craft.js
 *
 * This component renders either a single-line text input or a multi-line textarea,
 * and allows styling/configuration via a set of props (see ITextBoxProps). It also
 * supports drag-and-drop and resizing in the Craft.js editor.
 */

import React, { CSSProperties, FC, useCallback } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer'; // Assuming you have a Resizer utility
import { TextBoxProperties } from './TextboxProperties'; // <-- Referenced, but not created here

// Strict 4-number array for margin/padding usage
type FourNumberArray = [number, number, number, number];

/** Props for the TextBox component */
export interface ITextBoxProps {
  /** The current text value */
  text?: string;
  /** Placeholder to show when text is empty */
  placeholder?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** CSS font family name */
  fontFamily?: string;
  /** Text color */
  color?: string;
  /** Background color of the textbox */
  background?: string;
  /** Whether to use a multi-line textarea instead of an input */
  multiline?: boolean;
  /** Whether the textbox is disabled */
  disabled?: boolean;
  /** Whether the textbox is read-only */
  readOnly?: boolean;
  /** Optional margin (top, right, bottom, left) */
  margin?: FourNumberArray;
  /** Optional padding (top, right, bottom, left) */
  padding?: FourNumberArray;
  /** Border radius in pixels */
  radius?: number;
  /** Box shadow level (0 = none) */
  shadow?: number;
  /** Border color */
  borderColor?: string;
  /** Border style (e.g. 'solid', 'dashed', 'dotted', 'none') */
  borderStyle?: string;
  /** Border width in pixels */
  borderWidth?: number;
  /** Explicit width (e.g. '200px') */
  width?: string;
  /** Explicit height (e.g. '50px') */
  height?: string;
}

/** Default property values for the TextBox component */
const defaultProps: Partial<ITextBoxProps> = {
  text: '',
  placeholder: 'Enter text...',
  fontSize: 14,
  fontFamily: 'Arial, sans-serif',
  color: '#000000',
  background: '#ffffff',
  multiline: false,
  disabled: false,
  readOnly: false,
  margin: [0, 0, 0, 0],
  padding: [5, 5, 5, 5],
  radius: 0,
  shadow: 0,
  borderColor: '#000000',
  borderStyle: 'solid',
  borderWidth: 1,
  width: '200px',
  height: '40px',
};

/** Craft.js type signature for the TextBox component */
interface ITextBoxCraft {
  displayName: string;
  props: Partial<ITextBoxProps>;
  rules: {
    canDrag: (node: Node) => boolean;
  };
  related: {
    settings: typeof TextBoxProperties;
  };
}

/** Extend FC to include a static 'craft' property */
interface ITextBox extends FC<ITextBoxProps> {
  craft: ITextBoxCraft;
}

/**
 * TextBox component
 * Renders an <input> or <textarea>, with styling and optional resizing.
 */
export const TextBox: ITextBox = (incomingProps) => {
  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode();

  // Merge incoming props with defaults
  const props: ITextBoxProps = { ...defaultProps, ...incomingProps };

  const {
    text,
    placeholder,
    fontSize,
    fontFamily,
    color,
    background,
    multiline,
    disabled,
    readOnly,
    margin = [0, 0, 0, 0],
    padding = [5, 5, 5, 5],
    radius,
    shadow,
    borderColor,
    borderStyle,
    borderWidth,
    width,
    height,
  } = props;

  // Box shadow (if shadow > 0)
  const computedBoxShadow =
    shadow && shadow > 0 ? `0px 3px ${shadow}px rgba(0,0,0,0.2)` : 'none';

  // Construct final style for the resizable container
  const containerStyle: CSSProperties = {
    display: 'inline-block',
    width: width || 'auto',
    height: height || 'auto',
    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
    borderRadius: radius ? `${radius}px` : undefined,
    boxShadow: computedBoxShadow,
    borderColor,
    borderStyle,
    borderWidth: borderWidth ? `${borderWidth}px` : undefined,
    background,
  };

  // Inner <input>/<textarea> styling
  const innerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    resize: 'none',
    boxSizing: 'border-box',
    fontSize,
    fontFamily,
    color,
    background: 'transparent',
    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
    border: 'none',
    outline: 'none',
    // Keep radius inside
    borderRadius: radius ? `${radius - (borderWidth || 0)}px` : undefined,
  };

  // Handler for text changes (in Craft, we'd do setProp)
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setProp((props: ITextBoxProps) => {
        props.text = newValue;
      });
    },
    [setProp]
  );

  return (
    <Resizer
      // Connect with Craft for drag/drop
      ref={(ref) => {
        if (ref) {
          connect(ref);
        }
      }}
      // Let the user resize width & height
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
    >
      {multiline ? (
        <textarea
          style={innerStyle}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
        />
      ) : (
        <input
          type="text"
          style={innerStyle}
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          onChange={handleChange}
        />
      )}
    </Resizer>
  );
};

/**
 * Craft.js configuration
 * - displayName: Name shown in Craft.js layer/toolbar
 * - props: Default properties
 * - rules: Basic canDrag settings
 * - related: Link to the TextBoxProperties settings panel
 */
TextBox.craft = {
  displayName: 'TextBox',
  props: defaultProps,
  rules: {
    canDrag: (_node: Node) => {
      void _node;
      return true;
    },
  },
  related: {
    settings: TextBoxProperties, // Implementation in separate file (not provided here)
  },
};
