import React from 'react';
import { useNode } from '@craftjs/core';

interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
}

export const Slider: React.FC<SliderProps> & { craft?: any } = ({
  min,
  max,
  defaultValue,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <input
      type="range"
      ref={(ref) => connect(drag(ref))}
      min={min}
      max={max}
      defaultValue={defaultValue}
      style={{ width: '100%' }}
    />
  );
};

Slider.craft = {
  displayName: 'Slider',
  props: {
    min: 0,
    max: 100,
    defaultValue: 50,
  },
};
