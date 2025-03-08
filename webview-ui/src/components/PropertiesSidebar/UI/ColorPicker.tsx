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
 * Parse user-entered string (which might be Hex or RGBA).
 * Return a **valid hex** (e.g. #aabbcc) or null if invalid.
 * This is a lightweight parser, so advanced formats won't be recognized.
 */
function parseToHex(input: string): string | null {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return null;

  // Check short/long hex (#abc or #aabbcc)
  const hexPattern = /^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/;
  if (hexPattern.test(trimmed)) {
    return trimmed.length === 4 ? expandShortHex(trimmed) : trimmed;
  }

  // Basic RGBA pattern: rgb(...) or rgba(...)
  // Example: rgba(255, 0, 0, 0.5) => #ff0000 after dropping alpha
  // We are ignoring alpha to produce a single #rrggbb hex
  const rgbaPattern =
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(\s*,\s*[\d.]+)?\)$/;
  const match = trimmed.match(rgbaPattern);
  if (match) {
    const r = Math.max(0, Math.min(255, parseInt(match[1], 10)));
    const g = Math.max(0, Math.min(255, parseInt(match[2], 10)));
    const b = Math.max(0, Math.min(255, parseInt(match[3], 10)));
    // Convert to #rrggbb
    const hex = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
    return `#${hex}`;
  }

  return null;
}

interface ColorPickerProps {
  /** A label for the color field. */
  label: string;
  /**
   * Incoming color value from outside. This can be anything,
   * but we'll always store a valid hex string internally.
   */
  value: unknown;

  /** Called with the final chosen hex (e.g. #ff0000). */
  onChangeValue(newHex: string): void;

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
 * A no-lag color picker powered by react-colorful:
 *  - Color wheel input (for #rrggbb)
 *  - Optional text input to enter either #rrggbb or rgb/rgba(...).
 * The final value is always stored/passed as a hex string.
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
   * Convert the incoming value to a valid hex, or #000000 if not parseable.
   */
  const parseInitial = useCallback(() => {
    if (typeof value === 'string') {
      const maybeHex = parseToHex(value);
      return maybeHex ?? '#000000';
    }
    // If it's not a string, default to black
    return '#000000';
  }, [value]);

  // The "source of truth" for the color wheel
  const [internalHex, setInternalHex] = useState<string>(parseInitial);

  // The text input (if allowed) also needs local state
  const [textValue, setTextValue] = useState<string>(parseInitial);

  // If `value` changes from the outside, sync everything
  useEffect(() => {
    const newHex = parseInitial();
    setInternalHex(newHex);
    setTextValue(newHex);
  }, [value, parseInitial]);

  /**
   * When the user moves the color wheel, update local states
   * and pass the new hex to onChangeValue.
   */
  const handleColorWheelChange = (newHex: string) => {
    setInternalHex(newHex);
    setTextValue(newHex);
    onChangeValue(newHex);
  };

  /**
   * If we show the text input, on each keystroke we just store the typed text.
   * We'll wait for blur (or Enter key, if you prefer) to parse/validate fully.
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };

  /**
   * On blur, parse the typed string. If valid, pass to color wheel + onChange.
   * If invalid, revert to the last known internalHex.
   */
  const handleTextBlur = () => {
    const parsed = parseToHex(textValue);
    if (parsed) {
      setInternalHex(parsed);
      setTextValue(parsed);
      onChangeValue(parsed);
    } else {
      // Revert
      setTextValue(internalHex);
    }
  };

  return (
    <FormControl margin="normal" error={error} disabled={disabled} fullWidth>
      <FormLabel component="legend">{label}</FormLabel>
      <Box mt={1}>
        {/* The color wheel from react-colorful (always uses #rrggbb) */}
        <HexColorPicker
          color={internalHex}
          onChange={handleColorWheelChange}
          style={{
            width: '100%',
            maxWidth: 200,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
        />

        {/* Optional text input for manual editing */}
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
              placeholder="Type #hex or rgb(...)"
            />
          </Box>
        )}
      </Box>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
