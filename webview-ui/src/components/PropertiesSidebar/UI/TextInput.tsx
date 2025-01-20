// webview-ui/src/components/PropertiesSidebar/UI/TextInput.tsx

import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

interface TextInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  label: string;
  onChangeValue(newVal: string): void;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  label,
  onChangeValue,
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
      {...rest}
    />
  );
};
