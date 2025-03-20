import { useNode } from '@craftjs/core';
// import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
// import { Slider as UISlider } from '../../PropertiesSidebar/UI/Slider';

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * (Include only if you need spacing-like controls for this slider; otherwise omit.)
 */
// function SpacingControl({
//   label,
//   values,
//   onChangeValues,
//   max = 100,
// }: {
//   label: string;
//   values?: number[];
//   onChangeValues: (newValues: number[]) => void;
//   max?: number;
// }) {
//   const safeValues = values ?? [0, 0, 0, 0];

//   return (
//     <Section title={label}>
//       <Grid container spacing={2}>
//         {['Top', 'Right', 'Bottom', 'Left'].map((pos, idx) => (
//           <Grid item xs={6} key={pos}>
//             <UISlider
//               label={`${label} ${pos}`}
//               value={safeValues[idx]}
//               min={0}
//               max={max}
//               onChangeValue={(val) => {
//                 const newVals = [...safeValues];
//                 newVals[idx] = val;
//                 onChangeValues(newVals);
//               }}
//               showValueInput={false}
//             />
//             <TextInput
//               label={pos}
//               type="number"
//               value={safeValues[idx].toString()}
//               onChangeValue={(val) => {
//                 const num = parseInt(val, 10) || 0;
//                 const newVals = [...safeValues];
//                 newVals[idx] = num;
//                 onChangeValues(newVals);
//               }}
//             />
//           </Grid>
//         ))}
//       </Grid>
//     </Section>
//   );
// }

/**
 * Props for your Slider component.
 */
export interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  orientation: 'horizontal' | 'vertical';
  width: string;
  height: string;
  backgroundColor: string;
  trackColor: string;
  thumbColor: string;
}

/**
 * A property panel to edit SliderProps in the Craft editor.
 */
export const SliderProperties = () => {
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
  } = useNode((node) => {
    const props = node.data.props as SliderProps;
    return {
      min: props.min ?? 0,
      max: props.max ?? 100,
      step: props.step ?? 1,
      value: props.value ?? 50,
      orientation: props.orientation ?? 'horizontal',
      width: props.width ?? '300px',
      height: props.height ?? '50px',
      backgroundColor: props.backgroundColor ?? '#ffffff',
      trackColor: props.trackColor ?? '#dadada',
      thumbColor: props.thumbColor ?? '#777777',
    };
  });

  return (
    <Section title="Slider Properties">
      {/* Basic numeric inputs */}
      <Item>
        <TextInput
          label="Min"
          type="number"
          value={min.toString()}
          onChangeValue={(val) =>
            setProp((props: SliderProps) => {
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
            setProp((props: SliderProps) => {
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
            setProp((props: SliderProps) => {
              props.step = parseInt(val, 10) || 1;
            })
          }
        />
      </Item>
      <Item>
        <TextInput
          label="Value"
          type="number"
          value={value.toString()}
          onChangeValue={(val) =>
            setProp((props: SliderProps) => {
              props.value = parseInt(val, 10) || 0;
            })
          }
        />
      </Item>

      {/* Orientation as a Radio group */}
      <Item>
        <Radio
          label="Orientation"
          value={orientation}
          onChangeValue={(newVal) =>
            setProp((props: SliderProps) => {
              props.orientation = newVal as SliderProps['orientation'];
            })
          }
          options={[
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
          ]}
        />
      </Item>

      {/* Dimensions */}
      <Item>
        <TextInput
          label="Width"
          value={width}
          onChangeValue={(val) =>
            setProp((props: SliderProps) => {
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
            setProp((props: SliderProps) => {
              props.height = val;
            })
          }
        />
      </Item>

      {/* Colors */}
      <Item>
        <ColorPicker
          label="Background Color"
          value={backgroundColor}
          onChangeValue={(newVal) =>
            setProp((props: SliderProps) => {
              props.backgroundColor = newVal;
            })
          }
        />
      </Item>
      <Item>
        <ColorPicker
          label="Track Color"
          value={trackColor}
          onChangeValue={(newVal) =>
            setProp((props: SliderProps) => {
              props.trackColor = newVal;
            })
          }
        />
      </Item>
      <Item>
        <ColorPicker
          label="Thumb Color"
          value={thumbColor}
          onChangeValue={(newVal) =>
            setProp((props: SliderProps) => {
              props.thumbColor = newVal;
            })
          }
        />
      </Item>

      {/* (Optional) Spacing controls, if you need them */}
      {/* 
      <SpacingControl
        label="Slider Margin"
        values={[0, 0, 0, 0]}
        onChangeValues={() => {}}
      />
      */}
    </Section>
  );
};
