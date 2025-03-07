// webview-ui/src/components/PropertiesSidebar/UI/ColorPicker.tsx

import React from 'react';
import {
  FormControl,
  FormLabel,
  TextField,
  FormHelperText,
} from '@mui/material';

interface ColorPickerProps {
  label: string;
  value: string;
  onChangeValue(newVal: string): void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChangeValue,
  helperText,
  error,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.value);
  };

  return (
    <FormControl margin="normal" error={error} disabled={disabled}>
      <FormLabel component="legend">{label}</FormLabel>
      <TextField
        type="color"
        size="small"
        value={value}
        onChange={handleChange}
        inputProps={{ style: { padding: 0, width: 36, height: 36 } }}
        sx={{ width: 50, mt: 1 }}
        variant="outlined"
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
