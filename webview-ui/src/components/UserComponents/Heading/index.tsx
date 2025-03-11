import React, { useRef } from 'react';
import { useNode, useEditor } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';

interface IHeadingProps {
  /**
   * The textual content of the heading.
   */
  text: string;
  /**
   * The heading level (1 to 6).
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Color specified as a string (e.g., '#000000' or 'rgba(...)').
   */
  color: string;
  /**
   * Font size in pixels.
   */
  fontSize: number;
  /**
   * Font weight (e.g., 'bold', 'normal', '500').
   */
  fontWeight: string;
  /**
   * Text alignment: left, right, center, justify, or fallback string.
   */
  textAlign: 'left' | 'right' | 'center' | 'justify' | string;
  /**
   * Margin array: [top, right, bottom, left].
   */
  margin: [number, number, number, number];
  /**
   * Padding array: [top, right, bottom, left].
   */
  padding: [number, number, number, number];
}

/**
 * Use Partial if you want to allow omissions of certain props
 * when you declare <Heading /> in other files.
 */
export type HeadingComponentProps = Partial<IHeadingProps>;

const defaultProps: IHeadingProps = {
  text: 'Heading Text',
  level: 1,
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'left',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

// Craft.js settings interface
interface ICraftSettings {
  displayName: string;
  props: IHeadingProps;
  related: {
    settings: React.ComponentType<any>;
  };
}

// Extend React.FC with our Craft config
interface ICraftComponent<T = object> extends React.FC<T> {
  craft: ICraftSettings;
}

/**
 * Replace this import with your own HeadingProperties component
 * that you want to use in the settings panel, or remove it if you
 * have not yet created a dedicated properties component.
 */
// import { HeadingProperties } from './HeadingProperties';
const PlaceholderSettings = () => {
  return <div>Heading Settings Placeholder</div>;
};

/**
 * Heading component for Craft.js
 */
export const Heading: ICraftComponent<HeadingComponentProps> = (props) => {
  const {
    text,
    level,
    color,
    fontSize,
    fontWeight,
    textAlign,
    margin,
    padding,
  } = {
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
        width: '100%',
        margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
        padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
        position: 'relative',
      }}
    >
      <ContentEditable
        innerRef={editableRef}
        html={text}
        disabled={!enabled}
        onChange={(e) => {
          const newValue = e.target.value;
          setProp((currentProps: IHeadingProps) => {
            currentProps.text = newValue;
          }, 500);
        }}
        tagName={`h${level}`}
        style={{
          color,
          fontSize: `${fontSize}px`,
          fontWeight,
          textAlign,
          // Add any additional styling here if needed
        }}
      />
    </div>
  );
};

Heading.craft = {
  displayName: 'Heading',
  props: {
    ...defaultProps,
  },
  related: {
    // Replace this with your real HeadingProperties component:
    settings: PlaceholderSettings,
  },
};
