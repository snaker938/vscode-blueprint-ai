import { FC, useState, useEffect, ChangeEvent, CSSProperties } from 'react';
import { useNode, Node } from '@craftjs/core';
import { DropdownProperties } from './DropdownProperties';

export interface IDropdownProps {
  label?: string;
  options?: Array<{ value: string; label: string }>;
  selected?: string;
  disabled?: boolean;
  placeholder?: string;
  width?: string;
  height?: string;
  background?: string;
  color?: string;
  borderRadius?: number;
  margin?: [number, number, number, number];
  padding?: [number, number, number, number];
  onChange?: (newValue: string) => void;
}

const defaultProps: Partial<IDropdownProps> = {
  label: 'Select an option',
  options: [],
  selected: '',
  disabled: false,
  placeholder: 'Please choose...',
  width: '200px',
  height: '40px',
  background: '#ffffff',
  color: '#000000',
  borderRadius: 0,
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

interface IDropdownCraft {
  displayName: string;
  props: Partial<IDropdownProps>;
  isCanvas: boolean;
  related: {
    settings: typeof DropdownProperties;
  };
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
}

interface IDropdown extends FC<IDropdownProps> {
  craft: IDropdownCraft;
}

export const Dropdown: IDropdown = (incomingProps) => {
  const { connectors } = useNode();

  const props = { ...defaultProps, ...incomingProps };
  const {
    label,
    options,
    selected,
    disabled,
    placeholder,
    width,
    height,
    background,
    color,
    borderRadius,
    margin,
    padding,
    onChange,
  } = props;

  const [currentValue, setCurrentValue] = useState<string>(selected || '');

  useEffect(() => {
    setCurrentValue(selected || '');
  }, [selected]);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    setCurrentValue(newValue);
    onChange?.(newValue);
  };

  const style: CSSProperties = {
    display: 'inline-block',
    width,
    height,
    background,
    color,
    borderRadius,
    margin: margin
      ? `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`
      : undefined,
    padding: padding
      ? `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`
      : undefined,
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          connectors.connect(ref);
        }
      }}
      style={style}
    >
      {label && (
        <label style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
      )}
      <select
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        style={{ width: '100%', height: '100%' }}
      >
        {placeholder && !currentValue && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

Dropdown.craft = {
  displayName: 'Dropdown',
  props: defaultProps,
  isCanvas: false,
  related: {
    settings: DropdownProperties,
  },
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
};
