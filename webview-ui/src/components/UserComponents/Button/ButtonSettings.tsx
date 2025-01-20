// webview-ui/src/components/UserComponents/Button/ButtonSettings.tsx

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { Box } from '@mui/material';
import { ChromePicker } from 'react-color';

import { Section, Radio, TextInput, Item } from '../../PropertiesSidebar/UI';

interface ButtonProps {
  background: { r: number; g: number; b: number; a: number };
  color: { r: number; g: number; b: number; a: number };
  margin: string[];
  buttonStyle: string; // e.g. "full" or "outline"
}

/**
 * "ButtonSettings" re-implemented with your new UI library.
 * Sections for Colors, Margin, Decoration (buttonStyle).
 */
export const ButtonSettings: React.FC = () => {
  const {
    background,
    color,
    margin,
    buttonStyle,
    actions: { setProp },
  } = useNode((node) => ({
    background: node.data.props.background,
    color: node.data.props.color,
    margin: node.data.props.margin,
    buttonStyle: node.data.props.buttonStyle,
  })) as unknown as {
    background: { r: number; g: number; b: number; a: number };
    color: { r: number; g: number; b: number; a: number };
    margin: string[];
    buttonStyle: string;
    actions: {
      setProp(
        callback: (props: Partial<ButtonProps>) => void,
        throttle?: number
      ): void;
    };
  };

  // local states for color pickers
  const [bgColor, setBgColor] = useState(background);
  const [txtColor, setTxtColor] = useState(color);

  const updateBgColor = (newColor: any) => {
    setBgColor(newColor.rgb);
    setProp((props) => {
      props.background = newColor.rgb;
    }, 300);
  };

  const updateTxtColor = (newColor: any) => {
    setTxtColor(newColor.rgb);
    setProp((props) => {
      props.color = newColor.rgb;
    }, 300);
  };

  const marginText = margin.join(', ');

  return (
    <Box sx={{ width: 300, fontSize: 14 }}>
      {/* COLORS */}
      <Section title="Colors" defaultExpanded>
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Background</p>
          <ChromePicker color={bgColor} onChange={updateBgColor} />
        </Item>
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Text Color</p>
          <ChromePicker color={txtColor} onChange={updateTxtColor} />
        </Item>
      </Section>

      {/* MARGIN */}
      <Section title="Margin">
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>
            Margin (top, right, bottom, left)
          </p>
          <TextInput
            label="Margin"
            value={marginText}
            onChangeValue={(val) => {
              const arr = val.split(',').map((s) => s.trim());
              setProp((props) => {
                props.margin = arr;
              }, 500);
            }}
          />
        </Item>
      </Section>

      {/* DECORATION => button style */}
      <Section title="Decoration">
        <Item>
          <Radio
            label="Button Style"
            value={buttonStyle}
            onChangeValue={(val) =>
              setProp((props) => {
                props.buttonStyle = val;
              }, 300)
            }
            options={[
              { value: 'full', label: 'Full' },
              { value: 'outline', label: 'Outline' },
            ]}
          />
        </Item>
      </Section>
    </Box>
  );
};
