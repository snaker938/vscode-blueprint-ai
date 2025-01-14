import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, Box } from '@mui/material';
import { ChromePicker, ColorResult } from 'react-color';

export interface PropertyTextInputProps {
  /**
   * An optional prefix displayed before the input text (not used if type is 'color' or 'bg').
   */
  prefix?: string;
  /**
   * The input's label text.
   */
  label?: string;
  /**
   * The type of input. 'color' or 'bg' will show a color swatch and open ChromePicker.
   * Added 'number' to allow numeric usage as well.
   */
  type?: 'text' | 'color' | 'bg' | 'number';
  /**
   * Fired when the user commits a new value (e.g., pressing Enter or picking a new color).
   */
  onChange?: (newValue: any) => void;
  /**
   * The initial/current value.
   */
  value?: any;
  /**
   * Whether the input is disabled.
   */
  disabled?: boolean;
  /**
   * Displays error styling if true.
   */
  error?: boolean;
  /**
   * Additional helper text below the input.
   */
  helperText?: string;
}

/**
 * PropertyTextInput
 * A text field that optionally supports color picking with react-color's ChromePicker.
 */
export const PropertyTextInput: React.FC<PropertyTextInputProps> = ({
  prefix,
  label,
  type = 'text',
  onChange,
  value,
  disabled = false,
  error = false,
  helperText,
}) => {
  const [internalValue, setInternalValue] = useState<any>(value);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sync internal state when parent 'value' changes
  useEffect(() => {
    if (type === 'color' || type === 'bg') {
      // Convert {r,g,b,a} to 'rgba(...)'
      if (value && typeof value === 'object') {
        setInternalValue(`rgba(${Object.values(value)})`);
      } else {
        setInternalValue('');
      }
    } else {
      setInternalValue(value ?? '');
    }
  }, [value, type]);

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onChange) {
      onChange((e.target as HTMLInputElement).value);
    }
  };

  const handleColorPick = (color: ColorResult) => {
    onChange?.(color.rgb);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
  };

  const showColorPicker = type === 'color' || type === 'bg';

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      {/* If this is a color input and the user clicked it, show the color picker */}
      {showColorPicker && pickerOpen && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 9999,
            top: 'calc(100% + 10px)',
            left: 0,
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing on self-click
        >
          {/* Click outside region to close */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
            }}
            onClick={() => setPickerOpen(false)}
          />
          <ChromePicker color={value} onChange={handleColorPick} />
        </Box>
      )}

      <TextField
        label={label}
        value={internalValue || ''}
        onKeyDown={handleEnterPress}
        onChange={handleInputChange}
        variant="filled"
        fullWidth
        disabled={disabled}
        error={error}
        helperText={helperText}
        InputProps={{
          disableUnderline: true,
          startAdornment: prefix && !showColorPicker && (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ),
          endAdornment: showColorPicker && (
            <InputAdornment
              position="end"
              sx={{ cursor: 'pointer' }}
              onClick={() => setPickerOpen(!pickerOpen)}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: internalValue,
                  border: '1px solid #ccc',
                }}
              />
            </InputAdornment>
          ),
          sx: {
            backgroundColor: '#efeff1',
            borderRadius: '100px',
            fontSize: '12px',
            // Padding consistent with original styles:
            pl: 3.5,
            py: 1,
          },
        }}
        InputLabelProps={{
          shrink: true,
          sx: {
            color: 'rgb(128,128,128)',
            fontSize: 14,
          },
        }}
      />
    </Box>
  );
};
