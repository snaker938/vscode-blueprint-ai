import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';

export interface CheckboxPropertiesProps {
  /**
   * Text label shown beside the checkbox
   */
  label?: string;

  /**
   * Whether the checkbox is initially checked
   */
  checked?: boolean;

  /**
   * Whether the checkbox is disabled
   */
  disabled?: boolean;

  /**
   * The CSS width value of the checkbox container
   */
  width?: string;

  /**
   * The CSS height value of the checkbox container
   */
  height?: string;

  /**
   * Margin in [top, right, bottom, left]
   */
  margin?: [number, number, number, number];

  /**
   * Padding in [top, right, bottom, left]
   */
  padding?: [number, number, number, number];

  /**
   * Box shadow strength
   */
  shadow?: number;

  /**
   * Border radius (px)
   */
  radius?: number;
}

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * (As seen in the example, we replicate it here for convenience.)
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

/**
 * The CheckboxProperties component for configuring
 * the Checkbox's props within the editor sidebar.
 */
export const CheckboxProperties: React.FC = () => {
  const {
    label,
    checked,
    disabled,
    width,
    height,
    margin,
    padding,
    shadow,
    radius,
    actions: { setProp },
  } = useNode((node) => ({
    label: node.data.props.label,
    checked: node.data.props.checked,
    disabled: node.data.props.disabled,
    width: node.data.props.width,
    height: node.data.props.height,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    radius: node.data.props.radius,
  }));

  return (
    <>
      {/* CONTENT SECTION */}
      <Section title="Content" defaultExpanded>
        <Item>
          <TextInput
            label="Label"
            value={label || ''}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.label = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* STATE SECTION */}
      <Section title="State" defaultExpanded>
        <Item>
          <SwitchInput
            label="Checked"
            value={!!checked}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.checked = newVal;
              })
            }
          />
        </Item>
        <Item>
          <SwitchInput
            label="Disabled"
            value={!!disabled}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.disabled = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* LAYOUT SECTION */}
      <Section title="Layout" defaultExpanded>
        <Item>
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.width = newVal;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height || ''}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.height = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* SPACING SECTION (Margin / Padding) */}
      <Section title="Spacing" defaultExpanded>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: CheckboxPropertiesProps) => {
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
              setProp((props: CheckboxPropertiesProps) => {
                props.padding = vals as [number, number, number, number];
              })
            }
          />
        </Item>
      </Section>

      {/* STYLING SECTION */}
      <Section title="Styling" defaultExpanded>
        <Item>
          <Slider
            label="Shadow"
            value={shadow || 0}
            min={0}
            max={50}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.shadow = newVal;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Radius"
            value={radius || 0}
            min={0}
            max={50}
            onChangeValue={(newVal) =>
              setProp((props: CheckboxPropertiesProps) => {
                props.radius = newVal;
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
