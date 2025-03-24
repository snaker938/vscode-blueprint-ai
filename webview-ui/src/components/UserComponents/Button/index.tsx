import React, { CSSProperties, FC, MouseEvent } from 'react';
import { useNode } from '@craftjs/core'; // Removed { Node } since we're not using it
import { Resizer } from '../Utils/Resizer';
import { ButtonProperties } from './ButtonProperties';

/** A 4-number tuple for top, right, bottom, left in px */
type FourNumberArray = [number, number, number, number];

/** Border styling props */
interface IBorderProps {
  borderStyle?: 'none' | 'solid' | 'dashed' | 'dotted';
  borderColor?: string;
  borderWidth?: number;
}

/** Button component props */
export interface ButtonProps {
  /** Button label text */
  label?: string;

  /**
   * Whether this should render as a normal button or as a radio button.
   * If 'radio', we'll render <input type="radio" ... />
   */
  variant?: 'button' | 'radio';

  /** Text color */
  color?: string;

  /** Background color */
  background?: string;

  /** Explicit width (e.g. 'auto', '100px', etc.) */
  width?: string;

  /** Explicit height (e.g. 'auto', '40px', etc.) */
  height?: string;

  /** Margin around the button: [top, right, bottom, left] in px */
  margin?: FourNumberArray;

  /** Padding inside the button: [top, right, bottom, left] in px */
  padding?: FourNumberArray;

  /** Border radius (px) */
  radius?: number;

  /** Shadow intensity (0 = no shadow) */
  shadow?: number;

  /** Border configuration */
  border?: IBorderProps;

  /** Whether the radio is checked (only matters if variant='radio') */
  checked?: boolean;

  /** An onClick handler */
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLInputElement>) => void;
}

const defaultProps: Partial<ButtonProps> = {
  label: 'Click Me',
  variant: 'button',
  color: '#ffffff',
  background: '#007bff',
  width: 'auto',
  height: 'auto',
  margin: [5, 5, 5, 5],
  padding: [10, 20, 10, 20],
  radius: 4,
  shadow: 5,
  border: {
    borderStyle: 'solid',
    borderColor: '#cccccc',
    borderWidth: 1,
  },
  checked: false,
};

export const Button: FC<ButtonProps> & { craft?: any } = (incomingProps) => {
  // We no longer need the node param since it's not used
  const { connectors } = useNode(() => ({}));

  // Merge the incoming props with our default props
  const props = { ...defaultProps, ...incomingProps };

  const {
    label,
    variant,
    color,
    background,
    width,
    height,
    margin,
    padding,
    radius,
    shadow,
    border,
    onClick,
    checked,
  } = props;

  // Safely handle margin & padding arrays
  const safeMargin: FourNumberArray = Array.isArray(margin)
    ? margin
    : [0, 0, 0, 0];
  const safePadding: FourNumberArray = Array.isArray(padding)
    ? padding
    : [0, 0, 0, 0];

  // Box shadow logic
  const boxShadow =
    !shadow || shadow <= 0
      ? 'none'
      : `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`;

  const baseStyle: CSSProperties = {
    display: 'inline-block',
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    width: width || 'auto',
    height: height || 'auto',
    boxSizing: 'border-box',
    boxShadow,
    borderStyle: border?.borderStyle || 'none',
    borderColor: border?.borderColor || 'transparent',
    borderWidth: border?.borderWidth ? `${border.borderWidth}px` : '0px',
    borderRadius: `${radius || 0}px`,
  };

  const buttonStyle: CSSProperties = {
    display: 'inline-block',
    background: background || '#007bff',
    color: color || '#ffffff',
    cursor: 'pointer',
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    border: 'none',
    borderRadius: `${radius || 0}px`,
  };

  // Add an explicit type to the event parameter
  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLInputElement>
  ) => {
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Resizer
      // Connect the Resizer so it can be dragged/resized within the editor
      ref={(ref) => ref && connectors.connect(ref)}
      propKey={{ width: 'width', height: 'height' }}
      style={baseStyle}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
    >
      {variant === 'radio' ? (
        <label style={{ cursor: 'pointer' }}>
          <input
            type="radio"
            checked={checked}
            onClick={handleClick}
            style={{ marginRight: '6px' }}
          />
          {label}
        </label>
      ) : (
        <button style={buttonStyle} onClick={handleClick}>
          {label}
        </button>
      )}
    </Resizer>
  );
};

Button.craft = {
  displayName: 'Button',
  props: defaultProps,
  related: {
    // This references the separate properties panel for the Button
    settings: ButtonProperties,
  },
};
