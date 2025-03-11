import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/* --- Inline type definitions for the Row component --- */

/** A strict 4-number array for margin/padding usage. */
type FourNumberArray = [number, number, number, number];

interface IBorderProps {
  colour?: string; // e.g. '#000'
  style?: string; // e.g. 'solid' | 'dashed' | 'dotted'
  width?: number; // px
}

interface IRowCustomProps {
  isRootRow?: boolean;
}

export interface IRowProps {
  background?: string;
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justifyContent?:
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'space-between'
    | 'space-around';
  fillSpace?: 'yes' | 'no';
  width?: string;
  height?: string;
  margin?: FourNumberArray;
  padding?: FourNumberArray;
  shadow?: number;
  radius?: number;
  gap?: number;
  children?: React.ReactNode;
  border?: IBorderProps;
  custom?: IRowCustomProps;
}

/* --- Helper: SpacingControl for margin/padding arrays --- */
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
 * RowProperties – the settings panel for the Row component.
 * Displays and updates the Row's layout/spacing/appearance settings.
 */
export const RowProperties: React.FC = () => {
  const {
    background,
    alignItems,
    justifyContent,
    fillSpace,
    width,
    height,
    margin,
    padding,
    shadow,
    radius,
    gap,
    border,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
    fillSpace: node.data.props.fillSpace,
    width: node.data.props.width,
    height: node.data.props.height,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    radius: node.data.props.radius,
    gap: node.data.props.gap,
    border: node.data.props.border,
  }));

  return (
    <>
      {/* LAYOUT SECTION */}
      <Section title="Layout" defaultExpanded>
        <Item>
          <Dropdown
            label="Align Items"
            value={alignItems ?? 'flex-start'}
            onChangeValue={(newVal) =>
              setProp((props: IRowProps) => {
                props.alignItems = newVal as IRowProps['alignItems'];
              })
            }
            options={[
              { value: 'flex-start', label: 'Flex Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'Flex End' },
              { value: 'stretch', label: 'Stretch' },
              { value: 'baseline', label: 'Baseline' },
            ]}
          />
        </Item>

        <Item>
          <Dropdown
            label="Justify Content"
            value={justifyContent ?? 'flex-start'}
            onChangeValue={(newVal) =>
              setProp((props: IRowProps) => {
                props.justifyContent = newVal as IRowProps['justifyContent'];
              })
            }
            options={[
              { value: 'flex-start', label: 'Flex Start' },
              { value: 'center', label: 'Center' },
              { value: 'flex-end', label: 'Flex End' },
              { value: 'space-between', label: 'Space Between' },
              { value: 'space-around', label: 'Space Around' },
            ]}
          />
        </Item>

        <Item>
          <Dropdown
            label="Fill Space"
            value={fillSpace ?? 'no'}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.fillSpace = val as IRowProps['fillSpace'];
              })
            }
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />
        </Item>

        <Item>
          <Slider
            label="Gap between items (px)"
            value={gap ?? 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.gap = val;
              })
            }
          />
        </Item>

        <Item>
          <TextInput
            label="Width"
            value={width ?? ''}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.width = val;
              })
            }
            helperText='e.g. "100%", "auto", "300px"'
          />
        </Item>

        <Item>
          <TextInput
            label="Height"
            value={height ?? ''}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.height = val;
              })
            }
            helperText='e.g. "auto", "50px"'
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
              setProp((props: IRowProps) => {
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
              setProp((props: IRowProps) => {
                props.padding = vals as [number, number, number, number];
              })
            }
          />
        </Item>
      </Section>

      {/* APPEARANCE SECTION */}
      <Section title="Appearance" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Background Color"
            value={background ?? '#ffffff'}
            onChangeValue={(newHex) =>
              setProp((props: IRowProps) => {
                props.background = newHex;
              })
            }
            allowTextInput
          />
        </Item>
        <Item>
          <Slider
            label="Shadow"
            value={shadow ?? 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Radius"
            value={radius ?? 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.radius = val;
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
            value={border?.colour ?? '#000000'}
            onChangeValue={(newHex) =>
              setProp((props: IRowProps) => {
                props.border = {
                  ...props.border,
                  colour: newHex,
                };
              })
            }
            allowTextInput
          />
        </Item>
        <Item>
          <Dropdown
            label="Border Style"
            value={border?.style ?? 'solid'}
            onChangeValue={(val) =>
              setProp((props: IRowProps) => {
                props.border = {
                  ...props.border,
                  style: val,
                };
              })
            }
            options={[
              { value: 'solid', label: 'Solid' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'dotted', label: 'Dotted' },
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
              setProp((props: IRowProps) => {
                props.border = {
                  ...props.border,
                  width: val,
                };
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
