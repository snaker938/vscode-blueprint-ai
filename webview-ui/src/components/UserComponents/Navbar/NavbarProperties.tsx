import React, { CSSProperties } from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
// import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * Props for editing the Navbar component in the property panel
 */
export interface NavbarPropertiesProps {
  /** Background color for the navbar */
  background: string;

  /** Brand name text displayed in the navbar */
  brandName: string;

  /** Inline CSS styles applied to the brand text (e.g. color, fontSize) */
  brandStyle: CSSProperties;

  /** An array of nav item labels (e.g. ['Home','About','Contact']) */
  navItems: string[];

  /**
   * Padding around the navbar in [top, right, bottom, left] format
   */
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
 * NavbarProperties: A settings panel for the Navbar component
 */
export const NavbarProperties: React.FC = () => {
  const {
    background,
    brandName,
    brandStyle,
    navItems,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    brandName: node.data.props.brandName,
    brandStyle: node.data.props.brandStyle,
    navItems: node.data.props.navItems,
    padding: node.data.props.padding,
  }));

  // Convert navItems array to a comma-separated string for editing
  const navItemsString = navItems?.join(', ') || '';

  return (
    <>
      <Section title="Navbar" defaultExpanded>
        {/* Background Color */}
        <Item>
          <ColorPicker
            label="Background Color"
            value={background}
            onChangeValue={(newHex) =>
              setProp((props: NavbarPropertiesProps) => {
                props.background = newHex;
              })
            }
            allowTextInput
            helperText="Pick a background color"
          />
        </Item>

        {/* Brand Name */}
        <Item>
          <TextInput
            label="Brand Name"
            value={brandName || ''}
            onChangeValue={(val) =>
              setProp((props: NavbarPropertiesProps) => {
                props.brandName = val;
              })
            }
          />
        </Item>

        {/* Brand Text Color */}
        <Item>
          <ColorPicker
            label="Brand Text Color"
            value={brandStyle.color || '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: NavbarPropertiesProps) => {
                props.brandStyle = {
                  ...props.brandStyle,
                  color: newHex,
                };
              })
            }
            allowTextInput
          />
        </Item>

        {/* Navigation Items */}
        <Item>
          <TextInput
            label="Nav Items"
            helperText="Comma-separated list"
            value={navItemsString}
            onChangeValue={(val) =>
              setProp((props: NavbarPropertiesProps) => {
                props.navItems = val
                  .split(',')
                  .map((item) => item.trim())
                  .filter(Boolean);
              })
            }
          />
        </Item>
      </Section>

      <Section title="Padding" defaultExpanded>
        <SpacingControl
          label="Padding"
          values={padding}
          onChangeValues={(vals) =>
            setProp((props: NavbarPropertiesProps) => {
              props.padding = vals;
            })
          }
        />
      </Section>
    </>
  );
};
