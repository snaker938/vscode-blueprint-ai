// webview-ui/src/components/PropertiesSidebar/UI/Dropdown.tsx

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectProps,
  SelectChangeEvent,
} from '@mui/material';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps extends Omit<SelectProps, 'onChange'> {
  label: string;
  options: Option[];
  value: string;
  onChangeValue(newVal: string): void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChangeValue,
  ...rest
}) => {
  const handleChange = (e: SelectChangeEvent<unknown>) => {
    onChangeValue(e.target.value as string);
  };

  return (
    <FormControl fullWidth size="small" margin="normal">
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange} {...rest}>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
