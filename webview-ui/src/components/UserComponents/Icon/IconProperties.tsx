import React from 'react';
import { Grid, Autocomplete, TextField } from '@mui/material';
import { useNode } from '@craftjs/core';
import * as AiIcons from 'react-icons/ai';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * The interface for the Icon component's props within the editor.
 * (Note: 'size' is removed, as the icon fills via width/height)
 */
export interface IIconProps {
  iconName: string;
  color: string;
  margin: number[];
  padding: number[];
  width: number;
  height: number;
}

/**
 * Generate an array of valid Ai icon names.
 * We filter to ensure the key references a valid React component (function).
 */
const AI_ICON_KEYS = Object.keys(AiIcons)
  .filter((key) => typeof (AiIcons as any)[key] === 'function')
  .sort();

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
  // Grab the current values + setter from the node
  const {
    iconName,
    color,
    margin,
    padding,
    width,
    height,
    actions: { setProp },
  } = useNode((node) => ({
    iconName: node.data.props.iconName,
    color: node.data.props.color,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <>
      {/* ICON SETTINGS */}
      <Section title="Icon" defaultExpanded={false}>
        <Item>
          <Autocomplete
            fullWidth
            options={AI_ICON_KEYS}
            value={iconName}
            onChange={(_, newVal) =>
              setProp((props: IIconProps) => {
                props.iconName = newVal || 'AiFillSmile';
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Icon Name"
                helperText="Search or select an icon"
              />
            )}
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

      {/* DIMENSIONS SETTINGS */}
      <Section title="Dimensions" defaultExpanded={false}>
        <Item>
          <Slider
            label="Width"
            value={width}
            min={0}
            max={500}
            onChangeValue={(val) =>
              setProp((props: IIconProps) => {
                props.width = val;
              })
            }
          />
          <TextInput
            label="Width"
            type="number"
            value={width.toString()}
            onChangeValue={(val) =>
              setProp((props: IIconProps) => {
                props.width = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Height"
            value={height}
            min={0}
            max={500}
            onChangeValue={(val) =>
              setProp((props: IIconProps) => {
                props.height = val;
              })
            }
          />
          <TextInput
            label="Height"
            type="number"
            value={height.toString()}
            onChangeValue={(val) =>
              setProp((props: IIconProps) => {
                props.height = parseInt(val, 10) || 0;
              })
            }
          />
        </Item>
      </Section>

      {/* MARGIN SETTINGS */}
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

      {/* PADDING SETTINGS */}
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
