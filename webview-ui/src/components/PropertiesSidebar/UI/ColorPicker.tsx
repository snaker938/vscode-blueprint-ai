// webview-ui/src/components/PropertiesSidebar/UI/ColorPicker.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { HexColorPicker } from 'react-colorful';
import {
  FormControl,
  FormLabel,
  TextField,
  Box,
  FormHelperText,
} from '@mui/material';

/**
 * Convert short hex (#abc) to full 6-digit hex (#aabbcc).
 */
function expandShortHex(hex: string): string {
  if (hex.length === 4) {
    // #abc => #aabbcc
    const r = hex[1];
    const g = hex[2];
    const b = hex[3];
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  return hex.toLowerCase();
}

/**
 * Parse user-entered string (which might be Hex, "transparent", or RGBA).
 * Return either a valid hex (#rrggbb), the string "transparent", or null if invalid.
 */
function parseToHex(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // --- NEW: Allow exact "transparent"
  if (trimmed === 'transparent') {
    return 'transparent';
  }

  // Check short/long hex (#abc or #aabbcc)
  const hexPattern = /^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/;
  if (hexPattern.test(trimmed)) {
    return trimmed.length === 4 ? expandShortHex(trimmed) : trimmed;
  }

  // Basic RGBA pattern: rgb(...) or rgba(...)
  // We'll ignore alpha for the final hex—unless alpha is 0, in which case we treat it as "transparent".
  const rgbaPattern =
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*([\d.]+))?\)$/;
  const match = trimmed.match(rgbaPattern);
  if (match) {
    const r = Math.max(0, Math.min(255, parseInt(match[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(match[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(match[3], 10)));
    // If there's an alpha group and it's 0 or less, treat as transparent
    if (match[5]) {
      const alphaVal = parseFloat(match[5]);
      if (!isNaN(alphaVal) && alphaVal <= 0) {
        return 'transparent';
      }
    }
    // Convert RGB to #rrggbb
    const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    return `#${hex}`;
  }

  return null;
}

interface ColorPickerProps {
  /** A label for the color field. */
  label: string;
  /**
   * Incoming color value (could be a string like "#ffffff", "transparent", etc.).
   */
  value: unknown;

  /** Called with the final chosen color (either #rrggbb or "transparent"). */
  onChangeValue(newColor: string): void;

  helperText?: string;
  error?: boolean;
  disabled?: boolean;

  /**
   * If `true`, a text field will show below the color wheel
   * for direct editing of Hex or RGBA. Defaults to `true`.
   */
  allowTextInput?: boolean;
}

/**
 * A color picker with a wheel + optional text input.
 * The final value is always stored/passed as a hex string or "transparent".
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChangeValue,
  helperText,
  error,
  disabled,
  allowTextInput = true,
}) => {
  /**
   * Convert the incoming value to a valid color ("transparent" or #rrggbb),
   * or fallback to #000000 if invalid.
   */
  const parseInitial = useCallback(() => {
    if (typeof value === 'string') {
      const maybeHex = parseToHex(value);
      return maybeHex ?? '#000000';
    }
    // If it's not a string, default to black
    return '#000000';
  }, [value]);

  // The "source of truth" for the color wheel & text field
  const [internalColor, setInternalColor] = useState<string>(parseInitial);

  // Keep text field in sync
  const [textValue, setTextValue] = useState<string>(parseInitial);

  // If `value` changes from outside, sync everything
  useEffect(() => {
    const newColor = parseInitial();
    setInternalColor(newColor);
    setTextValue(newColor);
  }, [value, parseInitial]);

  /**
   * When user changes the color wheel, we store that color in state
   * (unless it was "transparent", which is not directly representable on the wheel).
   */
  const handleColorWheelChange = (newHex: string) => {
    setInternalColor(newHex);
    setTextValue(newHex);
    onChangeValue(newHex);
  };

  /**
   * For the text input changes, we'll parse on blur.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  const handleTextBlur = () => {
    const parsed = parseToHex(textValue);
    if (parsed) {
      setInternalColor(parsed);
      setTextValue(parsed);
      onChangeValue(parsed);
    } else {
      // If invalid, revert
      setTextValue(internalColor);
    }
  };

  // For the color wheel, if we have "transparent", fallback to #000000 visually.
  const wheelColor =
    internalColor === 'transparent' ? '#000000' : internalColor;

  return (
    <FormControl margin="normal" error={error} disabled={disabled} fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <Box mt={1}>
        {/* The color wheel from react-colorful (cannot directly show transparency) */}
        <HexColorPicker
          color={wheelColor}
          onChange={handleColorWheelChange}
          style={{
            width: '100%',
            maxWidth: 200,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        />

        {/* Optional text input for manual editing (supports "transparent") */}
        {allowTextInput && (
          <Box mt={2}>
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              value={textValue}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              disabled={disabled}
              placeholder="Type #hex, rgb(...), or 'transparent'"
            />
          </Box>
        )}
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
