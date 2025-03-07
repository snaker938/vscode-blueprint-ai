// webview-ui/src/components/PropertiesSidebar/UI/TextInput.tsx

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TextInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  label: string;
  onChangeValue(newVal: string): void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  /**
   * Sometimes you might want a numeric field or password field, etc.
   * e.g.: type="number" | "text" | "password"
   */
  type?: React.HTMLInputTypeAttribute;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  label,
  onChangeValue,
  helperText,
  error,
  disabled,
  type = 'text',
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.value);
  };

  return (
    <TextField
      size="small"
      fullWidth
      margin="normal"
      label={label}
      variant="outlined"
      value={value}
      onChange={handleChange}
      helperText={helperText}
      error={error}
      disabled={disabled}
      type={type}
      {...rest}
    />
  );
};
