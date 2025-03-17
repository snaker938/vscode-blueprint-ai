import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

// UI elements from your PropertiesSidebar
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

// If you have a SwitchInput, Radio, etc., import them as needed
// import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
// import { Radio } from '../../PropertiesSidebar/UI/Radio';

// Reuse the SpacingControl helper from your instructions
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
 * The shape of props that the HeroSectionProperties panel will read/write.
 * Must correspond to the props defined in HeroSection (background, textAlign, etc.).
 */
export interface HeroSectionSettingsProps {
  background: string;
  textAlign: 'left' | 'center' | 'right';
  padding: number[];
  margin: number[];
  height: string;
  width: string;
  shadow: number;
  radius: number;
  border?: {
    color?: string;
    style?: string;
    width?: number;
  };
}

/**
 * The property editor component for the HeroSection.
 */
export const HeroSectionProperties: React.FC = () => {
  const {
    background,
    textAlign,
    padding,
    margin,
    height,
    width,
    shadow,
    radius,
    border,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    textAlign: node.data.props.textAlign,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    height: node.data.props.height,
    width: node.data.props.width,
    shadow: node.data.props.shadow,
    radius: node.data.props.radius,
    border: node.data.props.border,
  }));

  return (
    <>
      {/* BACKGROUND SECTION */}
      <Section title="Background" defaultExpanded>
        <Item>
          <ColorPicker
            label="Background Color"
            value={background || '#ffffff'}
            onChangeValue={(newHex) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.background = newHex;
              })
            }
            allowTextInput
            helperText="Pick or enter a background color"
          />
        </Item>
      </Section>

      {/* LAYOUT SECTION */}
      <Section title="Layout" defaultExpanded>
        <Item>
          <Dropdown
            label="Text Align"
            value={textAlign}
            onChangeValue={(newVal) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.textAlign =
                  newVal as HeroSectionSettingsProps['textAlign'];
              })
            }
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
          />
        </Item>
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(val) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.width = val;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height}
            onChangeValue={(val) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.height = val;
              })
            }
          />
        </Item>
      </Section>

      {/* SPACING SECTION */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(newVals) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.margin = newVals;
              })
            }
            max={200}
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(newVals) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.padding = newVals;
              })
            }
            max={200}
          />
        </Item>
      </Section>

      {/* BORDER SECTION */}
      <Section title="Border" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Border Color"
            value={border?.color || '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.border = {
                  ...props.border,
                  color: newHex,
                };
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <Dropdown
            label="Border Style"
            value={border?.style || 'solid'}
            onChangeValue={(newVal) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.border = {
                  ...props.border,
                  style: newVal,
                };
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
            value={border?.width ?? 0}
            min={0}
            max={20}
            onChangeValue={(val) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.border = {
                  ...props.border,
                  width: val,
                };
              })
            }
          />
        </Item>

        <Item>
          <Slider
            label="Border Radius"
            value={radius}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.radius = val;
              })
            }
          />
        </Item>
      </Section>

      {/* SHADOW SECTION */}
      <Section title="Shadow" defaultExpanded={false}>
        <Item>
          <Slider
            label="Shadow"
            value={shadow}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: HeroSectionSettingsProps) => {
                props.shadow = val;
              })
            }
            helperText="Larger = more pronounced shadow"
          />
        </Item>
      </Section>
    </>
  );
};
