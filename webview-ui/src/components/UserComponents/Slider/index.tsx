import React, { FC, CSSProperties, useState, MouseEvent } from 'react';
import { useNode, Node } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { SliderProperties } from './SliderProperties';

/**
 * Relevant slider props exposed in the editor.
 */
export interface ISliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  orientation: 'horizontal' | 'vertical';
  width: string;
  height: string;
  backgroundColor: string;
  trackColor: string;
  thumbColor: string;
}

/**
 * Define the structure of craft-related configuration.
 */
interface ISliderCraft {
  displayName: string;
  props: ISliderProps;
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

/**
 * Extend FC with a `craft` property.
 */
interface ISliderComponent extends FC {
  craft: ISliderCraft;
}

/**
 * The actual Slider component definition.
 */
export const Slider: ISliderComponent = () => {
  const {
    connectors: { connect },
    props,
  } = useNode(({ data }) => ({
    props: data.props as ISliderProps,
  }));

  // Keep an internal state for the slider's current value
  const [internalValue, setInternalValue] = useState<number>(props.value);

  // Handler for value changes
  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseFloat(evt.target.value);
    setInternalValue(newVal);
  };

  // Inline styles for the slider container
  const containerStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: props.backgroundColor,
    width: props.width,
    height: props.height,
  };

  // Inline styles for the input (range)
  const inputStyle: CSSProperties = {
    appearance: 'none',
    width: props.orientation === 'horizontal' ? '100%' : '5px',
    height: props.orientation === 'horizontal' ? '5px' : '100%',
    background: props.trackColor,
    outline: 'none',
  };

  // Thumb style (inline). In production, you might keep this in a separate CSS file.
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

  // Prevent clicks from bubbling up to parent
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <Resizer
      // Connect the ref so the slider can be selected/resized in Craft
      ref={(ref) => ref && connect(ref)}
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
      />
    </Resizer>
  );
};

/**
 * Craft configuration for the Slider component.
 */
Slider.craft = {
  displayName: 'Slider',
  // Default props for newly created sliders
  props: {
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
  },
  isCanvas: false,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: SliderProperties,
  },
};
