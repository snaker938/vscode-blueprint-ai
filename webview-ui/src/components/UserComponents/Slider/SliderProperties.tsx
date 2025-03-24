import { useNode } from '@craftjs/core';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';

/**
 * Matches the updated ISliderProps from the new Slider component.
 */
export interface ISliderProps {
  min: number;
  max: number;
  step: number;
  currentValue: number;
  orientation: 'horizontal' | 'vertical';
  width: string;
  height: string;
  thumbColor: string;
  trackColor: string;

  // Individual margins
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;

  // Individual paddings
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;

  trackThickness?: number;

  // Show/hide numeric value
  showValue: boolean;
  // Numeric value styling
  valueColor?: string;
  valueFontSize?: string;
  valueFontWeight?: string;
}

/**
 * A property panel to edit the new Slider props in the Craft editor.
 */
export const SliderProperties = () => {
  const {
    min,
    max,
    step,
    currentValue,
    orientation,
    width,
    height,
    thumbColor,
    trackColor,

    marginTop,
    marginRight,
    marginBottom,
    marginLeft,

    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,

    trackThickness,
    showValue,
    valueColor,
    valueFontSize,
    valueFontWeight,

    actions: { setProp },
  } = useNode((node) => {
    const props = node.data.props as ISliderProps;
    return {
      min: props.min ?? 0,
      max: props.max ?? 100,
      step: props.step ?? 1,
      currentValue: props.currentValue ?? 50,
      orientation: props.orientation ?? 'horizontal',
      width: props.width ?? '300px',
      height: props.height ?? '40px',
      thumbColor: props.thumbColor ?? '#ffffff',
      trackColor: props.trackColor ?? '#0078d4',

      marginTop: props.marginTop ?? '0px',
      marginRight: props.marginRight ?? '0px',
      marginBottom: props.marginBottom ?? '0px',
      marginLeft: props.marginLeft ?? '0px',

      paddingTop: props.paddingTop ?? '0px',
      paddingRight: props.paddingRight ?? '0px',
      paddingBottom: props.paddingBottom ?? '0px',
      paddingLeft: props.paddingLeft ?? '0px',

      trackThickness: props.trackThickness ?? 8,
      showValue: props.showValue ?? true,
      valueColor: props.valueColor ?? '#000000',
      valueFontSize: props.valueFontSize ?? '14px',
      valueFontWeight: props.valueFontWeight ?? 'normal',
    };
  });

  return (
    <Section title="Slider Properties">
      {/* Range constraints */}
      <Item>
        <TextInput
          label="Min"
          type="number"
          value={min.toString()}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.min = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Max"
          type="number"
          value={max.toString()}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.max = parseInt(val, 10) || 100;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Step"
          type="number"
          value={step.toString()}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.step = parseInt(val, 10) || 1;
            })
          }
        />
      </Item>

      {/* Controlled value */}
      <Item>
        <TextInput
          label="Current Value"
          type="number"
          value={currentValue.toString()}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.currentValue = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>

      {/* Orientation */}
      <Item>
        <Radio
          label="Orientation"
          value={orientation}
          onChangeValue={(newVal) =>
            setProp((props: ISliderProps) => {
              props.orientation = newVal as ISliderProps['orientation'];
            })
          }
          options={[
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ]}
        />
      </Item>

      {/* Width / Height */}
      <Item>
        <TextInput
          label="Width"
          value={width}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
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
            setProp((props: ISliderProps) => {
              props.height = val;
            })
          }
        />
      </Item>

      {/* Track thickness */}
      <Item>
        <TextInput
          label="Track Thickness"
          type="number"
          value={trackThickness.toString()}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.trackThickness = parseInt(val, 10) || 8;
            })
          }
        />
      </Item>

      {/* Toggle show/hide value (could be checkbox or radio) */}
      <Item>
        <Radio
          label="Show Value?"
          value={showValue ? 'yes' : 'no'}
          onChangeValue={(newVal) =>
            setProp((props: ISliderProps) => {
              props.showValue = newVal === 'yes';
            })
          }
          options={[
            { label: 'Yes', value: 'yes' },
            { label: 'No', value: 'no' },
          ]}
        />
      </Item>

      {/* Value label styling */}
      {showValue && (
        <>
          <Item>
            <ColorPicker
              label="Value Label Color"
              value={valueColor || '#000000'}
              onChangeValue={(newVal) =>
                setProp((props: ISliderProps) => {
                  props.valueColor = newVal;
                })
              }
            />
          </Item>
          <Item>
            <TextInput
              label="Value Label Font Size"
              value={valueFontSize || ''}
              onChangeValue={(val) =>
                setProp((props: ISliderProps) => {
                  props.valueFontSize = val || '14px';
                })
              }
            />
          </Item>
          <Item>
            <TextInput
              label="Value Label Font Weight"
              value={valueFontWeight || ''}
              onChangeValue={(val) =>
                setProp((props: ISliderProps) => {
                  props.valueFontWeight = val || 'normal';
                })
              }
            />
          </Item>
        </>
      )}

      {/* Colors */}
      <Item>
        <ColorPicker
          label="Thumb Color"
          value={thumbColor}
          onChangeValue={(newVal) =>
            setProp((props: ISliderProps) => {
              props.thumbColor = newVal;
            })
          }
        />
      </Item>
      <Item>
        <ColorPicker
          label="Track Color"
          value={trackColor}
          onChangeValue={(newVal) =>
            setProp((props: ISliderProps) => {
              props.trackColor = newVal;
            })
          }
        />
      </Item>

      {/* Margins */}
      <Item>
        <TextInput
          label="Margin Top"
          value={marginTop}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.marginTop = val;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Margin Right"
          value={marginRight}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.marginRight = val;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Margin Bottom"
          value={marginBottom}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.marginBottom = val;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Margin Left"
          value={marginLeft}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.marginLeft = val;
            })
          }
        />
      </Item>

      {/* Paddings */}
      <Item>
        <TextInput
          label="Padding Top"
          value={paddingTop}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.paddingTop = val;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Padding Right"
          value={paddingRight}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.paddingRight = val;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Padding Bottom"
          value={paddingBottom}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.paddingBottom = val;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Padding Left"
          value={paddingLeft}
          onChangeValue={(val) =>
            setProp((props: ISliderProps) => {
              props.paddingLeft = val;
            })
          }
        />
      </Item>
    </Section>
  );
};
