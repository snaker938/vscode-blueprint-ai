import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

// Example text interface for reference
export interface ITextProps {
  text: string;
  fontSize: number;
  fontWeight: number; // Make sure this is a number
  color: { r: number; g: number; b: number; a: number };
  shadow: number;
  textAlign: string;
  margin: number[];
}

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * NOTE: We’ve removed the <Section> from inside this function to avoid nested sections.
 */
function SpacingControl({
  label,
  values,
  onChangeValues,
  max = 100,
}: {
  label: string;
  values?: number[];
  onChangeValues: (newValues: number[]) => void;
  max?: number;
}) {
  // Fallback to [0,0,0,0] if values is undefined
  const safeValues = values ?? [0, 0, 0, 0];

  return (
    <Grid container spacing={2}>
      {['Top', 'Right', 'Bottom', 'Left'].map((pos, idx) => (
        <Grid item xs={6} key={pos}>
          <Slider
            label={`${label} ${pos}`}
            value={safeValues[idx]}
            min={0}
            max={max}
            onChangeValue={(val) => {
              const newVals = [...safeValues];
              newVals[idx] = val;
              onChangeValues(newVals);
            }}
            showValueInput={false}
          />
          <TextInput
            label={pos}
            type="number"
            value={safeValues[idx].toString()}
            onChangeValue={(val) => {
              const num = parseInt(val, 10) || 0;
              const newVals = [...safeValues];
              newVals[idx] = num;
              onChangeValues(newVals);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

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
  let safeHex = hex.replace(/^#/, '');
  // Expand shorthand (#abc -> #aabbcc)
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

export const TextProperties: React.FC = () => {
  const {
    fontSize,
    textAlign,
    fontWeight,
    color,
    shadow,
    text,
    margin,
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
    <>
      {/* CONTENT SECTION */}
      <Section title="Content" defaultExpanded={false}>
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
      </Section>

      {/* FONT SECTION */}
      <Section title="Font" defaultExpanded={false}>
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

        {/* Font Weight */}
        <Item>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            <Slider
              label="Font Weight"
              value={fontWeight}
              min={0}
              max={1000}
              onChangeValue={(val) =>
                setProp((props: ITextProps) => {
                  props.fontWeight = val;
                })
              }
            />
          </div>
        </Item>

        {/* Text Colour */}
        <Item>
          <ColorPicker
            label="Text Colour"
            value={rgbaToHex(color.r, color.g, color.b)}
            onChangeValue={(newHex) =>
              setProp((props: ITextProps) => {
                const rgba = hexToRgba(newHex);
                props.color = {
                  r: rgba.r,
                  g: rgba.g,
                  b: rgba.b,
                  a: props.color?.a ?? 1,
                };
              })
            }
            allowTextInput
            helperText="Pick or enter Text Colour"
          />
        </Item>
      </Section>

      {/* STYLING SECTION */}
      <Section title="Styling" defaultExpanded={false}>
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

        {/* Shadow */}
        <Item>
          <Slider
            label="Shadow"
            value={shadow}
            min={0}
            max={100}
            onChangeValue={(newVal) =>
              setProp((props: ITextProps) => {
                props.shadow = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* MARGINS SECTION */}
      <Section title="Margins" defaultExpanded={false}>
        <SpacingControl
          label="Margin"
          values={margin}
          onChangeValues={(vals) =>
            setProp((props: ITextProps) => {
              props.margin = vals;
            })
          }
        />
      </Section>
    </>
  );
};
