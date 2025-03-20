import React, { FC, CSSProperties, MouseEvent, useState } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { SliderProperties } from './SliderProperties';

/**
 * Define the Slider component's public props.
 * (These will also appear in SliderProperties.ts, which is not shown here.)
 */
export interface ISliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  orientation: 'horizontal' | 'vertical';
  width?: string;
  height?: string;
  backgroundColor?: string;
  trackColor?: string;
  thumbColor?: string;
  /**
   * Optional: If you'd like to handle the slider changes outside,
   * you could add an `onValueChange` callback, for example:
   * onValueChange?: (newValue: number) => void;
   */
}

/** Defaults for the Slider component */
const defaultProps: Partial<ISliderProps> = {
  min: 0,
  max: 100,
  step: 1,
  value: 50,
  orientation: 'horizontal',
  width: '200px',
  height: 'auto',
  backgroundColor: '#f0f0f0',
  trackColor: '#2196F3',
  thumbColor: '#ffffff',
};

/**
 * We extend FC with craft so we can define `Slider.craft` for Craft.js
 */
interface ISliderCraft {
  displayName: string;
  props: Partial<ISliderProps>;
  isCanvas: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related: {
    settings: typeof SliderProperties;
  };
}

/** Slider component type with a static craft property */
interface ISlider extends FC<ISliderProps> {
  craft: ISliderCraft;
}

/**
 * The actual Slider component definition.
 * It leverages the Resizer, so the user can drag to resize it in the editor.
 */
export const Slider: ISlider = (incomingProps) => {
  const { connectors } = useNode(() => ({
    // You could collect additional node data if needed
  }));

  // Merge default and incoming props
  const props: ISliderProps = { ...defaultProps, ...incomingProps };
  const [internalValue, setInternalValue] = useState<number>(props.value);

  // Handler for value changes
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(evt.target.value);
    setInternalValue(newVal);
    // If you had an external callback, you might call props.onValueChange?.(newVal);
  };

  // Inline styles
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.backgroundColor,
    width: props.width,
    height: props.height,
    // We could add some padding or margin as well if you like
  };

  const inputStyle: CSSProperties = {
    appearance: 'none',
    width: props.orientation === 'horizontal' ? '100%' : '5px',
    height: props.orientation === 'horizontal' ? '5px' : '100%',
    background: props.trackColor,
    outline: 'none',
    // For a vertical slider, you typically rotate or use writing mode, but
    // that might require more advanced styling. We'll keep it simple.
  };

  // For the slider's "thumb" style (some browsers require vendor prefixes)
  // In a real scenario, you may need to do this via CSS classes.
  const thumbStyle = `
    input[type=range]::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: ${props.thumbColor};
      cursor: pointer;
      border-radius: 50%;
      box-shadow: 0 0 2px rgba(0,0,0,0.3);
    }
  `;

  // Click handler (so it doesn't bubble to parent in the editor)
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Resizer
      // Connect the ref so the slider can be selected/resized in Craft
      ref={(ref) => ref && connectors.connect(ref)}
      // These keys link Craft's resizing to our width/height props
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
      onClick={handleClick}
    >
      <style>{thumbStyle}</style>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={internalValue}
        onChange={handleChange}
        style={inputStyle}
        // For real vertical slider usage, you often rotate the input
        // e.g., style={{ transform: 'rotate(270deg)' }} plus some layout tweaks
      />
    </Resizer>
  );
};

Slider.craft = {
  displayName: 'Slider',
  props: defaultProps,
  isCanvas: false, // Typically not a Canvas node
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    // This references the (to-be-created) SliderProperties component
    settings: SliderProperties,
  },
};
