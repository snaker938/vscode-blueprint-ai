import React from 'react';
import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider as SliderControl } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * The interface describing the Slider node's props in the editor.
 * Must not be empty, so we fully describe the relevant fields:
 */
interface ISliderNodeProps {
  min: number;
  max: number;
  step: number;
  value: number;
  orientation: 'horizontal' | 'vertical';
  width?: string;
  height?: string;
  backgroundColor?: string;
  trackColor?: string;
  thumbColor?: string;
}

/**
 * The SliderProperties panel allows the user to edit the Slider component's props.
 */
export const SliderProperties: React.FC = () => {
  const {
    min,
    max,
    step,
    value,
    orientation,
    width,
    height,
    backgroundColor,
    trackColor,
    thumbColor,
    actions: { setProp },
  } = useNode((node) => ({
    min: node.data.props.min,
    max: node.data.props.max,
    step: node.data.props.step,
    value: node.data.props.value,
    orientation: node.data.props.orientation,
    width: node.data.props.width,
    height: node.data.props.height,
    backgroundColor: node.data.props.backgroundColor,
    trackColor: node.data.props.trackColor,
    thumbColor: node.data.props.thumbColor,
  }));

  return (
    <>
      {/* ========== SLIDER SETTINGS SECTION ========== */}
      <Section title="Slider Settings" defaultExpanded>
        {/* Current value */}
        <Item>
          <SliderControl
            label="Value"
            value={value}
            min={min}
            max={max}
            step={step}
            onChangeValue={(newVal) =>
              setProp((props: ISliderNodeProps) => {
                props.value = newVal;
              })
            }
            helperText="Adjust the current slider value"
          />
        </Item>

        {/* Min, Max, Step */}
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Item>
              <SliderControl
                label="Min"
                value={min}
                min={0}
                max={1000}
                onChangeValue={(newVal) =>
                  setProp((props: ISliderNodeProps) => {
                    props.min = newVal;
                    // If value < min, also adjust value
                    if (props.value < newVal) {
                      props.value = newVal;
                    }
                  })
                }
                helperText="Minimum"
              />
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <SliderControl
                label="Max"
                value={max}
                min={0}
                max={1000}
                onChangeValue={(newVal) =>
                  setProp((props: ISliderNodeProps) => {
                    props.max = newVal;
                    // If value > max, also adjust value
                    if (props.value > newVal) {
                      props.value = newVal;
                    }
                  })
                }
                helperText="Maximum"
              />
            </Item>
          </Grid>
          <Grid item xs={4}>
            <Item>
              <SliderControl
                label="Step"
                value={step}
                min={1}
                max={100}
                onChangeValue={(newVal) =>
                  setProp((props: ISliderNodeProps) => {
                    // Force step >= 1
                    props.step = newVal < 1 ? 1 : newVal;
                  })
                }
                helperText="Increment step"
              />
            </Item>
          </Grid>
        </Grid>

        {/* Orientation */}
        <Item>
          <Dropdown
            label="Orientation"
            value={orientation}
            onChangeValue={(newVal) =>
              setProp((props: ISliderNodeProps) => {
                props.orientation = newVal as 'horizontal' | 'vertical';
              })
            }
            options={[
              { label: 'Horizontal', value: 'horizontal' },
              { label: 'Vertical', value: 'vertical' },
            ]}
            helperText="Slider orientation"
          />
        </Item>
      </Section>

      {/* ========== SLIDER STYLES SECTION ========== */}
      <Section title="Slider Styles" defaultExpanded={false}>
        {/* Width & Height */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Item>
              <TextInput
                label="Width"
                value={width || ''}
                onChangeValue={(val) =>
                  setProp((props: ISliderNodeProps) => {
                    props.width = val;
                  })
                }
                helperText="CSS width (e.g. 200px or 100%)"
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextInput
                label="Height"
                value={height || ''}
                onChangeValue={(val) =>
                  setProp((props: ISliderNodeProps) => {
                    props.height = val;
                  })
                }
                helperText="CSS height (e.g. 30px or auto)"
              />
            </Item>
          </Grid>
        </Grid>

        {/* Background Color */}
        <Item>
          <ColorPicker
            label="Background Color"
            value={backgroundColor || '#ffffff'}
            onChangeValue={(newHex) =>
              setProp((props: ISliderNodeProps) => {
                props.backgroundColor = newHex;
              })
            }
            helperText="Slider container background"
            allowTextInput
          />
        </Item>

        {/* Track Color */}
        <Item>
          <ColorPicker
            label="Track Color"
            value={trackColor || '#2196F3'}
            onChangeValue={(newHex) =>
              setProp((props: ISliderNodeProps) => {
                props.trackColor = newHex;
              })
            }
            helperText="Color of the slider's track"
            allowTextInput
          />
        </Item>

        {/* Thumb Color */}
        <Item>
          <ColorPicker
            label="Thumb Color"
            value={thumbColor || '#ffffff'}
            onChangeValue={(newHex) =>
              setProp((props: ISliderNodeProps) => {
                props.thumbColor = newHex;
              })
            }
            helperText="Color of the slider's thumb/handle"
            allowTextInput
          />
        </Item>
      </Section>
    </>
  );
};
