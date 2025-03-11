import React, { useRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer'; // Same Resizer as used in Container

/**
 * Textbox props for Craft
 */
export interface ITextboxProps {
  value?: string;
  placeholder?: string;
  fontSize?: number;
  width?: string;
  height?: string;
  color?: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  margin?: [number, number, number, number];
  // Add more styling options as needed
}

/**
 * Default property values
 */
const defaultProps: ITextboxProps = {
  value: '',
  placeholder: 'Type something...',
  fontSize: 14,
  width: '200px',
  height: '60px',
  color: { r: 0, g: 0, b: 0, a: 1 },
  margin: [0, 0, 0, 0],
};

/**
 * Textbox component with Resizer
 */
export const Textbox: React.FC<ITextboxProps> = (incomingProps) => {
  // Merge defaults + incoming props
  const props: ITextboxProps = { ...defaultProps, ...incomingProps };
  const { value, placeholder, fontSize, width, height, color, margin } = props;

  /**
   * Craft.js node connectors
   */
  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode(() => ({}));

  /**
   * Check if editor is in edit mode or view mode
   */
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setProp((props: ITextboxProps) => {
      props.value = newValue;
    }, 500);
  };

  // Inline styling for the outer container
  const containerStyle = {
    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
    width,
    height,
  };

  // Inline styling for the textarea
  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    fontSize: fontSize,
    color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
    resize: 'none', // This ensures no native browser resizer handle
  };

  return (
    // Wrap with Resizer so users can drag corners to resize
    <Resizer
      // Pass the style & ref to Resizer
      style={containerStyle}
      ref={(ref) => {
        if (ref) {
          // Connect to Craft.js, making it draggable/selectable
          connect(drag(ref));
        }
      }}
      // Let Resizer know which props to update on resize
      propKey={{ width: 'width', height: 'height' }}
    >
      <textarea
        ref={inputRef}
        disabled={!enabled} // disable typing if not in edit mode
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        style={textareaStyle}
      />
    </Resizer>
  );
};

/**
 * Craft configuration
 */
Textbox.craft = {
  displayName: 'Textbox',
  props: {
    ...defaultProps,
  },
  // If you have a separate properties panel, hook it up here
  // related: {
  //   settings: TextboxProperties,
  // },
};
