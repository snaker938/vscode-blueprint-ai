import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColourPicker } from '../../PropertiesSidebar/UI/ColourPicker';

/**
 * Type for the Container's props within the Craft node.
 * Customize this if your Container has more/different props.
 */
interface ContainerProps {
  width: string;
  height: string;
  background: string;
  Colour: RGBA;
  margin: number[]; // [top, right, bottom, left]
  padding: number[]; // [top, right, bottom, left]
  radius: number;
  shadow: number;
  flexDirection: 'row' | 'column';
  fillSpace: 'yes' | 'no';
  alignItems: 'flex-start' | 'center' | 'flex-end';
  justifyContent: 'flex-start' | 'center' | 'flex-end';
  border: {
    Colour: string;
    style: string;
    width: number;
  };
}

/**
 * RGBA object for typed Colour usage.
 */
interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
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
  values: number[];
  onChangeValues: (newValues: number[]) => void;
  max?: number;
}) {
  return (
    <Section title={label}>
      <Grid container spacing={2}>
        {['Top', 'Right', 'Bottom', 'Left'].map((pos, idx) => (
          <Grid item xs={6} key={pos}>
            <Slider
              label={`${label} ${pos}`}
              value={values[idx]}
              min={0}
              max={max}
              onChangeValue={(val) => {
                const newVals = [...values];
                newVals[idx] = val;
                onChangeValues(newVals);
              }}
              showValueInput={false}
            />
            <TextInput
              label={`${pos} (Manual)`}
              type="number"
              value={values[idx].toString()}
              onChangeValue={(val) => {
                const num = parseInt(val, 10) || 0;
                const newVals = [...values];
                newVals[idx] = num;
                onChangeValues(newVals);
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}

export const ContainerProperties = () => {
  /**
   * Pull out props from the node via `useNode`.
   * We strongly type them as ContainerProps so we can avoid `any`.
   */
  const {
    width,
    height,
    background,
    Colour,
    margin,
    padding,
    radius,
    shadow,
    flexDirection,
    fillSpace,
    alignItems,
    justifyContent,
    border,
    actions: { setProp },
  } = useNode((node) => {
    const props = node.data.props as ContainerProps;
    return {
      width: props.width,
      height: props.height,
      background: props.background,
      Colour: props.Colour,
      margin: props.margin,
      padding: props.padding,
      radius: props.radius,
      shadow: props.shadow,
      flexDirection: props.flexDirection,
      fillSpace: props.fillSpace,
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      border: props.border,
    };
  });

  return (
    <>
      {/** DIMENSIONS */}
      <Section title="Dimensions">
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
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
              setProp((props: ContainerProps) => {
                props.height = val;
              })
            }
          />
        </Item>
      </Section>

      {/** ColourS */}
      <Section title="Colours">
        <Item>
          <ColourPicker
            label="Background Colour"
            value={background}
            onChangeValue={(newVal) =>
              setProp((props: ContainerProps) => {
                props.background = newVal;
              })
            }
            allowTextInput
            helperText="Pick or enter background Colour"
          />
        </Item>
        <Item>
          <ColourPicker
            label="Text Colour"
            value={rgbaOrHex(Colour)}
            onChangeValue={(newVal) =>
              setProp((props: ContainerProps) => {
                props.Colour = parseColourToRGBA(newVal);
              })
            }
            allowTextInput
            helperText="Pick or enter RGBA/HEX"
          />
        </Item>
      </Section>

      {/** MARGIN */}
      <SpacingControl
        label="Margin"
        values={margin}
        onChangeValues={(vals) =>
          setProp((props: ContainerProps) => {
            props.margin = vals;
          })
        }
      />

      {/** PADDING */}
      <SpacingControl
        label="Padding"
        values={padding}
        onChangeValues={(vals) =>
          setProp((props: ContainerProps) => {
            props.padding = vals;
          })
        }
      />

      {/** DECORATION */}
      <Section title="Decoration">
        <Item>
          <Slider
            label="Corner Radius"
            value={radius}
            min={0}
            max={50}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.radius = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Shadow"
            value={shadow}
            min={0}
            max={50}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>
      </Section>

      {/** BORDER */}
      <Section title="Border">
        <Item>
          <ColourPicker
            label="Border Colour"
            value={border.Colour}
            onChangeValue={(newColour) =>
              setProp((props: ContainerProps) => {
                props.border.Colour = newColour;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Border Style"
            value={border.style}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.border.style = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Border Width"
            value={border.width}
            min={0}
            max={20}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.border.width = val;
              })
            }
          />
        </Item>
      </Section>

      {/** LAYOUT / FLEX */}
      <Section title="Alignment">
        <Item>
          <Radio
            label="Flex Direction"
            value={flexDirection}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.flexDirection = val as ContainerProps['flexDirection'];
              })
            }
            options={[
              { label: 'Row', value: 'row' },
              { label: 'Column', value: 'column' },
            ]}
          />
        </Item>
        <Item>
          <SwitchInput
            label="Fill Space"
            value={fillSpace === 'yes'}
            onChangeValue={(checked) =>
              setProp((props: ContainerProps) => {
                props.fillSpace = checked ? 'yes' : 'no';
              })
            }
          />
        </Item>
        <Item>
          <Radio
            label="Align Items"
            value={alignItems}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.alignItems = val as ContainerProps['alignItems'];
              })
            }
            options={[
              { label: 'Flex start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'Flex end', value: 'flex-end' },
            ]}
          />
        </Item>
        <Item>
          <Radio
            label="Justify Content"
            value={justifyContent}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.justifyContent = val as ContainerProps['justifyContent'];
              })
            }
            options={[
              { label: 'Flex start', value: 'flex-start' },
              { label: 'Center', value: 'center' },
              { label: 'Flex end', value: 'flex-end' },
            ]}
          />
        </Item>
      </Section>
    </>
  );
};

/**
 * Convert an RGBA object to either a hex string or an rgba() string.
 */
function rgbaOrHex({ r, g, b, a }: RGBA) {
  if (a < 1) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  return `#${hex}`;
}

/**
 * Parse a Colour string (#hex or rgb/rgba) into an RGBA object.
 * Returns black (0,0,0,1) if parsing fails.
 */
function parseColourToRGBA(ColourStr: string): RGBA {
  if (ColourStr.startsWith('#')) {
    let hex = ColourStr.slice(1);
    // Expand short #abc to #aabbcc
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    const num = parseInt(hex, 16) || 0;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return { r, g, b, a: 1 };
  } else if (ColourStr.startsWith('rgba') || ColourStr.startsWith('rgb')) {
    const match = ColourStr.match(/\(([^)]+)\)/);
    if (match) {
      const parts = match[1].split(',').map((p) => parseFloat(p.trim()));
      const [r, g, b, a = 1] = parts;
      return {
        r: r || 0,
        g: g || 0,
        b: b || 0,
        a: a || 1,
      };
    }
  }
  // fallback to black
  return { r: 0, g: 0, b: 0, a: 1 };
}
