// src/components/UserComponents/Text/index.tsx
import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { TextField, Slider } from '@fluentui/react';

/** Props for our Text component */
export interface TextProps {
  text: string;
  fontSize: number;
  color?: string;
}

/** The actual Text user component */
export const Text: React.FC<TextProps> = ({ text, fontSize, color }) => {
  const {
    connectors: { connect, drag },
    selected,
    dragged,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
    dragged: node.events.dragged,
  }));

  // We'll manage an "editing" state, so that if it's selected, we let user type into a TextField
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
        fontSize: `${fontSize}px`,
        color: color || '#000',
        cursor: dragged ? 'grabbing' : 'pointer',
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
  } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
  }));

  return (
    <div style={{ padding: '8px' }}>
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
  },
  related: {
    settings: TextSettings,
  },
};
