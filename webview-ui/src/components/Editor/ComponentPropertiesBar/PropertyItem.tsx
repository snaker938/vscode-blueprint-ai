import React from 'react';
import { useNode } from '@craftjs/core';
import {
  Grid,
  RadioGroup,
  styled,
  Slider,
  SliderProps,
  Divider,
} from '@mui/material';
import { PropertyTextInput } from './PropertyTextInput';
import { PropertyDropdown } from './PropertyDropdown';

export type PropertyItemType =
  | 'text'
  | 'color'
  | 'bg'
  | 'number'
  | 'slider'
  | 'radio'
  | 'select';

export interface PropertyItemProps {
  /** Unique key in node.data.props to bind this item to */
  propKey: string;
  /** The type of control (text, color, slider, etc.) */
  type: PropertyItemType;
  /** If true, occupies the full row in a <Grid> container */
  full?: boolean;
  /** Optional array index if the target prop is an array */
  index?: number;
  /** Text label or prefix for certain controls */
  label?: string;
  /** Custom prefix symbol for text input */
  prefix?: string;
  /** Called when the user changes the control’s value */
  onChange?: (value: any) => any;
  /** Child elements if type=radio or type=select */
  children?: React.ReactNode;
}

/**
 * A type guard to confirm if the current `type` is a valid text input type
 * recognized by PropertyTextInput.
 */
function isTextInputType(
  t: PropertyItemType
): t is 'text' | 'color' | 'bg' | 'number' {
  return ['text', 'color', 'bg', 'number'].includes(t);
}

/** A styled slider for consistent design across property controls. */
const StyledSlider = styled((props: SliderProps) => <Slider {...props} />)(
  () => ({
    color: '#3880ff',
    height: 2,
    padding: '5px 0',
    '& .MuiSlider-thumb': {
      height: 14,
      width: 14,
      backgroundColor: '#fff',
      boxShadow:
        '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
      marginTop: -7,
      marginLeft: -7,
      '&:focus, &:hover, &.Mui-active': {
        boxShadow:
          '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
        '@media (hover: none)': {
          boxShadow:
            '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
        },
      },
    },
    '& .MuiSlider-track': {
      height: 2,
    },
    '& .MuiSlider-rail': {
      height: 2,
      opacity: 0.5,
      backgroundColor: '#bfbfbf',
    },
  })
);

/**
 * PropertyItem
 * Renders a single control (text, slider, select, etc.) for editing a node prop.
 */
export const PropertyItem: React.FC<PropertyItemProps> = ({
  full = false,
  propKey,
  type,
  onChange,
  index,
  label,
  prefix,
  children,
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propKey],
  }));

  const currentValue = Array.isArray(propValue)
    ? propValue[index ?? 0]
    : propValue;

  // Function to update the node prop with optional throttling
  const updateProp = (newVal: any, throttleRate = 500) => {
    setProp((props: any) => {
      if (Array.isArray(propValue)) {
        props[propKey][index ?? 0] = onChange ? onChange(newVal) : newVal;
      } else {
        props[propKey] = onChange ? onChange(newVal) : newVal;
      }
    }, throttleRate);
  };

  return (
    <Grid item xs={full ? 12 : 6}>
      <div style={{ marginBottom: 8 }}>
        {/* 1) If it's a text-like input: text, color, bg, or number */}
        {isTextInputType(type) && (
          <PropertyTextInput
            label={label}
            prefix={prefix}
            type={type} // TS is happy now because of the type guard
            value={currentValue}
            onChange={(val) => updateProp(val, 500)}
          />
        )}

        {/* 2) If it's a slider */}
        {type === 'slider' && (
          <>
            {label && <h4 style={{ margin: 0 }}>{label}</h4>}
            <StyledSlider
              value={parseInt(currentValue) || 0}
              onChange={(_, val) => updateProp(val, 1000)}
            />
          </>
        )}

        {/* 3) If it's a radio */}
        {type === 'radio' && (
          <>
            {label && <h4 style={{ margin: 0 }}>{label}</h4>}
            <RadioGroup
              value={currentValue ?? ''}
              onChange={(e) => updateProp(e.target.value)}
            >
              {children}
            </RadioGroup>
          </>
        )}

        {/* 4) If it's a select */}
        {type === 'select' && (
          <PropertyDropdown
            label={label ?? ''}
            value={String(currentValue ?? '')} // cast to string for the dropdown
            onChange={(val) => updateProp(val)}
          >
            {children}
          </PropertyDropdown>
        )}

        {/* 5) If it's 'number' specifically, you can add numeric logic here */}
        {type === 'number' && <Divider style={{ marginTop: 4 }} />}
      </div>
    </Grid>
  );
};
