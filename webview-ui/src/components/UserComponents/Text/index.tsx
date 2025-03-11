import React, { useRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

import { TextProperties } from './TextProperties';

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

export type TextComponentProps = Partial<ITextProps>;

// Provide defaults for every required field
const defaultProps: ITextProps = {
  fontSize: 15,
  textAlign: 'left',
  fontWeight: '500',
  color: { r: 92, g: 90, b: 90, a: 1 },
  shadow: 0,
  text: 'Text',
  margin: [0, 0, 0, 0],
};

// Craft.js settings interface expects a `settings` property
interface ICraftSettings {
  displayName: string;
  props: ITextProps;
  related: {
    settings: React.ComponentType<any>;
  };
}

// Extend React.FC with our Craft config
interface ICraftComponent<T = object> extends React.FC<T> {
  craft: ICraftSettings;
}

/**
 * Text component for Craft.js
 */
export const Text: ICraftComponent<TextComponentProps> = (props) => {
  const { fontSize, textAlign, fontWeight, color, shadow, text, margin } = {
    ...defaultProps,
    ...props,
  };

  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode(() => ({}));

  // Check if editor is in "edit mode" or "view mode"
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

// IMPORTANT: Use `related.settings` instead of `toolbar`
Text.craft = {
  displayName: 'Text',
  props: {
    ...defaultProps,
  },
  related: {
    settings: TextProperties,
  },
};
