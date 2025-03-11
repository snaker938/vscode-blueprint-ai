/**
 * TextBoxProperties.tsx
 *
 * This file defines the properties panel (in the Craft.js editor)
 * for the TextBox component. The props interface is intentionally empty
 * because this component takes no external props.
 */

import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
// import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';

/**
 * A small helper to display margin/padding controls with
 * a Slider + TextInput for each side (top, right, bottom, left).
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
 * TextBoxProperties: A React component that displays a form
 * allowing the user to configure the props of a TextBox component
 * within the Craft.js editor.
 */
export const TextBoxProperties: React.FC<object> = () => {
  const {
    // Extract current props from the Node
    text,
    placeholder,
    fontSize,
    fontFamily,
    color,
    background,
    multiline,
    disabled,
    readOnly,
    margin,
    padding,
    radius,
    shadow,
    borderColor,
    borderStyle,
    borderWidth,
    width,
    height,

    // Craft.js actions
    actions: { setProp },
  } = useNode((node) => ({
    text: node.data.props.text,
    placeholder: node.data.props.placeholder,
    fontSize: node.data.props.fontSize,
    fontFamily: node.data.props.fontFamily,
    color: node.data.props.color,
    background: node.data.props.background,
    multiline: node.data.props.multiline,
    disabled: node.data.props.disabled,
    readOnly: node.data.props.readOnly,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    radius: node.data.props.radius,
    shadow: node.data.props.shadow,
    borderColor: node.data.props.borderColor,
    borderStyle: node.data.props.borderStyle,
    borderWidth: node.data.props.borderWidth,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <>
      {/* TEXT CONTENT SECTION */}
      <Section title="Text" defaultExpanded>
        <Item>
          <TextInput
            label="Text"
            value={text ?? ''}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.text = newVal;
              })
            }
            helperText="The text content inside the TextBox"
          />
        </Item>
        <Item>
          <TextInput
            label="Placeholder"
            value={placeholder ?? ''}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.placeholder = newVal;
              })
            }
            helperText="Placeholder when empty"
          />
        </Item>
        <Item>
          <Dropdown
            label="Multiline?"
            value={multiline ? 'yes' : 'no'}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.multiline = newVal === 'yes';
              })
            }
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' },
            ]}
          />
        </Item>
        <Item>
          <Dropdown
            label="Disabled?"
            value={disabled ? 'yes' : 'no'}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.disabled = newVal === 'yes';
              })
            }
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' },
            ]}
          />
        </Item>
        <Item>
          <Dropdown
            label="Read Only?"
            value={readOnly ? 'yes' : 'no'}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.readOnly = newVal === 'yes';
              })
            }
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' },
            ]}
          />
        </Item>
      </Section>

      {/* TYPOGRAPHY SECTION */}
      <Section title="Typography" defaultExpanded={false}>
        <Item>
          <Slider
            label="Font Size"
            value={fontSize ?? 14}
            min={8}
            max={72}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.fontSize = val;
              })
            }
            helperText="Adjust the font size in px"
          />
        </Item>
        <Item>
          <TextInput
            label="Font Family"
            value={fontFamily ?? ''}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.fontFamily = newVal;
              })
            }
            helperText="Specify a CSS font-family"
          />
        </Item>
        <Item>
          <ColorPicker
            label="Font Color"
            value={color ?? '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: any) => {
                props.color = newHex;
              })
            }
            allowTextInput
            helperText="Pick or enter a font color"
          />
        </Item>
      </Section>

      {/* APPEARANCE SECTION */}
      <Section title="Appearance" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Background"
            value={background ?? '#ffffff'}
            onChangeValue={(newHex) =>
              setProp((props: any) => {
                props.background = newHex;
              })
            }
            allowTextInput
            helperText="Pick or enter background color"
          />
        </Item>
        <Item>
          <TextInput
            label="Width"
            value={width ?? ''}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.width = newVal;
              })
            }
            helperText="e.g. '200px' or '100%'"
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height ?? ''}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.height = newVal;
              })
            }
            helperText="e.g. '50px' or 'auto'"
          />
        </Item>
      </Section>

      {/* SPACING (MARGIN & PADDING) SECTION */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: any) => {
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
              setProp((props: any) => {
                props.padding = vals;
              })
            }
          />
        </Item>
      </Section>

      {/* BORDER SECTION */}
      <Section title="Border" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Border Color"
            value={borderColor ?? '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: any) => {
                props.borderColor = newHex;
              })
            }
            allowTextInput
            helperText="Pick or enter border color"
          />
        </Item>
        <Item>
          <Dropdown
            label="Border Style"
            value={borderStyle ?? 'solid'}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.borderStyle = val;
              })
            }
            options={[
              { label: 'None', value: 'none' },
              { label: 'Solid', value: 'solid' },
              { label: 'Dashed', value: 'dashed' },
              { label: 'Dotted', value: 'dotted' },
            ]}
          />
        </Item>
        <Item>
          <Slider
            label="Border Width"
            value={borderWidth ?? 1}
            min={0}
            max={20}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.borderWidth = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Radius"
            value={radius ?? 0}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: any) => {
                props.radius = val;
              })
            }
            helperText="Border corner radius"
          />
        </Item>
      </Section>

      {/* SHADOW SECTION */}
      <Section title="Shadow" defaultExpanded={false}>
        <Item>
          <Slider
            label="Shadow"
            value={shadow ?? 0}
            min={0}
            max={50}
            onChangeValue={(newVal) =>
              setProp((props: any) => {
                props.shadow = newVal;
              })
            }
            helperText="Adjust the shadow intensity"
          />
        </Item>
      </Section>
    </>
  );
};
