// webview-ui/src/components/PropertiesSidebar/UI/Radio.tsx

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio as MuiRadio,
  FormHelperText,
} from '@mui/material';

interface RadioOption {
  label: string;
  value: string;
}

interface RadioProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChangeValue(newVal: string): void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  /**
   * If you want the radios in a row instead of stacked column
   */
  row?: boolean;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  options,
  value,
  onChangeValue,
  helperText,
  error,
  disabled,
  row = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.value);
  };

  return (
    <FormControl
      component="fieldset"
      margin="normal"
      error={error}
      disabled={disabled}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup value={value} onChange={handleChange} row={row}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<MuiRadio size="small" />}
            label={opt.label}
          />
        ))}
      </RadioGroup>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
