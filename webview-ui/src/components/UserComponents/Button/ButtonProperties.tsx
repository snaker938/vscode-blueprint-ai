import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
// import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';

// Helper components & functions ----------------------------------------------

// Same spacing helper from your example (copy/paste as needed):
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

// Color conversion helpers (same approach as in TextProperties):
function rgbaToHex(r: number, g: number, b: number) {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  const hr = clamp(r).toString(16).padStart(2, '0');
  const hg = clamp(g).toString(16).padStart(2, '0');
  const hb = clamp(b).toString(16).padStart(2, '0');
  return `#${hr}${hg}${hb}`;
}

function hexToRgba(hex: string) {
  let safeHex = hex.replace(/^#/, '');
  if (safeHex.length === 3) {
    safeHex = safeHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9A-Fa-f]{6}$/.test(safeHex)) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);
  return { r, g, b, a: 1 };
}

// ---------------------------------------------------------------------------

// 1) Define the interface for the Button component’s props:
export interface IButtonProps {
  background: { r: number; g: number; b: number; a: number };
  color: { r: number; g: number; b: number; a: number };
  buttonStyle: 'full' | 'outline' | string;
  margin: [number, number, number, number];
  text: string;
  /**
   * Configuration object for the internal Text component.
   * You can pass any of the Text.craft.props fields here.
   */
  textComponent: any;
}

/**
 * The ButtonProperties panel for the CraftJS Button component.
 */
export const ButtonProperties: React.FC = () => {
  // Access the component’s props from the Craft node
  const {
    background,
    color,
    buttonStyle,
    margin,
    text,
    // If you need textComponent, uncomment:
    // textComponent,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    color: node.data.props.color,
    buttonStyle: node.data.props.buttonStyle,
    margin: node.data.props.margin,
    text: node.data.props.text,
    // If you need textComponent, uncomment:
    // textComponent: node.data.props.textComponent,
  }));

  return (
    <>
      {/* CONTENT SECTION */}
      <Section title="Content" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Button Text"
            value={text}
            onChangeValue={(newVal) =>
              setProp((props: IButtonProps) => {
                props.text = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* STYLE SECTION */}
      <Section title="Style" defaultExpanded={false}>
        {/* Background Color */}
        <Item>
          <ColorPicker
            label="Background Color"
            value={rgbaToHex(background.r, background.g, background.b)}
            onChangeValue={(newHex) =>
              setProp((props: IButtonProps) => {
                const rgba = hexToRgba(newHex);
                props.background = {
                  r: rgba.r,
                  g: rgba.g,
                  b: rgba.b,
                  a: props.background?.a ?? 1,
                };
              })
            }
            allowTextInput
          />
        </Item>

        {/* Text Color */}
        <Item>
          <ColorPicker
            label="Text Color"
            value={rgbaToHex(color.r, color.g, color.b)}
            onChangeValue={(newHex) =>
              setProp((props: IButtonProps) => {
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
          />
        </Item>

        {/* Button Style */}
        <Item>
          <Radio
            label="Button Style"
            value={buttonStyle}
            onChangeValue={(newVal) =>
              setProp((props: IButtonProps) => {
                props.buttonStyle = newVal;
              })
            }
            options={[
              { label: 'Full', value: 'full' },
              { label: 'Outline', value: 'outline' },
            ]}
            row
          />
        </Item>
      </Section>

      {/* MARGINS SECTION */}
      <Section title="Margins" defaultExpanded={false}>
        <SpacingControl
          label="Margin"
          values={margin}
          onChangeValues={(vals) =>
            setProp((props: IButtonProps) => {
              props.margin = [vals[0], vals[1], vals[2], vals[3]];
            })
          }
        />
      </Section>

      {/* ADVANCED / TEXT COMPONENT SECTION (optional) */}
      {/* 
        If you want to expose additional props for the internal Text component,
        you could add another <Section> here that manipulates `textComponent`.
        For example:
      */}

      {/* 
      <Section title="Text Component Props" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Custom Font Size"
            value={textComponent.fontSize?.toString() ?? ''}
            onChangeValue={(val) =>
              setProp((props: IButtonProps) => {
                const num = parseInt(val, 10) || 16;
                props.textComponent.fontSize = num;
              })
            }
          />
        </Item>
      </Section>
      */}
    </>
  );
};
