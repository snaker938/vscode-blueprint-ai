// webview-ui/src/components/PropertiesSidebar/UI/SwitchInput.tsx

import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Switch as MuiSwitch,
  FormLabel,
  FormHelperText,
} from '@mui/material';

interface SwitchInputProps {
  label: string;
  value: boolean;
  onChangeValue(newVal: boolean): void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

export const SwitchInput: React.FC<SwitchInputProps> = ({
  label,
  value,
  onChangeValue,
  helperText,
  error,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.checked);
  };

  return (
    <FormControl
      component="fieldset"
      margin="normal"
      error={error}
      disabled={disabled}
    >
      <FormLabel component="legend">{label}</FormLabel>
      <FormControlLabel
        control={
          <MuiSwitch
            checked={value}
            onChange={handleChange}
            disabled={disabled}
          />
        }
        label=""
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
