import React from 'react';
import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

/**
 * Import UI components from your library
 * Adjust these imports to the correct paths in your codebase.
 */
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * Import the ButtonProps type from your Button component, if needed.
 * Otherwise, replicate it here.
 */
import { ButtonProps, ButtonStyle } from './index';

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * It's taken from the example in the TextProperties file.
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
  // Fallback to [0, 0, 0, 0] if values is undefined
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
 * The properties panel for the Button component
 */
export const ButtonProperties: React.FC = () => {
  /**
   * Access the current component's props and the setProp action from Craft.js
   */
  const {
    actions: { setProp },
    background,
    buttonStyle,
    margin,
    padding,
    width,
    height,
    borderWidth,
    borderRadius,
    borderColor,
    boxShadow,
    cursor,
  } = useNode((node) => ({
    background: node.data.props.background,
    buttonStyle: node.data.props.buttonStyle,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    width: node.data.props.width,
    height: node.data.props.height,
    borderWidth: node.data.props.borderWidth,
    borderRadius: node.data.props.borderRadius,
    borderColor: node.data.props.borderColor,
    boxShadow: node.data.props.boxShadow,
    cursor: node.data.props.cursor,
  }));

  /**
   * Utility: sets any prop key to a new value using setProp
   */
  const handleChange = <K extends keyof ButtonProps>(
    propName: K,
    value: ButtonProps[K]
  ) => {
    setProp((props: ButtonProps) => {
      props[propName] = value;
    });
  };

  /**
   * Options for buttonStyle
   */
  const buttonStyleOptions = [
    { label: 'Full', value: 'full' },
    { label: 'Outline', value: 'outline' },
  ];

  /**
   * Render
   */
  return (
    <>
      {/* Appearance Section */}
      <Section title="Appearance" defaultExpanded>
        <Item>
          <Dropdown
            label="Button Style"
            value={buttonStyle ?? 'full'}
            options={buttonStyleOptions}
            onChangeValue={(val) =>
              handleChange('buttonStyle', val as ButtonStyle)
            }
          />
        </Item>
        <Item>
          <ColorPicker
            label="Background"
            value={background}
            onChangeValue={(newColor) => handleChange('background', newColor)}
          />
        </Item>
        <Item>
          <ColorPicker
            label="Border Color"
            value={borderColor}
            onChangeValue={(newColor) => handleChange('borderColor', newColor)}
          />
        </Item>
        <Item>
          <Slider
            label="Border Width"
            value={borderWidth ?? 2}
            min={0}
            max={20}
            onChangeValue={(val) => handleChange('borderWidth', val)}
          />
        </Item>
        <Item>
          <Slider
            label="Border Radius"
            value={borderRadius ?? 4}
            min={0}
            max={50}
            onChangeValue={(val) => handleChange('borderRadius', val)}
          />
        </Item>
        <Item>
          <TextInput
            label="Box Shadow"
            value={boxShadow ?? ''}
            onChangeValue={(val) => handleChange('boxShadow', val)}
            helperText='e.g. "0px 0px 10px rgba(0,0,0,0.3)"'
          />
        </Item>
        <Item>
          <TextInput
            label="Cursor"
            value={cursor ?? 'pointer'}
            onChangeValue={(val) => handleChange('cursor', val)}
            helperText='e.g. "pointer", "default", "text"'
          />
        </Item>
      </Section>

      {/* Layout & Spacing Section */}
      <Section title="Layout & Spacing" defaultExpanded>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(newVals) =>
              handleChange(
                'margin',
                newVals as [number, number, number, number]
              )
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(newVals) =>
              handleChange(
                'padding',
                newVals as [number, number, number, number]
              )
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Width"
            value={width?.toString() ?? ''}
            onChangeValue={(val) => handleChange('width', val)}
            helperText='Use CSS units (e.g. "200px", "50%", "auto")'
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height?.toString() ?? ''}
            onChangeValue={(val) => handleChange('height', val)}
            helperText='Use CSS units (e.g. "50px", "auto")'
          />
        </Item>
      </Section>
    </>
  );
};
