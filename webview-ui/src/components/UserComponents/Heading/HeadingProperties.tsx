import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

// UI components from your "../../PropertiesSidebar/UI/"
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * This is placed inline in this file for convenience.
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
  // Fallback to [0,0,0,0] if `values` is undefined
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
            value={String(safeValues[idx])}
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

/**
 * HeadingProperties component:
 * Controls the props of the selected Heading node in the Craft.js editor.
 */
export const HeadingProperties: React.FC = () => {
  // Get the relevant props from the selected node
  const {
    text,
    level,
    color,
    fontSize,
    fontWeight,
    textAlign,
    margin,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    text: node.data.props.text,
    level: node.data.props.level,
    color: node.data.props.color,
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    textAlign: node.data.props.textAlign,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
  }));

  return (
    <>
      {/* SECTION: Content */}
      <Section title="Content" defaultExpanded>
        <Item>
          <TextInput
            label="Heading Text"
            value={text || ''}
            onChangeValue={(newVal) => {
              setProp((props: any) => {
                props.text = newVal;
              });
            }}
            helperText="The visible text for this heading."
          />
        </Item>
      </Section>

      {/* SECTION: Heading Level */}
      <Section title="Heading Level" defaultExpanded>
        <Item>
          <Radio
            label="Level"
            value={String(level ?? 1)}
            onChangeValue={(newVal) => {
              setProp((props: any) => {
                props.level = parseInt(newVal, 10);
              });
            }}
            options={[
              { label: 'H1', value: '1' },
              { label: 'H2', value: '2' },
              { label: 'H3', value: '3' },
              { label: 'H4', value: '4' },
              { label: 'H5', value: '5' },
              { label: 'H6', value: '6' },
            ]}
          />
        </Item>
      </Section>

      {/* SECTION: Font Styling */}
      <Section title="Font" defaultExpanded={false}>
        <Item>
          <Slider
            label="Font Size"
            value={fontSize ?? 24}
            min={1}
            max={100}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.fontSize = val;
              })
            }
            helperText="Adjust heading font size."
          />
        </Item>

        <Item>
          <Dropdown
            label="Font Weight"
            value={String(fontWeight ?? 'bold')}
            onChangeValue={(val) => {
              // Convert string to number if numeric (e.g., "400") or keep as string (e.g. "bold")
              const numeric = parseInt(val, 10);
              setProp((props: any) => {
                props.fontWeight = isNaN(numeric) ? val : numeric;
              });
            }}
            options={[
              { label: 'Normal (400)', value: '400' },
              { label: 'Bold (700)', value: '700' },
              { label: 'Bolder', value: 'bolder' },
              { label: 'Lighter', value: 'lighter' },
            ]}
            helperText="Adjust how thick or bold the heading appears."
          />
        </Item>

        <Item>
          <ColorPicker
            label="Text Color"
            value={color || '#000000'}
            onChangeValue={(newHex) => {
              setProp((props: any) => {
                props.color = newHex;
              });
            }}
            allowTextInput
            helperText="Pick or enter a valid CSS color."
          />
        </Item>
      </Section>

      {/* SECTION: Text Alignment */}
      <Section title="Alignment" defaultExpanded={false}>
        <Item>
          <Dropdown
            label="Text Align"
            value={textAlign || 'left'}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.textAlign = newVal;
              })
            }
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
              { label: 'Justify', value: 'justify' },
            ]}
            helperText="Adjust how text is horizontally aligned."
          />
        </Item>
      </Section>

      {/* SECTION: Spacing (Margins & Padding) */}
      <Section title="Spacing" defaultExpanded={false}>
        {/* Margins */}
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: any) => {
                props.margin = vals;
              })
            }
            max={100}
          />
        </Item>

        {/* Padding */}
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: any) => {
                props.padding = vals;
              })
            }
            max={100}
          />
        </Item>
      </Section>
    </>
  );
};
