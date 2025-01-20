import React, { useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import ContentEditable from 'react-contenteditable';
import { FormControl, FormLabel, Slider } from '@mui/material';

interface TextProps {
  text?: string;
  fontSize?: number;
}

interface CustomTextProps extends TextProps {
  craft?: any;
}

export const Text: React.FC<CustomTextProps> & { craft?: any } = ({
  text,
  fontSize,
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!selected) setEditable(false);
  }, [selected]);

  return (
    <div
      ref={(ref) => ref && connect(drag(ref))}
      onClick={() => setEditable(true)}
      style={{ cursor: 'pointer' }}
    >
      <ContentEditable
        disabled={!editable}
        html={text || ''}
        onChange={(e) => {
          setProp((props: any) => {
            props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, '');
          });
        }}
        tagName="p"
        style={{ fontSize: `${fontSize}px` }}
      />
    </div>
  );
};

const TextSettings: React.FC = () => {
  const {
    actions: { setProp },
    fontSize,
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
  }));

  return (
    <div style={{ padding: '8px' }}>
      <FormControl fullWidth>
        <FormLabel>Font size</FormLabel>
        <Slider
          defaultValue={fontSize || 16}
          step={1}
          min={7}
          max={50}
          valueLabelDisplay="auto"
          onChange={(_e: Event, value: number | number[]) =>
            setProp((props: any) => (props.fontSize = value as number))
          }
        />
      </FormControl>
    </div>
  );
};

Text.craft = {
  props: {
    text: 'Edit me',
    fontSize: 16,
  },
  rules: {
    canDrag: (node: any) => node.data.props.text !== 'Drag',
  },
  related: {
    settings: TextSettings,
  },
};
