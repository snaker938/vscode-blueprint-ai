import React, { ReactNode } from 'react';
import { FormControl, InputLabel, Select } from '@mui/material';

/**
 * Defines the properties for PropertyDropdown.
 */
export interface PropertyDropdownProps {
  /** Text label for the dropdown */
  title: string;
  /** Current value of the dropdown */
  value: string | number;
  /** Called when a new value is selected */
  onChange: (newValue: string) => void;
  /** Typically <option> elements if using `native`, or <MenuItem> otherwise */
  children: ReactNode;
}

/**
 * A dropdown for editing a property in the PropertyBar.
 */
export const PropertyDropdown: React.FC<PropertyDropdownProps> = ({
  title,
  value,
  onChange,
  children,
}) => {
  return (
    <FormControl variant="outlined" size="small">
      <InputLabel>{title}</InputLabel>
      <Select
        native
        value={value}
        label={title}
        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
      >
        {children}
      </Select>
    </FormControl>
  );
};
