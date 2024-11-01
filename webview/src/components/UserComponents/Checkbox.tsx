import React from 'react';
import { useNode } from '@craftjs/core';

interface CheckboxProps {
  label?: string;
}

export const Checkbox: React.FC<CheckboxProps> & { craft?: any } = ({
  label,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <label
      ref={(ref) => connect(drag(ref))}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <input type="checkbox" />
      <span style={{ marginLeft: '4px' }}>{label}</span>
    </label>
  );
};

Checkbox.craft = {
  displayName: 'Checkbox',
  props: {
    label: 'Check me',
  },
};
