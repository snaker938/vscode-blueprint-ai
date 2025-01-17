import React from 'react';
import { useNode } from '@craftjs/core';
import { Slider, TextField } from '@fluentui/react';

interface PropertyItemProps {
  propKey: string;
  type: 'text' | 'number' | 'slider';
  label?: string;
  index?: number;
  onChange?: (val: any) => any;
}

export const PropertyItem: React.FC<PropertyItemProps> = ({
  propKey,
  type,
  label,
  index,
  onChange,
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propKey],
  }));

  const value = Array.isArray(propValue) ? propValue[index || 0] : propValue;

  const handleValueChange = (val: any) => {
    setProp((props: any) => {
      if (Array.isArray(propValue)) {
        props[propKey][index || 0] = onChange ? onChange(val) : val;
      } else {
        props[propKey] = onChange ? onChange(val) : val;
      }
    }, 500);
  };

  if (type === 'slider') {
    return (
      <div style={{ marginBottom: '10px' }}>
        {label && <div style={{ marginBottom: '5px' }}>{label}</div>}
        <Slider
          value={Number(value) || 0}
          onChange={(val) => handleValueChange(val)}
          min={0}
          max={100}
        />
      </div>
    );
  } else if (type === 'text' || type === 'number') {
    return (
      <div style={{ marginBottom: '10px' }}>
        {label && <div style={{ marginBottom: '5px' }}>{label}</div>}
        <TextField
          type={type}
          value={value || ''}
          onChange={(_, newVal) => handleValueChange(newVal)}
        />
      </div>
    );
  }

  return null;
};
