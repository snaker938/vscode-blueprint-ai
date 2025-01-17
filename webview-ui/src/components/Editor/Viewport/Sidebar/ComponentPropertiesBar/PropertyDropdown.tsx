import React from 'react';
import { useNode } from '@craftjs/core';
import { Dropdown, IDropdownOption } from '@fluentui/react';

interface PropertyDropdownProps {
  propKey: string;
  label?: string;
  options: { key: string; text: string }[];
  onChange?: (val: string) => any;
}

export const PropertyDropdown: React.FC<PropertyDropdownProps> = ({
  propKey,
  label,
  options,
  onChange,
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propKey],
  }));

  const handleChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (!option) return;
    setProp((props: any) => {
      props[propKey] = onChange ? onChange(option.key.toString()) : option.key;
    }, 500);
    console.log('Dropdown change event:', event);
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <Dropdown
        label={label}
        selectedKey={propValue}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
};
