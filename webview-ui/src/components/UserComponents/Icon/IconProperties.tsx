import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * The interface for the Icon component's props within the editor.
 * These should match the fields used by the actual Icon component.
 */
export interface IIconProps {
  /** The name of the icon to render (e.g. "AiFillHome") */
  iconName: string;
  /** The size of the icon, in pixels */
  size: number;
  /** The icon color as a valid CSS color string (e.g. "#ff0000") */
  color: string;
  /** Margin array: [top, right, bottom, left] */
  margin: number[];
  /** Padding array: [top, right, bottom, left] */
  padding: number[];
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

/**
 * The property controls for the Icon component in the Craft editor.
 */
export const IconProperties: React.FC = () => {
  // Grab the current values + the method to set them from the node
  const {
    iconName,
    size,
    color,
    margin,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    iconName: node.data.props.iconName,
    size: node.data.props.size,
    color: node.data.props.color,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
  }));

  return (
    <>
      {/* ICON SETTINGS */}
      <Section title="Icon" defaultExpanded>
        <Item>
          <TextInput
            label="Icon Name"
            value={iconName}
            onChangeValue={(newVal) =>
              setProp((props: IIconProps) => {
                props.iconName = newVal;
              })
            }
            helperText="Enter the icon name, e.g. AiFillHome"
          />
        </Item>

        <Item>
          <Slider
            label="Size"
            value={size}
            min={8}
            max={128}
            onChangeValue={(newVal) =>
              setProp((props: IIconProps) => {
                props.size = newVal;
              })
            }
          />
        </Item>

        <Item>
          <ColorPicker
            label="Color"
            value={color}
            onChangeValue={(newHex) =>
              setProp((props: IIconProps) => {
                props.color = newHex;
              })
            }
            allowTextInput
            helperText="Pick or enter a color"
          />
        </Item>
      </Section>

      {/* SPACING SETTINGS */}
      <Section title="Margin" defaultExpanded={false}>
        <SpacingControl
          label="Margin"
          values={margin}
          onChangeValues={(vals) =>
            setProp((props: IIconProps) => {
              props.margin = vals;
            })
          }
        />
      </Section>

      <Section title="Padding" defaultExpanded={false}>
        <SpacingControl
          label="Padding"
          values={padding}
          onChangeValues={(vals) =>
            setProp((props: IIconProps) => {
              props.padding = vals;
            })
          }
        />
      </Section>
    </>
  );
};
