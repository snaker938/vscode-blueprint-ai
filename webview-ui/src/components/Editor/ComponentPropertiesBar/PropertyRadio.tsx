import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Radio,
  RadioProps,
  FormControlLabel,
  FormControlLabelProps,
} from '@mui/material';

/**
 * Styled span for the unselected radio icon.
 */
const UncheckedIcon = styled('span')(() => ({
  borderRadius: '100%',
  width: 15,
  height: 15,
  background: 'transparent',
  position: 'relative',
  padding: '3px',
  border: '2px solid rgb(142, 142, 142)',
  transition: '0.4s cubic-bezier(0.19, 1, 0.22, 1)',
}));

/**
 * Styled span for the selected radio icon.
 */
const CheckedIcon = styled(UncheckedIcon)(() => ({
  background: 'rgb(19, 115, 230)',
  borderColor: 'transparent',
  '&::before': {
    content: '""',
    display: 'block',
    width: '100%',
    height: '100%',
    borderRadius: '100%',
    background: '#fff',
  },
}));

/**
 * A custom radio component that replaces MUI's default icons with our styled icons.
 */
const CustomRadio = (props: RadioProps) => (
  <Radio
    disableRipple
    color="default"
    checkedIcon={<CheckedIcon />}
    icon={<UncheckedIcon />}
    {...props}
  />
);

/**
 * Props for the PropertyRadio component.
 */
export interface PropertyRadioProps
  extends Omit<FormControlLabelProps, 'control'> {
  /** The value represented by this radio option. */
  value: string;
  /** The visible label for the radio option. */
  label: string;
}

/**
 * PropertyRadio
 * A stylized radio option for property settings,
 * retaining custom icon styles from the older system.
 */
export const PropertyRadio: React.FC<PropertyRadioProps> = ({
  value,
  label,
  ...rest
}) => {
  return (
    <FormControlLabel
      sx={{
        '.MuiFormControlLabel-label': {
          fontSize: '15px',
        },
      }}
      value={value}
      control={<CustomRadio />}
      label={label}
      {...rest}
    />
  );
};
