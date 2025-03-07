// webview-ui/src/components/PropertiesSidebar/UI/Slider.tsx

import React, { useCallback } from 'react';
import {
  FormControl,
  FormLabel,
  Slider as MuiSlider,
  TextField,
  Box,
  FormHelperText,
} from '@mui/material';

interface SliderProps {
  label: string;
  value: number;
  onChangeValue(newVal: number): void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  /**
   * Whether to display a text input to show & manually tweak the numeric value.
   */
  showValueInput?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChangeValue,
  min = 0,
  max = 100,
  step = 1,
  helperText,
  error,
  disabled,
  showValueInput = true,
}) => {
  const handleSliderChange = useCallback(
    (_: Event, newValue: number | number[]) => {
      if (Array.isArray(newValue)) {
        onChangeValue(newValue[0]);
      } else {
        onChangeValue(newValue);
      }
    },
    [onChangeValue]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    // Basic guard
    if (!Number.isNaN(val)) {
      onChangeValue(val);
    }
  };

  return (
    <FormControl
      component="fieldset"
      margin="normal"
      error={error}
      disabled={disabled}
      fullWidth
    >
      <FormLabel component="legend">{label}</FormLabel>
      <Box display="flex" alignItems="center" gap={2} mt={1}>
        <MuiSlider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          sx={{ flex: 1 }}
        />
        {showValueInput && (
          <TextField
            size="small"
            type="number"
            value={value}
            onChange={handleInputChange}
            sx={{ width: 80 }}
            disabled={disabled}
          />
        )}
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
