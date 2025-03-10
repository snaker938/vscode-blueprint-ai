import React from 'react';
import { useNode } from '@craftjs/core';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import type { ITextProps } from '../Text'; // Import your main ITextProps if desired

/**
 * Helpers to convert between our RGBA object and a #rrggbb hex string for the ColorPicker
 */
function rgbaToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  const hr = clamp(r).toString(16).padStart(2, '0');
  const hg = clamp(g).toString(16).padStart(2, '0');
  const hb = clamp(b).toString(16).padStart(2, '0');
  return `#${hr}${hg}${hb}`;
}

function hexToRgba(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  // Strip # if present
  let safeHex = hex.replace(/^#/, '');
  // If shorthand (#abc), expand to (#aabbcc)
  if (safeHex.length === 3) {
    safeHex = safeHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  // Fallback to black if invalid
  if (!/^[0-9A-Fa-f]{6}$/.test(safeHex)) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }

  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);
  return { r, g, b, a: 1 };
}

/**
 * TextProperties: Renders the sidebar controls to edit the Text component's props.
 */
export const TextProperties: React.FC = () => {
  const {
    // We collect current values from node.props
    fontSize,
    textAlign,
    fontWeight,
    color,
    shadow,
    text,
    margin,
    // We'll use setProp to update them
    actions: { setProp },
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    color: node.data.props.color,
    shadow: node.data.props.shadow,
    text: node.data.props.text,
    margin: node.data.props.margin,
  }));

  return (
    <Section title="Text Properties" defaultExpanded>
      {/* Edit the actual text value */}
      <Item>
        <TextInput
          label="Content"
          value={text}
          onChangeValue={(newVal) =>
            setProp((props: ITextProps) => {
              props.text = newVal;
            })
          }
        />
      </Item>

      {/* Font Size */}
      <Item>
        <Slider
          label="Font Size"
          value={fontSize}
          min={1}
          max={100}
          onChangeValue={(newVal) =>
            setProp((props: ITextProps) => {
              props.fontSize = newVal;
            })
          }
        />
      </Item>

      {/* Text Align */}
      <Item>
        <Dropdown
          label="Text Align"
          value={textAlign}
          onChangeValue={(newVal) =>
            setProp((props: ITextProps) => {
              props.textAlign = newVal;
            })
          }
          options={[
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
            { label: 'Justify', value: 'justify' },
          ]}
        />
      </Item>

      {/* Font Weight */}
      <Item>
        <Dropdown
          label="Font Weight"
          value={fontWeight}
          onChangeValue={(newVal) =>
            setProp((props: ITextProps) => {
              props.fontWeight = newVal;
            })
          }
          options={[
            { label: '100', value: '100' },
            { label: '200', value: '200' },
            { label: '300', value: '300' },
            { label: '400', value: '400' },
            { label: '500', value: '500' },
            { label: '600', value: '600' },
            { label: '700', value: '700' },
            { label: '800', value: '800' },
            { label: '900', value: '900' },
          ]}
        />
      </Item>

      {/* Text Color */}
      <Item>
        <ColorPicker
          label="Text Color"
          // Convert RGBA to hex (ignoring alpha)
          value={rgbaToHex(color.r, color.g, color.b)}
          onChangeValue={(newHex) =>
            setProp((props: ITextProps) => {
              const rgba = hexToRgba(newHex);
              props.color = {
                r: rgba.r,
                g: rgba.g,
                b: rgba.b,
                // keep existing alpha or set to 1
                a: props.color?.a ?? 1,
              };
            })
          }
        />
      </Item>

      {/* Shadow (just a number from 0..100) */}
      <Item>
        <Slider
          label="Shadow"
          value={shadow}
          onChangeValue={(newVal) =>
            setProp((props: ITextProps) => {
              props.shadow = newVal;
            })
          }
          min={0}
          max={100}
        />
      </Item>

      {/* Margin (top, right, bottom, left) */}
      <Item>
        <TextInput
          label="Margin Top"
          type="number"
          value={String(margin[0])}
          onChangeValue={(val) =>
            setProp((props: ITextProps) => {
              props.margin[0] = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Margin Right"
          type="number"
          value={String(margin[1])}
          onChangeValue={(val) =>
            setProp((props: ITextProps) => {
              props.margin[1] = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Margin Bottom"
          type="number"
          value={String(margin[2])}
          onChangeValue={(val) =>
            setProp((props: ITextProps) => {
              props.margin[2] = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Margin Left"
          type="number"
          value={String(margin[3])}
          onChangeValue={(val) =>
            setProp((props: ITextProps) => {
              props.margin[3] = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>
    </Section>
  );
};
