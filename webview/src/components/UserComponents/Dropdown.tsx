import React from 'react';
import { useNode } from '@craftjs/core';

interface DropdownProps {
  options?: string[];
}

export const Dropdown: React.FC<DropdownProps> & { craft?: any } = ({
  options,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <select ref={(ref) => connect(drag(ref))}>
      {options?.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

Dropdown.craft = {
  displayName: 'Dropdown',
  props: {
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
};
