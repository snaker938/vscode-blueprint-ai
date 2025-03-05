// src/components/UserComponents/Text/index.tsx
import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { TextField, Slider } from '@fluentui/react';

/** Props for our Text component */
export interface TextProps {
  text: string;
  fontSize: number;
  color?: string;

  /* margins in px */
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
}

/** The actual Text user component */
export const Text: React.FC<TextProps> = ({
  text,
  fontSize,
  color,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}) => {
  const {
    connectors: { connect, drag },
    selected,
    dragged,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
    dragged: node.events.dragged,
  }));

  // We'll manage an "editing" state so that if it's selected, we let the user type into a TextField
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    // If the user clicks away (selected becomes false), turn off editing
    if (!selected) {
      setEditing(false);
    }
  }, [selected]);

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      onClick={() => {
        if (selected) {
          setEditing(true);
        }
      }}
      style={{
        display: 'inline-block',
        fontSize: `${fontSize}px`,
        color: color || '#000',
        cursor: dragged ? 'grabbing' : 'pointer',
        margin: `${marginTop || 0}px ${marginRight || 0}px ${
          marginBottom || 0
        }px ${marginLeft || 0}px`,
      }}
    >
      {editing ? (
        <TextField
          value={text}
          onChange={(_, newVal) =>
            setProp((props: TextProps) => {
              props.text = newVal ?? '';
            })
          }
          onBlur={() => setEditing(false)}
        />
      ) : (
        text
      )}
    </div>
  );
};

/**
 * The settings panel for the Text component,
 * displayed in the Properties Panel when the Text is selected.
 */
const TextSettings: React.FC = () => {
  const {
    actions: { setProp },
    fontSize,
    color,
    text,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
    marginTop: node.data.props.marginTop,
    marginRight: node.data.props.marginRight,
    marginBottom: node.data.props.marginBottom,
    marginLeft: node.data.props.marginLeft,
  }));

  return (
    <div style={{ padding: '8px' }}>
      {/* Text */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ marginBottom: '4px', display: 'block' }}>Text:</label>
        <TextField
          value={text}
          onChange={(_, newVal) =>
            setProp((props: TextProps) => {
              props.text = newVal || '';
            })
          }
        />
      </div>

      {/* Font Size */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ marginBottom: '4px', display: 'block' }}>
          Font Size:
        </label>
        <Slider
          min={10}
          max={50}
          value={fontSize || 14}
          showValue
          onChange={(val) =>
            setProp((props: TextProps) => {
              props.fontSize = val;
            })
          }
        />
      </div>

      {/* Color */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ marginBottom: '4px', display: 'block' }}>Color:</label>
        <TextField
          type="color"
          value={color || '#000000'}
          onChange={(_, newVal) => {
            if (!newVal) return;
            setProp((props: TextProps) => {
              props.color = newVal;
            });
          }}
        />
      </div>

      {/* Margin T/R/B/L */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ marginBottom: '4px', display: 'block' }}>
          Margin (Top):
        </label>
        <Slider
          min={0}
          max={100}
          value={marginTop || 0}
          showValue
          onChange={(val) =>
            setProp((props: TextProps) => {
              props.marginTop = val;
            })
          }
        />
        <label style={{ marginBottom: '4px', display: 'block' }}>
          Margin (Right):
        </label>
        <Slider
          min={0}
          max={100}
          value={marginRight || 0}
          showValue
          onChange={(val) =>
            setProp((props: TextProps) => {
              props.marginRight = val;
            })
          }
        />
        <label style={{ marginBottom: '4px', display: 'block' }}>
          Margin (Bottom):
        </label>
        <Slider
          min={0}
          max={100}
          value={marginBottom || 0}
          showValue
          onChange={(val) =>
            setProp((props: TextProps) => {
              props.marginBottom = val;
            })
          }
        />
        <label style={{ marginBottom: '4px', display: 'block' }}>
          Margin (Left):
        </label>
        <Slider
          min={0}
          max={100}
          value={marginLeft || 0}
          showValue
          onChange={(val) =>
            setProp((props: TextProps) => {
              props.marginLeft = val;
            })
          }
        />
      </div>
    </div>
  );
};

/** Attach Craft config */
(Text as any).craft = {
  displayName: 'Text',
  props: {
    text: 'Hello World',
    fontSize: 20,
    color: '#000000',
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  related: {
    settings: TextSettings,
  },
};
