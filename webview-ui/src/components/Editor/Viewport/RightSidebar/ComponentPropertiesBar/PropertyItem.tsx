import React from 'react';
import { useNode } from '@craftjs/core';
import { Slider, TextField } from '@fluentui/react';

type PropertyItemType = 'text' | 'number' | 'slider' | 'bg' | 'color';

interface PropertyItemProps {
  propKey: string;
  type: PropertyItemType;
  label?: string;
  index?: number;
  onChange?: (val: any) => any;
  full?: boolean; // Make sure we actually use this
}

export const PropertyItem: React.FC<PropertyItemProps> = ({
  propKey,
  type,
  label,
  index,
  onChange,
  full,
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
    const containerStyle: React.CSSProperties = {
      marginBottom: '10px',
      width: full ? '100%' : 'auto',
    };
    return (
      <div style={containerStyle}>
        {label && <div style={{ marginBottom: '5px' }}>{label}</div>}
        <Slider
          value={Number(value) || 0}
          onChange={(val) => handleValueChange(val)}
          min={0}
          max={100}
        />
      </div>
    );
  }

  if (
    type === 'text' ||
    type === 'number' ||
    type === 'bg' ||
    type === 'color'
  ) {
    const containerStyle: React.CSSProperties = {
      marginBottom: '10px',
      width: full ? '100%' : 'auto',
    };
    return (
      <div style={containerStyle}>
        {label && <div style={{ marginBottom: '5px' }}>{label}</div>}
        <TextField
          type={type === 'number' ? 'number' : 'text'}
          value={value || ''}
          onChange={(_, newVal) => handleValueChange(newVal)}
        />
      </div>
    );
  }

  return null;
};
