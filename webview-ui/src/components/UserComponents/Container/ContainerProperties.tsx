import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';

/**
 * Type for the Container's props within the Craft node.
 * NOTE: We removed 'Colour' in line with removing the Text Colour property.
 */
interface ContainerProps {
  width: string;
  height: string;
  background?: string;
  margin?: number[]; // [top, right, bottom, left]
  padding?: number[]; // [top, right, bottom, left]
  radius?: number;
  shadow?: number;
  flexDirection?: 'row' | 'column';
  fillSpace?: 'yes' | 'no';
  alignItems?: 'flex-start' | 'center' | 'flex-end';
  justifyContent?: 'flex-start' | 'center' | 'flex-end';
  border?: {
    Colour?: string;
    style?: string;
    width?: number;
  };
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
  // Fallback to [0,0,0,0] if values is undefined
  const safeValues = values ?? [0, 0, 0, 0];

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
                onChangeValues(newVals);
              }}
              showValueInput={false}
            />
            <TextInput
              label={`${pos} (Manual)`}
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
    </Section>
  );
}

export const ContainerProperties = () => {
  /**
   * Pull out props from the node via useNode.
   * We strongly type them as ContainerProps so we can avoid `any`.
   */
  const {
    width,
    height,
    background,
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
      width: props.width ?? '',
      height: props.height ?? '',
      background: props.background ?? '#ffffff',
      margin: props.margin,
      padding: props.padding,
      radius: props.radius ?? 0,
      shadow: props.shadow ?? 0,
      flexDirection: props.flexDirection ?? 'row',
      fillSpace: props.fillSpace ?? 'no',
      alignItems: props.alignItems ?? 'flex-start',
      justifyContent: props.justifyContent ?? 'flex-start',
      border: props.border,
    };
  });

  return (
    <>
      {/* DIMENSIONS */}
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

      {/* COLOURS */}
      <Section title="Colours">
        <Item>
          <ColorPicker
            label="Background Colour"
            value={background || '#ffffff'}
            onChangeValue={(newVal) =>
              setProp((props: ContainerProps) => {
                props.background = newVal;
              })
            }
            allowTextInput
            helperText="Pick or enter background Colour"
          />
        </Item>
      </Section>

      {/* MARGIN */}
      <SpacingControl
        label="Margin"
        values={margin}
        onChangeValues={(vals) =>
          setProp((props: ContainerProps) => {
            props.margin = vals;
          })
        }
      />

      {/* PADDING */}
      <SpacingControl
        label="Padding"
        values={padding}
        onChangeValues={(vals) =>
          setProp((props: ContainerProps) => {
            props.padding = vals;
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

      {/* BORDER */}
      <Section title="Border">
        <Item>
          <ColorPicker
            label="Border Colour"
            value={border?.Colour || '#000000'}
            onChangeValue={(newColour) =>
              setProp((props: ContainerProps) => {
                props.border = props.border || {};
                props.border.Colour = newColour;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Border Style"
            value={border?.style || 'solid'}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.border = props.border || {};
                props.border.style = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Border Width"
            value={border?.width ?? 0}
            min={0}
            max={20}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.border = props.border || {};
                props.border.width = val;
              })
            }
          />
        </Item>
      </Section>

      {/* LAYOUT / FLEX */}
      <Section title="Layout">
        {/* First row: Flex Direction + Fill Space */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Item>
              <Radio
                label="Flex Direction"
                value={flexDirection}
                onChangeValue={(val) =>
                  setProp((props: ContainerProps) => {
                    props.flexDirection =
                      val as ContainerProps['flexDirection'];
                  })
                }
                options={[
                  { label: 'Row', value: 'row' },
                  { label: 'Column', value: 'column' },
                ]}
              />
            </Item>
          </Grid>
          <Grid item xs={12} sm={6}>
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
          </Grid>
        </Grid>

        {/* Second row: Align Items + Justify Content side by side */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <Item>
              <Radio
                label="Justify Content"
                value={justifyContent}
                onChangeValue={(val) =>
                  setProp((props: ContainerProps) => {
                    props.justifyContent =
                      val as ContainerProps['justifyContent'];
                  })
                }
                options={[
                  { label: 'Flex start', value: 'flex-start' },
                  { label: 'Center', value: 'center' },
                  { label: 'Flex end', value: 'flex-end' },
                ]}
              />
            </Item>
          </Grid>
        </Grid>
      </Section>
    </>
  );
};
