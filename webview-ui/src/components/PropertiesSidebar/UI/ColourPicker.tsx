// webview-ui/src/components/PropertiesSidebar/UI/ColourPicker.tsx

import React, { useState, useCallback } from 'react';
import {
  FormControl,
  FormLabel,
  TextField,
  Box,
  FormHelperText,
} from '@mui/material';

/**
 * Expand short HEX (#abc) to full 6-digit HEX (#aabbcc).
 */
function expandShortHex(hex: string): string {
  // Already 7 characters? (#rrggbb) Just return as is.
  if (hex.length === 7) return hex.toLowerCase();

  // Must be # + 3 chars => #abc
  const r = hex[1];
  const g = hex[2];
  const b = hex[3];
  return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
}

/**
 * Attempt to parse a color string in short/long HEX or RGBA format
 * and return a standardized CSS color string or null if invalid.
 */
function parseColorString(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Matches #abc or #aabbcc (3 or 6 hex digits)
  const hexPattern = /^#[A-Fa-f0-9]{3}$|^#[A-Fa-f0-9]{6}$/;
  const rgbaPattern = /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+(\s*,\s*[\d.]+)?\)$/;

  if (hexPattern.test(trimmed)) {
    // Expand short hex if needed
    if (trimmed.length === 4) {
      return expandShortHex(trimmed);
    }
    return trimmed.toLowerCase();
  }

  if (rgbaPattern.test(trimmed)) {
    return trimmed;
  }

  return null;
}

interface ColourPickerProps {
  label: string;
  /** Value is a valid CSS color (e.g. "#ff0000" or "rgba(255,0,0,0.5)" ) */
  value: string;
  onChangeValue(newVal: string): void;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  /**
   * If true, shows the text input for manual editing (HEX or RGBA)
   */
  allowTextInput?: boolean;
}

/**
 * A color picker that supports both
 * - input[type="color"] picking (only #rrggbb)
 * - manual text input (HEX or RGBA)
 */
export const ColourPicker: React.FC<ColourPickerProps> = ({
  label,
  value,
  onChangeValue,
  helperText,
  error,
  disabled,
  allowTextInput = true,
}) => {
  const [textValue, setTextValue] = useState(value);

  // Whenever the color changes from outside, sync our text input
  React.useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleColorInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newColor = e.target.value; // always #rrggbb from an <input type="color" />
      setTextValue(newColor);
      onChangeValue(newColor);
    },
    [onChangeValue]
  );

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleTextInputBlur = () => {
    // Validate on blur
    const parsed = parseColorString(textValue);
    if (parsed) {
      onChangeValue(parsed);
    } else {
      // revert if invalid
      setTextValue(value);
    }
  };

  // For the <input type="color">, we must supply a 7-char hex (#rrggbb).
  // If it's not parseable as a hex, default to "#000000".
  let safeHex = '#000000';
  const parsed = parseColorString(value);
  if (parsed && parsed.startsWith('#')) {
    // If it's a short hex (#abc), expand to #aabbcc
    safeHex = parsed.length === 4 ? expandShortHex(parsed) : parsed;
  }

  return (
    <FormControl margin="normal" error={error} disabled={disabled} fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <Box display="flex" alignItems="center" gap={2} mt={1}>
        {/* Color Input */}
        <input
          type="color"
          value={safeHex}
          onChange={handleColorInputChange}
          disabled={disabled}
          style={{
            width: 40,
            height: 40,
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: 0,
            border: 'none',
            background: 'none',
          }}
        />

        {/* Optional text input for manual RGBA/HEX entry */}
        {allowTextInput && (
          <TextField
            size="small"
            variant="outlined"
            fullWidth
            value={textValue}
            onChange={handleTextInputChange}
            onBlur={handleTextInputBlur}
            placeholder="e.g. #ff0000 or rgba(255,0,0,1)"
            disabled={disabled}
          />
        )}
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
