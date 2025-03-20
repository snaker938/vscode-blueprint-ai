/**
 * SearchBoxProperties.tsx
 *
 * Defines the property editor for the SearchBox component.
 * It uses various UI elements (ColorPicker, Dropdown, etc.) from the
 * ../../PropertiesSidebar/UI/ directory to control the SearchBox's props.
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

/**
 * Props for the SearchBoxProperties component itself.
 * (Here you can define optional properties, if needed, to control
 * how the property panel is displayed. We include at least one field
 * so this isn't an empty interface.)
 */
export interface SearchBoxPropertiesProps {
  /**
   * If true, the property panel might show advanced options, etc.
   * You can omit/replace this with something that fits your use case.
   */
  advancedMode?: boolean;
}

/**
 * The props that our SearchBox component uses.
 * (Mirrors the interface from SearchBox/index.tsx)
 */
interface ISearchBoxProps {
  placeholder?: string;
  searchText?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderRadius?: number;
  padding?: [number, number, number, number];
  margin?: [number, number, number, number];
  shadow?: number;
  width?: string;
  height?: string;
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
 * Convert a CSS color string to a "safe" hex. If invalid, returns #000000.
 */
function safeColorString(value: unknown): string {
  if (typeof value === 'string') {
    // e.g., could be #abc, #aabbcc, rgb(...), etc.
    // For this simple approach, let's just accept #RRGGBB or #RGB or #AARRGGBB patterns.
    // Or you might do heavier validation. If it's not valid, fallback to #000000.
    try {
      const isHex = /^#([A-Fa-f0-9]{3,8})$/.test(value);
      const isRGB = /^rgb(a?)\([\d\s,%.]+\)$/.test(value);
      if (!isHex && !isRGB) {
        throw new Error('Not a recognized hex or rgb color');
      }
      return value;
    } catch {
      return '#000000';
    }
  }
  return '#000000';
}

/**
 * Property editor component for the SearchBox.
 */
export const SearchBoxProperties: React.FC<SearchBoxPropertiesProps> = ({
  advancedMode,
}) => {
  const {
    // Extract current prop values from the node
    placeholder,
    searchText,
    backgroundColor,
    textColor,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    padding,
    margin,
    shadow,
    width,
    height,
    actions: { setProp },
  } = useNode((node) => ({
    placeholder: node.data.props.placeholder,
    searchText: node.data.props.searchText,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    borderColor: node.data.props.borderColor,
    borderWidth: node.data.props.borderWidth,
    borderStyle: node.data.props.borderStyle,
    borderRadius: node.data.props.borderRadius,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    shadow: node.data.props.shadow,
    width: node.data.props.width,
    height: node.data.props.height,
  }));

  return (
    <>
      {/* CONTENT SECTION */}
      <Section title="Content" defaultExpanded>
        <Item>
          <TextInput
            label="Placeholder"
            value={placeholder || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.placeholder = newVal;
              })
            }
            helperText="Displayed when search is empty"
          />
        </Item>

        <Item>
          <TextInput
            label="Search Text"
            value={searchText || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.searchText = newVal;
              })
            }
            helperText="Initial value in the search field"
          />
        </Item>
      </Section>

      {/* STYLING SECTION */}
      <Section title="Styling" defaultExpanded>
        <Item>
          <ColorPicker
            label="Background Color"
            value={safeColorString(backgroundColor)}
            onChangeValue={(newHex) =>
              setProp((props: ISearchBoxProps) => {
                props.backgroundColor = newHex;
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <ColorPicker
            label="Text Color"
            value={safeColorString(textColor)}
            onChangeValue={(newHex) =>
              setProp((props: ISearchBoxProps) => {
                props.textColor = newHex;
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <ColorPicker
            label="Border Color"
            value={safeColorString(borderColor)}
            onChangeValue={(newHex) =>
              setProp((props: ISearchBoxProps) => {
                props.borderColor = newHex;
              })
            }
            allowTextInput
          />
        </Item>

        <Item>
          <Dropdown
            label="Border Style"
            value={borderStyle || 'solid'}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.borderStyle = newVal;
              })
            }
            options={[
              { label: 'None', value: 'none' },
              { label: 'Solid', value: 'solid' },
              { label: 'Dotted', value: 'dotted' },
              { label: 'Dashed', value: 'dashed' },
              { label: 'Double', value: 'double' },
              { label: 'Groove', value: 'groove' },
            ]}
          />
        </Item>

        <Item>
          <Slider
            label="Border Width"
            value={borderWidth ?? 0}
            min={0}
            max={20}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.borderWidth = newVal;
              })
            }
          />
        </Item>

        <Item>
          <Slider
            label="Border Radius"
            value={borderRadius ?? 0}
            min={0}
            max={50}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.borderRadius = newVal;
              })
            }
          />
        </Item>

        <Item>
          <Slider
            label="Box Shadow"
            value={shadow ?? 0}
            min={0}
            max={50}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.shadow = newVal;
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
            onChangeValues={(vals) =>
              setProp((props: ISearchBoxProps) => {
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
              setProp((props: ISearchBoxProps) => {
                props.padding = vals as [number, number, number, number];
              })
            }
          />
        </Item>
      </Section>

      {/* DIMENSIONS SECTION */}
      <Section title="Dimensions" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.width = newVal;
              })
            }
            helperText="e.g., 100%, 300px, auto"
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height || ''}
            onChangeValue={(newVal) =>
              setProp((props: ISearchBoxProps) => {
                props.height = newVal;
              })
            }
            helperText="e.g., 50px, auto"
          />
        </Item>
      </Section>

      {/* If advanced mode is toggled, you could add more sections here... */}
      {advancedMode && (
        <Section title="Advanced" defaultExpanded={false}>
          <Item>
            <p>You could place additional, advanced controls here.</p>
          </Item>
        </Section>
      )}
    </>
  );
};
