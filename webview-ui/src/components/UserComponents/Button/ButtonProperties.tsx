import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';

// -----------------------------------------------------------------
// Types/Interfaces
// -----------------------------------------------------------------

/** A 4-number tuple representing [top, right, bottom, left] in px */
export type FourNumberArray = [number, number, number, number];

/** Border styling props (must match your Button's union type) */
export interface IBorderProps {
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
}

/** Main Button props, including margin/padding as 4-element tuples */
export interface ButtonProps {
  /** Button label text */
  label?: string;

  /**
   * Whether this should render as a normal button or as a radio button.
   * If 'radio', we'll render <input type="radio" ... />
   */
  variant?: 'button' | 'radio';

  /** Text color */
  color?: string;

  /** Background color */
  background?: string;

  /** Explicit width/height (e.g. 'auto', '100px', etc.) */
  width?: string;
  height?: string;

  /** Margin around the button: [top, right, bottom, left] in px */
  margin?: FourNumberArray;

  /** Padding inside the button: [top, right, bottom, left] in px */
  padding?: FourNumberArray;

  /** Border radius (px) */
  radius?: number;

  /** Shadow intensity (0 = no shadow) */
  shadow?: number;

  /** Border configuration */
  border?: IBorderProps;

  /** Whether the radio is checked (only matters if variant='radio') */
  checked?: boolean;
}

/**
 * Ensure we always have exactly 4 elements in our spacing array
 * (top, right, bottom, left).
 */
function ensureFour(values: number[]): FourNumberArray {
  return [values[0] ?? 0, values[1] ?? 0, values[2] ?? 0, values[3] ?? 0];
}

/**
 * Helper to edit margin or padding arrays using Sliders/TextInputs.
 * If you already have a similar component, feel free to re-use it.
 */
function SpacingControl({
  label,
  values,
  onChangeValues,
  max = 100,
}: {
  label: string;
  values?: FourNumberArray;
  onChangeValues: (newValues: FourNumberArray) => void;
  max?: number;
}) {
  const safeValues: FourNumberArray = values ?? [0, 0, 0, 0];

  return (
    <Section title={label}>
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
                onChangeValues(ensureFour(newVals));
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
                onChangeValues(ensureFour(newVals));
              }}
            />
          </Grid>
        ))}
      </Grid>
    </Section>
  );
}

// -----------------------------------------------------------------
// Main component: ButtonProperties
// -----------------------------------------------------------------

export const ButtonProperties = () => {
  const {
    // Collected props
    label,
    variant,
    color,
    background,
    width,
    height,
    margin,
    padding,
    radius,
    shadow,
    borderStyle,
    borderColor,
    borderWidth,
    checked,

    // Craft actions
    actions: { setProp },
  } = useNode((node) => {
    const props = node.data.props as ButtonProps;
    // Flatten border defaults
    const b = props.border || {};

    return {
      label: props.label ?? 'Click Me',
      variant: props.variant ?? 'button',
      color: props.color ?? '#ffffff',
      background: props.background ?? '#007bff',
      width: props.width ?? 'auto',
      height: props.height ?? 'auto',
      margin: props.margin ?? [5, 5, 5, 5],
      padding: props.padding ?? [10, 20, 10, 20],
      radius: props.radius ?? 4,
      shadow: props.shadow ?? 5,
      borderStyle: b.borderStyle ?? 'solid',
      borderColor: b.borderColor ?? '#cccccc',
      borderWidth: b.borderWidth ?? 1,
      checked: props.checked ?? false,
    };
  });

  return (
    <>
      {/* LABEL */}
      <Section title="Label">
        <Item>
          <TextInput
            label="Button Text"
            value={label}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
                props.label = val;
              })
            }
          />
        </Item>
      </Section>

      {/* VARIANT */}
      <Section title="Button Type">
        <Item>
          <Radio
            label="Variant"
            value={variant}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
                props.variant = val as 'button' | 'radio';
              })
            }
            options={[
              { label: 'Regular Button', value: 'button' },
              { label: 'Radio Button', value: 'radio' },
            ]}
          />
        </Item>

        {/* If 'radio' selected, show "Checked" switch */}
        {variant === 'radio' && (
          <Item>
            <SwitchInput
              label="Checked"
              value={checked}
              onChangeValue={(newVal) =>
                setProp((props: ButtonProps) => {
                  props.checked = newVal;
                })
              }
            />
          </Item>
        )}
      </Section>

      {/* APPEARANCE */}
      <Section title="Appearance">
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
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
              setProp((props: ButtonProps) => {
                props.height = val;
              })
            }
          />
        </Item>
        <Item>
          <ColorPicker
            label="Background"
            value={background}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
                props.background = val;
              })
            }
            allowTextInput
          />
        </Item>
        <Item>
          <ColorPicker
            label="Text Color"
            value={color}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
                props.color = val;
              })
            }
            allowTextInput
          />
        </Item>
      </Section>

      {/* MARGIN & PADDING */}
      <SpacingControl
        label="Margin"
        values={margin}
        onChangeValues={(vals) =>
          setProp((props: ButtonProps) => {
            props.margin = ensureFour(vals);
          })
        }
      />
      <SpacingControl
        label="Padding"
        values={padding}
        onChangeValues={(vals) =>
          setProp((props: ButtonProps) => {
            props.padding = ensureFour(vals);
          })
        }
      />

      {/* DECORATION */}
      <Section title="Decoration">
        <Item>
          <Slider
            label="Corner Radius"
            value={radius}
            min={0}
            max={50}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
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
              setProp((props: ButtonProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>
      </Section>

      {/* BORDER */}
      <Section title="Border">
        <Item>
          <ColorPicker
            label="Border Color"
            value={borderColor}
            onChangeValue={(newVal) =>
              setProp((props: ButtonProps) => {
                props.border = props.border || {};
                props.border.borderColor = newVal;
              })
            }
          />
        </Item>

        {/* Since we have a union type for borderStyle, let's use Radio to pick from the valid options */}
        <Item>
          <Radio
            label="Border Style"
            value={borderStyle}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
                props.border = props.border || {};
                props.border.borderStyle = val as IBorderProps['borderStyle'];
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
            value={borderWidth}
            min={0}
            max={20}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ButtonProps) => {
                props.border = props.border || {};
                props.border.borderWidth = val;
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
