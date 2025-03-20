import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { IRadioButtonsProps } from './index'; // Adjust path if needed

/**
 * Interface for RadioButtonsProperties component
 * (must not be empty).
 */
interface RadioButtonsPropertiesProps {
  /**
   * Example flag to show advanced settings (if any).
   */
  showAdvanced?: boolean;
}

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
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
 * Property editor for the RadioButtons component.
 */
export const RadioButtonsProperties: React.FC<
  RadioButtonsPropertiesProps
> = () => {
  const {
    label,
    options,
    selectedValue,
    background,
    color,
    radius,
    margin,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    label: node.data.props.label as IRadioButtonsProps['label'],
    options: node.data.props.options as IRadioButtonsProps['options'],
    selectedValue: node.data.props
      .selectedValue as IRadioButtonsProps['selectedValue'],
    background: node.data.props.background as IRadioButtonsProps['background'],
    color: node.data.props.color as IRadioButtonsProps['color'],
    radius: node.data.props.radius as IRadioButtonsProps['radius'],
    margin: node.data.props.margin as IRadioButtonsProps['margin'],
    padding: node.data.props.padding as IRadioButtonsProps['padding'],
  }));

  return (
    <>
      {/* Radio Buttons Section */}
      <Section title="Radio Buttons" defaultExpanded>
        <Item>
          <TextInput
            label="Label"
            value={label || ''}
            onChangeValue={(newVal) =>
              setProp((props: IRadioButtonsProps) => {
                props.label = newVal;
              })
            }
          />
        </Item>

        <Item>
          <TextInput
            label="Options (comma separated)"
            value={options?.join(', ') || ''}
            onChangeValue={(newVal) =>
              setProp((props: IRadioButtonsProps) => {
                const arr = newVal
                  .split(',')
                  .map((str) => str.trim())
                  .filter(Boolean);
                props.options = arr;
              })
            }
            helperText="Enter radio options, separated by commas"
          />
        </Item>

        <Item>
          <TextInput
            label="Selected Value"
            value={selectedValue || ''}
            onChangeValue={(newVal) =>
              setProp((props: IRadioButtonsProps) => {
                props.selectedValue = newVal;
              })
            }
            helperText="The currently selected option"
          />
        </Item>
      </Section>

      {/* Styling Section */}
      <Section title="Styling" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Text Color"
            value={color || '#000000'}
            onChangeValue={(newColor) =>
              setProp((props: IRadioButtonsProps) => {
                props.color = newColor;
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <ColorPicker
            label="Background"
            value={background || '#ffffff'}
            onChangeValue={(newColor) =>
              setProp((props: IRadioButtonsProps) => {
                props.background = newColor;
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <Slider
            label="Border Radius"
            value={radius ?? 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: IRadioButtonsProps) => {
                props.radius = val;
              })
            }
          />
        </Item>
      </Section>

      {/* Spacing Section */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: IRadioButtonsProps) => {
                props.margin = vals;
              })
            }
          />
        </Item>

        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: IRadioButtonsProps) => {
                props.padding = vals;
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
