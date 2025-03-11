import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';

/** A strongly-typed Grid props interface, storing colors as RGBA. */
export interface IGridProps {
  background: { r: number; g: number; b: number; a: number };
  columns: number;
  rows: number;
  rowGap: number;
  columnGap: number;
  justifyItems: 'start' | 'center' | 'end' | 'stretch';
  alignItems: 'start' | 'center' | 'end' | 'stretch';
  fillSpace: 'yes' | 'no';
  width: string;
  height: string;
  margin: [number, number, number, number];
  padding: [number, number, number, number];
  shadow: number;
  radius: number;
  border: {
    Colour: { r: number; g: number; b: number; a: number };
    style: 'none' | 'solid' | 'dashed' | 'dotted';
    width: number;
  };
}

/** Convert RGBA to a hex string (alpha is ignored for now). */
function rgbaToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, val));
  const hr = clamp(r).toString(16).padStart(2, '0');
  const hg = clamp(g).toString(16).padStart(2, '0');
  const hb = clamp(b).toString(16).padStart(2, '0');
  return `#${hr}${hg}${hb}`;
}

/** Convert a hex string (#abc, #aabbcc) into an RGBA object with a=1. */
function hexToRgba(hex: string): {
  r: number;
  g: number;
  b: number;
  a: number;
} {
  let safeHex = hex.trim().replace(/^#/, '');
  // Expand shorthand (#abc -> #aabbcc)
  if (safeHex.length === 3) {
    safeHex = safeHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  // Fallback to black if invalid
  if (!/^[0-9A-Fa-f]{6}$/.test(safeHex)) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  const r = parseInt(safeHex.slice(0, 2), 16);
  const g = parseInt(safeHex.slice(2, 4), 16);
  const b = parseInt(safeHex.slice(4, 6), 16);
  return { r, g, b, a: 1 };
}

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * NOTE: We’ve removed the <Section> from inside this function to avoid nested accordions.
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
    <MuiGrid container spacing={2}>
      {['Top', 'Right', 'Bottom', 'Left'].map((pos, idx) => (
        <MuiGrid item xs={6} key={pos}>
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
        </MuiGrid>
      ))}
    </MuiGrid>
  );
}

/**
 * The Property Panel for the Grid component.
 */
