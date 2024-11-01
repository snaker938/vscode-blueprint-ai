import React from 'react';
import { useNode } from '@craftjs/core';

interface RadioButtonsProps {
  options?: string[];
  name?: string;
}

export const RadioButtons: React.FC<RadioButtonsProps> & { craft?: any } = ({
  options,
  name,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div ref={(ref) => connect(drag(ref))}>
      {options?.map((option, index) => (
        <label key={index} style={{ display: 'block' }}>
          <input type="radio" name={name} value={option} />
          {option}
        </label>
      ))}
    </div>
  );
};

RadioButtons.craft = {
  displayName: 'Radio Buttons',
  props: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    name: 'radioGroup',
  },
};
