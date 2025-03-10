import React, { useRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

import { TextProperties } from './TextProperties';

/**
 * ITextProps: Strict definition of the core props for our Text component.
 */
export interface ITextProps {
  fontSize: number;
  textAlign: 'left' | 'right' | 'center' | 'justify' | string;
  fontWeight: string;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  shadow: number;
  text: string;
  margin: [number, number, number, number];
}

/**
 * Define a type for "partial" overrides of ITextProps.
 */
export type TextComponentProps = Partial<ITextProps>;

/**
 * Default props for a new Text component instance
 */
const defaultProps: ITextProps = {
  fontSize: 15,
  textAlign: 'left',
  fontWeight: '500',
  color: { r: 92, g: 90, b: 90, a: 1 },
  shadow: 0,
  text: 'Text',
  margin: [0, 0, 0, 0],
};

/**
 * ICraftSettings: type for the `craft` static property on any Craft component.
 */
interface ICraftSettings {
  displayName: string;
  props: ITextProps;
  related: {
    toolbar: React.ComponentType<any>;
  };
}

/**
 * ICraftComponent<T>: extends React.FC to include a mandatory `craft` property
 * that adheres to `ICraftSettings`.
 */
interface ICraftComponent<T = object> extends React.FC<T> {
  craft: ICraftSettings;
}

/**
 * The Text component: strictly typed, supporting Craft.js
 */
export const Text: ICraftComponent<TextComponentProps> = (props) => {
  // Merge props with defaults to ensure we have all required fields
  const { fontSize, textAlign, fontWeight, color, shadow, text, margin } = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode(() => ({}));

  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const editableRef = useRef<HTMLHeadingElement>(null);

  return (
    <div
      ref={(dom) => {
        if (dom) {
          connect(drag(dom));
        }
      }}
      style={{
        // Removed hover/selected/drag-based styling
        width: '100%',
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        position: 'relative',
      }}
    >
      <ContentEditable
        innerRef={editableRef}
        html={text}
        disabled={!enabled}
        onChange={(e) => {
          const newValue = e.target.value;
          setProp((currentProps: ITextProps) => {
            currentProps.text = newValue;
          }, 500);
        }}
        tagName="h2"
        style={{
          color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
          fontSize: `${fontSize}px`,
          fontWeight,
          textAlign,
          textShadow: `0px 0px 2px rgba(0,0,0,${shadow / 100})`,
        }}
      />
    </div>
  );
};

/**
 * Attach Craft.js configuration to the component.
 */
Text.craft = {
  displayName: 'Text',
  props: {
    ...defaultProps,
  },
  related: {
    toolbar: TextProperties,
  },
};
