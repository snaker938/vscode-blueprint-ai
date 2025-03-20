import React, { CSSProperties, FC, useCallback } from 'react';
import { useNode } from '@craftjs/core';
import { RadioButtonsProperties } from './RadioButtonProperties';

/**
 * Props for the RadioButtons component
 */
export interface IRadioButtonsProps {
  /**
   * The label text that appears above the group of radio buttons
   */
  label?: string;

  /**
   * The list of options displayed as radio buttons
   */
  options?: string[];

  /**
   * The currently selected option
   */
  selectedValue?: string;

  /**
   * Handler called when a radio button selection changes
   */
  onChange?: (newValue: string) => void;

  /**
   * Background color for the container
   */
  background?: string;

  /**
   * Text color for the options (and label if any)
   */
  color?: string;

  /**
   * Border radius for the container (in px)
   */
  radius?: number;

  /**
   * Margin around the container, in [top, right, bottom, left] format
   */
  margin?: number[];

  /**
   * Padding inside the container, in [top, right, bottom, left] format
   */
  padding?: number[];

  /**
   * Optional children (uncommon for radio usage, but available)
   */
  children?: React.ReactNode;
}

/**
 * Default props for the RadioButtons component
 */
const defaultProps: Partial<IRadioButtonsProps> = {
  label: 'Radio Buttons',
  options: ['Option 1', 'Option 2'],
  selectedValue: '',
  onChange: undefined,
  background: '#ffffff',
  color: '#000000',
  radius: 0,
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

/**
 * Helper to convert numeric [top, right, bottom, left] arrays to CSS spacing
 */
function spacingToCSS(spacing?: number[]): string {
  if (!spacing || spacing.length !== 4) {
    return '0px';
  }
  const [top, right, bottom, left] = spacing;
  return `${top}px ${right}px ${bottom}px ${left}px`;
}

/**
 * RadioButtons component
 */
export const RadioButtons: FC<IRadioButtonsProps> & {
  craft?: any;
} = (incomingProps) => {
  // We don't need the 'node' parameter, so we omit it to avoid lint errors
  const { connectors } = useNode(() => ({}));

  // Merge default props with incoming
  const props: IRadioButtonsProps = { ...defaultProps, ...incomingProps };

  // Extract props
  const {
    label,
    options,
    selectedValue,
    onChange,
    background,
    color,
    radius,
    margin,
    padding,
  } = props;

  // Handle radio changes
  const handleChange = useCallback(
    (value: string) => {
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );

  // Compute styles
  const containerStyle: CSSProperties = {
    display: 'inline-block',
    background,
    color,
    borderRadius: radius ?? 0,
    margin: spacingToCSS(margin),
    padding: spacingToCSS(padding),
  };

  // Safely connect the ref to Craft.js only if it's not null
  const connectRef = useCallback(
    (ref: HTMLDivElement | null) => {
      if (ref) {
        connectors.connect(ref);
      }
    },
    [connectors]
  );

  return (
    <div ref={connectRef} style={containerStyle}>
      {label && (
        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{label}</div>
      )}
      {options &&
        options.map((opt) => (
          <label
            key={opt}
            style={{ display: 'block', cursor: 'pointer', margin: '2px 0' }}
          >
            <input
              type="radio"
              name={label}
              style={{ marginRight: '6px' }}
              checked={selectedValue === opt}
              onChange={() => handleChange(opt)}
            />
            {opt}
          </label>
        ))}
      {/* Render any nested children (uncommon for radio usage, but available) */}
      {props.children}
    </div>
  );
};

/**
 * Attach Craft-related configuration to the component
 */
RadioButtons.craft = {
  displayName: 'RadioButtons',
  props: defaultProps,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: RadioButtonsProperties,
  },
};
