import React from 'react';
import { useNode } from '@craftjs/core';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react';

interface RadioOption {
  value: string;
  label: string;
}

interface PropertyRadioProps {
  propKey: string;
  label?: string;
  options: RadioOption[];
  onChange?: (val: string) => any;
}

export const PropertyRadio: React.FC<PropertyRadioProps> = ({
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

  const choiceOptions: IChoiceGroupOption[] = options.map((opt) => ({
    key: opt.value,
    text: opt.label,
  }));

  const handleChange = (
    ev?: React.FormEvent<HTMLElement>,
    option?: IChoiceGroupOption
  ) => {
    if (!option) return;
    setProp((props: any) => {
      props[propKey] = onChange ? onChange(option.key) : option.key;
    });
    if (ev) {
      ev.preventDefault();
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <div style={{ marginBottom: '5px' }}>{label}</div>}
      <ChoiceGroup
        selectedKey={propValue || ''}
        options={choiceOptions}
        onChange={handleChange}
      />
    </div>
  );
};
