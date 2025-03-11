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
 * The props interface for our Section component as defined in Section.tsx
 * Adjust if your actual Section props differ or include additional fields.
 */
interface IBorderProps {
  Colour?: string;
  style?: string;
  width?: number;
}

interface ISectionProps {
  background: string;
  flexDirection: 'row' | 'column';
  alignItems: 'flex-start' | 'center' | 'flex-end';
  justifyContent: 'flex-start' | 'center' | 'flex-end';
  fillSpace: 'yes' | 'no';
  width: string;
  height: string;
  margin: number[];
  padding: number[];
  shadow: number;
  radius: number;
  border?: IBorderProps;
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
 * The SectionProperties component renders the controls for customizing
 * a Section node within the Craft.js editor.
 */
export const SectionProperties: React.FC = () => {
  const {
    background,
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    width,
    height,
    margin,
    padding,
    shadow,
    radius,
    border,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
    fillSpace: node.data.props.fillSpace,
    width: node.data.props.width,
    height: node.data.props.height,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    radius: node.data.props.radius,
    border: node.data.props.border,
  }));

  return (
    <>
      {/* LAYOUT SECTION */}
      <Section title="Layout" defaultExpanded={false}>
        <Item>
          <Dropdown
            label="Flex Direction"
            value={flexDirection}
            onChangeValue={(val) =>
              setProp((props: ISectionProps) => {
                props.flexDirection = val as 'row' | 'column';
              })
            }
            options={[
              { label: 'Row', value: 'row' },
              { label: 'Column', value: 'column' },
            ]}
          />
        </Item>

        <Item>
          <Dropdown
            label="Align Items"
            value={alignItems}
            onChangeValue={(val) =>
              setProp((props: ISectionProps) => {
                props.alignItems = val as 'flex-start' | 'center' | 'flex-end';
              })
            }
            options={[
              { label: 'Start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'flex-end' },
            ]}
          />
        </Item>

        <Item>
          <Dropdown
            label="Justify Content"
            value={justifyContent}
            onChangeValue={(val) =>
              setProp((props: ISectionProps) => {
                props.justifyContent = val as
                  | 'flex-start'
                  | 'center'
                  | 'flex-end';
              })
            }
            options={[
              { label: 'Start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'flex-end' },
            ]}
          />
        </Item>

        <Item>
          <Dropdown
            label="Fill Space?"
            value={fillSpace}
            onChangeValue={(val) =>
              setProp((props: ISectionProps) => {
                props.fillSpace = val as 'yes' | 'no';
              })
            }
            options={[
              { label: 'No', value: 'no' },
              { label: 'Yes', value: 'yes' },
            ]}
          />
        </Item>

        {/* Width & Height */}
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(newVal) =>
              setProp((props: ISectionProps) => {
                props.width = newVal;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height}
            onChangeValue={(newVal) =>
              setProp((props: ISectionProps) => {
                props.height = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* BACKGROUND SECTION */}
      <Section title="Background" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Background"
            value={background}
            onChangeValue={(newHex) =>
              setProp((props: ISectionProps) => {
                props.background = newHex;
              })
            }
            allowTextInput
            helperText="Pick or enter background color"
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
              setProp((props: ISectionProps) => {
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
              setProp((props: ISectionProps) => {
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
            value={border?.Colour || '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: ISectionProps) => {
                if (!props.border) props.border = {};
                props.border.Colour = newHex;
              })
            }
            allowTextInput
          />
        </Item>
        <Item>
          <Dropdown
            label="Border Style"
            value={border?.style || 'solid'}
            onChangeValue={(val) =>
              setProp((props: ISectionProps) => {
                if (!props.border) props.border = {};
                props.border.style = val;
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
              setProp((props: ISectionProps) => {
                if (!props.border) props.border = {};
                props.border.width = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Radius"
            value={radius}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: ISectionProps) => {
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
            onChangeValue={(newVal) =>
              setProp((props: ISectionProps) => {
                props.shadow = newVal;
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