export const GridProperties: React.FC = () => {
  const {
    // Destructure props with fallbacks so they're never undefined:
    background = { r: 255, g: 255, b: 255, a: 1 },
    columns = 1,
    rows = 1,
    rowGap = 0,
    columnGap = 0,
    justifyItems = 'start',
    alignItems = 'start',
    fillSpace = 'no',
    width = 'auto',
    height = 'auto',
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    shadow = 0,
    radius = 0,
    border = {
      Colour: { r: 0, g: 0, b: 0, a: 1 },
      style: 'none',
      width: 0,
    },
    actions: { setProp },
  } = useNode((node) => {
    // Pull props from the node, but if any are missing, we’ll fill them in here
    const props = (node.data.props as Partial<IGridProps>) ?? {};
    return {
      background: props.background,
      columns: props.columns,
      rows: props.rows,
      rowGap: props.rowGap,
      columnGap: props.columnGap,
      justifyItems: props.justifyItems,
      alignItems: props.alignItems,
      fillSpace: props.fillSpace,
      width: props.width,
      height: props.height,
      margin: props.margin,
      padding: props.padding,
      shadow: props.shadow,
      radius: props.radius,
      border: props.border,
    };
  });

  return (
    <>
      {/* GRID LAYOUT SECTION */}
      <Section title="Grid Layout" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Columns"
            type="number"
            value={columns.toString()}
            onChangeValue={(val) => {
              const num = parseInt(val, 10) || 1;
              setProp((props: IGridProps) => {
                props.columns = num;
              });
            }}
          />
        </Item>
        <Item>
          <TextInput
            label="Rows"
            type="number"
            value={rows.toString()}
            onChangeValue={(val) => {
              const num = parseInt(val, 10) || 1;
              setProp((props: IGridProps) => {
                props.rows = num;
              });
            }}
          />
        </Item>
        <Item>
          <Slider
            label="Row Gap"
            value={rowGap}
            min={0}
            max={100}
            onChangeValue={(newVal) => {
              setProp((props: IGridProps) => {
                props.rowGap = newVal;
              });
            }}
          />
        </Item>
        <Item>
          <Slider
            label="Column Gap"
            value={columnGap}
            min={0}
            max={100}
            onChangeValue={(newVal) => {
              setProp((props: IGridProps) => {
                props.columnGap = newVal;
              });
            }}
          />
        </Item>
        <Item>
          <Dropdown
            label="Justify Items"
            value={justifyItems}
            onChangeValue={(val) =>
              setProp((props: IGridProps) => {
                props.justifyItems = val as IGridProps['justifyItems'];
              })
            }
            options={[
              { label: 'Start', value: 'start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'end' },
              { label: 'Stretch', value: 'stretch' },
            ]}
          />
        </Item>
        <Item>
          <Dropdown
            label="Align Items"
            value={alignItems}
            onChangeValue={(val) =>
              setProp((props: IGridProps) => {
                props.alignItems = val as IGridProps['alignItems'];
              })
            }
            options={[
              { label: 'Start', value: 'start' },
              { label: 'Center', value: 'center' },
              { label: 'End', value: 'end' },
              { label: 'Stretch', value: 'stretch' },
            ]}
          />
        </Item>
      </Section>

      {/* SIZING SECTION */}
      <Section title="Sizing" defaultExpanded={false}>
        <Item>
          <SwitchInput
            label="Fill available space"
            value={fillSpace === 'yes'}
            onChangeValue={(checked) => {
              setProp((props: IGridProps) => {
                props.fillSpace = checked ? 'yes' : 'no';
              });
            }}
          />
        </Item>
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(val) =>
              setProp((props: IGridProps) => {
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
              setProp((props: IGridProps) => {
                props.height = val;
              })
            }
          />
        </Item>
      </Section>

      {/* APPEARANCE SECTION */}
      <Section title="Appearance" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Background"
            value={rgbaToHex(background.r, background.g, background.b)}
            onChangeValue={(newHex) =>
              setProp((props: IGridProps) => {
                // If props.background is missing, create one
                if (!props.background) {
                  props.background = { r: 255, g: 255, b: 255, a: 1 };
                }
                const rgba = hexToRgba(newHex);
                props.background = {
                  ...rgba,
                  a: props.background.a, // preserve alpha if it existed
                };
              })
            }
            allowTextInput
          />
        </Item>
        <Item>
          <Slider
            label="Shadow"
            value={shadow}
            min={0}
            max={50}
            onChangeValue={(val) => {
              setProp((props: IGridProps) => {
                props.shadow = val;
              });
            }}
          />
        </Item>
        <Item>
          <Slider
            label="Border Radius"
            value={radius}
            min={0}
            max={50}
            onChangeValue={(val) => {
              setProp((props: IGridProps) => {
                props.radius = val;
              });
            }}
          />
        </Item>
      </Section>

      {/* BORDER SECTION */}
      <Section title="Border" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Border Color"
            value={rgbaToHex(border.Colour.r, border.Colour.g, border.Colour.b)}
            onChangeValue={(newHex) =>
              setProp((props: IGridProps) => {
                // If props.border or props.border.Colour is missing, create it
                if (!props.border) {
                  props.border = {
                    Colour: { r: 0, g: 0, b: 0, a: 1 },
                    style: 'none',
                    width: 0,
                  };
                }
                const rgba = hexToRgba(newHex);
                props.border.Colour = {
                  ...rgba,
                  a: props.border.Colour.a, // preserve alpha if it existed
                };
              })
            }
            allowTextInput
          />
        </Item>
        <Item>
          <Dropdown
            label="Border Style"
            value={border.style}
            onChangeValue={(val) =>
              setProp((props: IGridProps) => {
                // If border is missing, create it
                if (!props.border) {
                  props.border = {
                    Colour: { r: 0, g: 0, b: 0, a: 1 },
                    style: 'none',
                    width: 0,
                  };
                }
                props.border.style = val as IGridProps['border']['style'];
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
            value={border.width}
            min={0}
            max={20}
            onChangeValue={(val) =>
              setProp((props: IGridProps) => {
                // If border is missing, create it
                if (!props.border) {
                  props.border = {
                    Colour: { r: 0, g: 0, b: 0, a: 1 },
                    style: 'none',
                    width: 0,
                  };
                }
                props.border.width = val;
              })
            }
          />
        </Item>
      </Section>

      {/* SPACING SECTION */}
      <Section title="Spacing" defaultExpanded={false}>
        <SpacingControl
          label="Margin"
          values={margin}
          onChangeValues={(newVals) =>
            setProp((props: IGridProps) => {
              props.margin = [
                newVals[0],
                newVals[1],
                newVals[2],
                newVals[3],
              ] as [number, number, number, number];
            })
          }
        />
        <SpacingControl
          label="Padding"
          values={padding}
          onChangeValues={(newVals) =>
            setProp((props: IGridProps) => {
              props.padding = [
                newVals[0],
                newVals[1],
                newVals[2],
                newVals[3],
              ] as [number, number, number, number];
            })
          }
        />
      </Section>
    </>
  );
};
