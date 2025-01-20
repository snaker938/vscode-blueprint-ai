// webview-ui/src/components/PropertiesSidebar/UI/Radio.tsx

import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio as MuiRadio,
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
}

export const Radio: React.FC<RadioProps> = ({
  label,
  options,
  value,
  onChangeValue,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeValue(e.target.value);
  };

  return (
    <FormControl component="fieldset" margin="normal">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup value={value} onChange={handleChange}>
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={<MuiRadio size="small" />}
            label={opt.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};
