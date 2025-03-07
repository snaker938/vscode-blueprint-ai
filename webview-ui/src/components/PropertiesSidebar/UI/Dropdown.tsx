// webview-ui/src/components/PropertiesSidebar/UI/Dropdown.tsx

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps extends Omit<SelectProps, 'onChange' | 'value'> {
  label: string;
  options: Option[];
  value: string;
  onChangeValue(newVal: string): void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  /**
   * If you want to show a "no selection" placeholder
   */
  placeholder?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChangeValue,
  helperText,
  error,
  disabled,
  placeholder,
  ...rest
}) => {
  const handleChange = (e: SelectChangeEvent<unknown>) => {
    onChangeValue(e.target.value as string);
  };

  return (
    <FormControl
      fullWidth
      size="small"
      margin="normal"
      error={error}
      disabled={disabled}
    >
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange} {...rest}>
        {placeholder && (
          <MenuItem disabled value="">
            {placeholder}
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
