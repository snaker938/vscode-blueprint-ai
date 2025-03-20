import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

// UI components from our shared library:
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';

// Reuse the same Slider + TextInput approach for margin/padding controls:
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

/**
 * The interface describing the Dropdown's props
 * as they appear in the property editor.
 */
export interface DropdownPropertiesProps {
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  background?: string;
  color?: string;
  borderRadius?: number;
  margin?: [number, number, number, number];
  padding?: [number, number, number, number];
  width?: string;
  height?: string;
  options?: Array<{ value: string; label: string }>;
}

/**
 * A property panel for editing the Dropdown component's props.
 * Displays controls for label, placeholder, disabled switch,
 * colors, spacing, sizes, etc.
 */
export const DropdownProperties: React.FC = () => {
  const {
    label,
    placeholder,
    disabled,
    background,
    color,
    borderRadius,
    margin,
    padding,
    width,
    height,
    options,
    actions: { setProp },
  } = useNode((node) => ({
    label: node.data.props.label,
    placeholder: node.data.props.placeholder,
    disabled: node.data.props.disabled,
    background: node.data.props.background,
    color: node.data.props.color,
    borderRadius: node.data.props.borderRadius,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    width: node.data.props.width,
    height: node.data.props.height,
    options: node.data.props.options,
  }));

  return (
    <>
      {/* GENERAL SETTINGS */}
      <Section title="General" defaultExpanded>
        {/* Label */}
        <Item>
          <TextInput
            label="Label"
            value={label || ''}
            onChangeValue={(newVal) =>
              setProp((props: DropdownPropertiesProps) => {
                props.label = newVal;
              })
            }
          />
        </Item>

        {/* Placeholder */}
        <Item>
          <TextInput
            label="Placeholder"
            value={placeholder || ''}
            onChangeValue={(newVal) =>
              setProp((props: DropdownPropertiesProps) => {
                props.placeholder = newVal;
              })
            }
          />
        </Item>

        {/* Disabled Switch */}
        <Item>
          <SwitchInput
            label="Disabled"
            value={!!disabled}
            onChangeValue={(newVal) =>
              setProp((props: DropdownPropertiesProps) => {
                props.disabled = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* COLORS */}
      <Section title="Colors" defaultExpanded={false}>
        {/* Background Color */}
        <Item>
          <ColorPicker
            label="Background"
            value={background || '#ffffff'}
            onChangeValue={(newHex) =>
              setProp((props: DropdownPropertiesProps) => {
                props.background = newHex;
              })
            }
            allowTextInput
          />
        </Item>

        {/* Text Color */}
        <Item>
          <ColorPicker
            label="Text Color"
            value={color || '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: DropdownPropertiesProps) => {
                props.color = newHex;
              })
            }
            allowTextInput
          />
        </Item>
      </Section>

      {/* SIZE + BORDER RADIUS */}
      <Section title="Size & Radius" defaultExpanded={false}>
        <Item>
          {/* Width */}
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(newVal) =>
              setProp((props: DropdownPropertiesProps) => {
                props.width = newVal;
              })
            }
          />
        </Item>

        <Item>
          {/* Height */}
          <TextInput
            label="Height"
            value={height || ''}
            onChangeValue={(newVal) =>
              setProp((props: DropdownPropertiesProps) => {
                props.height = newVal;
              })
            }
          />
        </Item>

        <Item>
          {/* Border Radius */}
          <Slider
            label="Border Radius"
            value={borderRadius ?? 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: DropdownPropertiesProps) => {
                props.borderRadius = val;
              })
            }
          />
        </Item>
      </Section>

      {/* SPACING */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: DropdownPropertiesProps) => {
                props.margin = vals as [number, number, number, number];
              })
            }
          />
        </Item>

        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: DropdownPropertiesProps) => {
                props.padding = vals as [number, number, number, number];
              })
            }
          />
        </Item>
      </Section>

      {/* OPTIONS (Optional - simple JSON editing) */}
      <Section
        title="Options"
        defaultExpanded={false}
        subtitle="Edit dropdown items"
      >
        <Item>
          <TextInput
            label="JSON Options"
            value={JSON.stringify(options || [])}
            onChangeValue={(val) =>
              setProp((props: DropdownPropertiesProps) => {
                try {
                  const parsed = JSON.parse(val);
                  if (Array.isArray(parsed)) {
                    props.options = parsed;
                  }
                } catch {
                  // ignore parse errors
                }
              })
            }
            helperText="Enter an array of objects: [{ value, label }, ...]"
          />
        </Item>
      </Section>
    </>
  );
};
