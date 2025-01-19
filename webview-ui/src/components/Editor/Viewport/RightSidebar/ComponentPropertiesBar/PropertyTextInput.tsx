import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { TextField } from '@fluentui/react';

interface PropertyTextInputProps {
  propKey: string;
  label?: string;
  type?: 'text' | 'color' | 'bg';
  onChange?: (val: any) => void;
}

export const PropertyTextInput: React.FC<PropertyTextInputProps> = ({
  propKey,
  label,
  // type = 'text',
  onChange,
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propKey],
  }));

  const [internalValue, setInternalValue] = useState(propValue || '');

  const handleChange = (val: string) => {
    setInternalValue(val);
    setProp((props: any) => {
      props[propKey] = onChange ? onChange(val) : val;
    }, 500);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <div style={{ marginBottom: '5px' }}>{label}</div>}
      <TextField
        type="text"
        value={internalValue}
        onChange={(_, newVal) => handleChange(newVal || '')}
      />
    </div>
  );
};
