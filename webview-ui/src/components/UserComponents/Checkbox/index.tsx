import React, { FC, useCallback, useMemo } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { CheckboxProperties } from './CheckboxProperties';

export interface ICheckboxProps {
  /**
   * The label text displayed next to the checkbox
   */
  label?: string;

  /**
   * Determines whether the checkbox is currently checked
   */
  checked?: boolean;

  /**
   * If true, the checkbox is disabled and cannot be changed
   */
  disabled?: boolean;

  /**
   * Width of the checkbox container (e.g., '100px' or 'auto')
   */
  width?: string;

  /**
   * Height of the checkbox container (e.g., '50px' or 'auto')
   */
  height?: string;

  /**
   * Margin around the checkbox container in the form of [top, right, bottom, left]
   */
  margin?: [number, number, number, number];

  /**
   * Padding inside the checkbox container in the form of [top, right, bottom, left]
   */
  padding?: [number, number, number, number];

  /**
   * Box shadow strength
   */
  shadow?: number;

  /**
   * Corner border radius in px
   */
  radius?: number;

  /**
   * (Optional) Handler to get notified when the checkbox is toggled
   */
  onChange?: (checked: boolean) => void;
}

/**
 * Default values for the Checkbox component's props
 */
const defaultProps: Partial<ICheckboxProps> = {
  label: 'Checkbox Label',
  checked: false,
  disabled: false,
  width: '150px',
  height: '40px',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  shadow: 0,
  radius: 0,
};

/**
 * We extend FC with a "craft" property signature
 * so we can define Checkbox.craft without TS errors.
 */
interface ICheckboxCraft {
  displayName: string;
  props: Partial<ICheckboxProps>;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof CheckboxProperties;
  };
}

/** Checkbox component type with a "craft" static field */
interface ICheckbox extends FC<ICheckboxProps> {
  craft: ICheckboxCraft;
}

/**
 * The Checkbox component
 */
export const Checkbox: ICheckbox = (incomingProps) => {
  // Combine default props with incoming props
  const props = { ...defaultProps, ...incomingProps };
  const {
    label,
    checked,
    disabled,
    width,
    height,
    margin,
    padding,
    shadow,
    radius,
    onChange,
  } = props;

  const {
    connectors: { connect, drag },
    actions: { setProp },
  } = useNode();

  /**
   * Memoize wrapper style based on current props
   */
  const wrapperStyle = useMemo<React.CSSProperties>(() => {
    // Safely access margin/padding arrays
    const safeMargin = margin || [0, 0, 0, 0];
    const safePadding = padding || [0, 0, 0, 0];

    const boxShadow =
      shadow && shadow > 0
        ? `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`
        : 'none';

    return {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
      width: width || 'auto',
      height: height || 'auto',
      margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
      padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
      boxShadow,
      borderRadius: radius || 0,
    };
  }, [width, height, margin, padding, shadow, radius]);

  // When the native checkbox changes, update our internal 'checked' state
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      setProp((draft: ICheckboxProps) => {
        draft.checked = newChecked;
      });
      onChange?.(newChecked);
    },
    [onChange, setProp]
  );

  return (
    <Resizer
      // Pass the ref to connect + drag so we can move/resize this component
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      propKey={{ width: 'width', height: 'height' }}
      style={wrapperStyle}
    >
      <input
        type="checkbox"
        disabled={disabled}
        checked={!!checked}
        onChange={handleChange}
        style={{ marginRight: '8px' }}
      />
      <span>{label}</span>
    </Resizer>
  );
};

Checkbox.craft = {
  displayName: 'Checkbox',
  props: defaultProps,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: CheckboxProperties,
  },
};
