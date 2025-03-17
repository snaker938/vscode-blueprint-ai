import React from 'react';
import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Border properties for the Sidebar */
interface ISidebarBorder {
  color?: string;
  style?: string;
  width?: number;
}

/** Sidebar component props */
export interface ISidebarProps {
  background?: string;
  width?: string;
  height?: string;
  margin?: FourNumberArray;
  padding?: FourNumberArray;
  border?: ISidebarBorder;
  collapsible?: boolean;
  collapsedWidth?: string;
  expandedWidth?: string;
  navItems?: string[];
}

/** Non-empty interface for the property panel */
export interface SidebarPropertiesProps {
  placeholderProp?: string; // Just to avoid an empty interface
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

export const SidebarProperties: React.FC<SidebarPropertiesProps> = () => {
  const {
    background,
    width,
    height,
    margin,
    padding,
    border,
    collapsible,
    collapsedWidth,
    expandedWidth,
    navItems,
    actions: { setProp },
  } = useNode((node) => {
    // Cast node.data.props to ISidebarProps so TypeScript knows the shape.
    const props = node.data.props as ISidebarProps;
    return {
      background: props.background,
      width: props.width,
      height: props.height,
      margin: props.margin,
      padding: props.padding,
      border: props.border,
      collapsible: props.collapsible,
      collapsedWidth: props.collapsedWidth,
      expandedWidth: props.expandedWidth,
      navItems: props.navItems,
    };
  });

  return (
    <>
      {/* LAYOUT */}
      <Section title="Layout" defaultExpanded>
        <Item>
          <ColorPicker
            label="Background Color"
            value={background || '#FFFFFF'}
            onChangeValue={(newColor) =>
              setProp((props: ISidebarProps) => {
                props.background = newColor;
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISidebarProps) => {
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
              setProp((props: ISidebarProps) => {
                props.height = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* MARGIN */}
      <Section title="Margin" defaultExpanded={false}>
        <SpacingControl
          label="Margin"
          values={margin}
          onChangeValues={(vals) =>
            setProp((props: ISidebarProps) => {
              props.margin = vals as FourNumberArray;
            })
          }
        />
      </Section>

      {/* PADDING */}
      <Section title="Padding" defaultExpanded={false}>
        <SpacingControl
          label="Padding"
          values={padding}
          onChangeValues={(vals) =>
            setProp((props: ISidebarProps) => {
              props.padding = vals as FourNumberArray;
            })
          }
        />
      </Section>

      {/* BORDER */}
      <Section title="Border" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Border Color"
            value={border?.color || '#000000'}
            onChangeValue={(newVal) =>
              setProp((props: ISidebarProps) => {
                props.border = { ...props.border, color: newVal };
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
              setProp((props: ISidebarProps) => {
                props.border = { ...props.border, style: newVal };
              })
            }
            options={[
              { label: 'None', value: 'none' },
              { label: 'Solid', value: 'solid' },
              { label: 'Dashed', value: 'dashed' },
              { label: 'Dotted', value: 'dotted' },
              { label: 'Double', value: 'double' },
            ]}
          />
        </Item>
        <Item>
          <Slider
            label="Border Width"
            value={border?.width ?? 0}
            min={0}
            max={20}
            onChangeValue={(newVal) =>
              setProp((props: ISidebarProps) => {
                props.border = { ...props.border, width: newVal };
              })
            }
          />
        </Item>
      </Section>

      {/* COLLAPSIBLE */}
      <Section title="Collapsible Settings" defaultExpanded={false}>
        <Item>
          <SwitchInput
            label="Collapsible"
            value={!!collapsible}
            onChangeValue={(newVal) =>
              setProp((props: ISidebarProps) => {
                props.collapsible = newVal;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Collapsed Width"
            value={collapsedWidth || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISidebarProps) => {
                props.collapsedWidth = newVal;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Expanded Width"
            value={expandedWidth || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISidebarProps) => {
                props.expandedWidth = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* NAV ITEMS */}
      <Section title="Nav Items" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Nav Items (comma-separated)"
            multiline
            value={(navItems || []).join(', ')}
            onChangeValue={(newVal) => {
              const items = newVal
                .split(',')
                .map((i) => i.trim())
                .filter(Boolean);
              setProp((props: ISidebarProps) => {
                props.navItems = items;
              });
            }}
          />
        </Item>
      </Section>
    </>
  );
};
