// SimpleProperties.tsx

import React from 'react';
import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

// Define a minimal interface for the properties we want to edit
export interface SimpleProps {
  margin?: [number, number, number, number];
  padding?: [number, number, number, number];
  shadow?: number;
  borderRadius?: number;
  border?: string;
}

/**
 * A small helper to enforce exactly four numeric values (top, right, bottom, left).
 * If arr has fewer than 4 items, missing ones become 0.
 * If arr has more than 4 items, the extras are ignored.
 */
function ensure4Values(arr: number[]): [number, number, number, number] {
  const [top, right, bottom, left] = arr;
  return [top ?? 0, right ?? 0, bottom ?? 0, left ?? 0];
}

/**
 * A small helper to display margin/padding controls with
 * a Slider + TextInput for each side.
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
 * A simple properties panel for a component, providing controls for:
 * - margin
 * - padding
 * - shadow
 * - border radius
 * - border
 */
export const SimpleProperties: React.FC<Partial<SimpleProps>> = () => {
  const {
    margin,
    padding,
    shadow,
    borderRadius,
    border,
    actions: { setProp },
  } = useNode((node) => ({
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    borderRadius: node.data.props.borderRadius,
    border: node.data.props.border,
  }));

  return (
    <div className="simple-properties-panel">
      <Section title="Spacing" defaultExpanded>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: SimpleProps) => {
                props.margin = ensure4Values(vals);
              })
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: SimpleProps) => {
                props.padding = ensure4Values(vals);
              })
            }
          />
        </Item>
      </Section>

      <Section title="Styling" defaultExpanded={false}>
        <Item>
          <Slider
            label="Shadow"
            value={shadow ?? 0}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: SimpleProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>

        <Item>
          <Slider
            label="Border Radius"
            value={borderRadius ?? 0}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: SimpleProps) => {
                props.borderRadius = val;
              })
            }
          />
        </Item>

        <Item>
          <TextInput
            label="Border"
            value={border || ''}
            onChangeValue={(val) =>
              setProp((props: SimpleProps) => {
                props.border = val;
              })
            }
            helperText='e.g. "1px solid #000"'
          />
        </Item>
      </Section>
    </div>
  );
};
