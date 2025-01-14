import React, { ReactNode } from 'react';
import { FormControl, InputLabel, Select } from '@mui/material';

/**
 * Defines the properties for PropertyDropdown.
 */
export interface PropertyDropdownProps {
  /** Optional text label for the dropdown */
  label?: string;
  /** Current value of the dropdown */
  value: string | number;
  /** Called when a new value is selected */
  onChange: (newValue: string) => void;
  /** Typically <option> elements if using `native`, or <MenuItem> if not */
  children: ReactNode;
}

/**
 * A dropdown for editing a property in the PropertyBar.
 * By default, uses native <option> elements (native={true}).
 */
export const PropertyDropdown: React.FC<PropertyDropdownProps> = ({
  label,
  value,
  onChange,
  children,
}) => {
  return (
    <FormControl variant="outlined" size="small">
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        native
        value={value}
        label={label}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
      >
        {children}
      </Select>
    </FormControl>
  );
};
