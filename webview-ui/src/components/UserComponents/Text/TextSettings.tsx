// webview-ui/src/components/UserComponents/Text/TextSettings.tsx

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { Box, Slider } from '@mui/material';
import { ChromePicker } from 'react-color';

/** Import your new custom components here */
import { Section, Radio, TextInput, Item } from '../../PropertiesSidebar/UI';

/**
 * Suppose your Text component has these props:
 *   fontSize (number),
 *   fontWeight (string),
 *   textAlign (string),
 *   margin (string[]),
 *   color: { r,g,b,a },
 *   shadow (number)
 */
interface TextProps {
  fontSize: number;
  fontWeight: string;
  textAlign: string;
  margin: string[];
  color: { r: number; g: number; b: number; a: number };
  shadow: number;
}

/**
 * A brand new "TextSettings" that references new UI components:
 *  - <Section> for grouping
 *  - <Item> for spacing
 *  - <Radio> for radio sets
 *  - <TextInput> for strings
 *  - use MUI <Slider> + <ChromePicker> for shadow/color
 */
export const TextSettings: React.FC = () => {
  const {
    fontSize,
    fontWeight,
    textAlign,
    margin,
    color,
    shadow,
    actions: { setProp },
  } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    fontWeight: node.data.props.fontWeight,
    textAlign: node.data.props.textAlign,
    margin: node.data.props.margin,
    color: node.data.props.color,
    shadow: node.data.props.shadow,
  })) as unknown as {
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    margin: string[];
    color: { r: number; g: number; b: number; a: number };
    shadow: number;
    actions: {
      setProp(
        cb: (props: Partial<TextProps>) => void,
        throttleRate?: number
      ): void;
    };
  };

  // We'll store local state for color picking
  const [txtColor, setTxtColor] = useState(color);

  const handleChangeColor = (newColor: any) => {
    setTxtColor(newColor.rgb);
    setProp((props) => {
      props.color = newColor.rgb;
    }, 300);
  };

  // margin is a string[], e.g. ["0","0","0","0"]
  const marginText = margin.join(', ');

  return (
    <Box sx={{ width: 300, fontSize: 14 }}>
      {/* Typography settings */}
      <Section title="Typography" defaultExpanded>
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Font Size</p>
          <Slider
            min={8}
            max={72}
            step={1}
            value={fontSize}
            onChange={(_, val) => {
              const newVal = Array.isArray(val) ? val[0] : val;
              setProp((props) => {
                props.fontSize = newVal;
              }, 300);
            }}
          />
        </Item>

        <Item>
          <Radio
            label="Align"
            value={textAlign}
            onChangeValue={(val) =>
              setProp((props) => {
                props.textAlign = val;
              }, 300)
            }
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
          />
        </Item>

        <Item>
          <Radio
            label="Font Weight"
            value={fontWeight}
            onChangeValue={(val) =>
              setProp((props) => {
                props.fontWeight = val;
              }, 300)
            }
            options={[
              { label: 'Regular (400)', value: '400' },
              { label: 'Medium (500)', value: '500' },
              { label: 'Bold (700)', value: '700' },
            ]}
          />
        </Item>
      </Section>

      {/* Margin */}
      <Section title="Margin">
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>
            Margin (top,right,bottom,left)
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

      {/* Appearance: color + shadow */}
      <Section title="Appearance">
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Text Color</p>
          <ChromePicker color={txtColor} onChange={handleChangeColor} />
        </Item>

        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Shadow</p>
          <Slider
            min={0}
            max={100}
            step={1}
            value={shadow}
            onChange={(_, val) => {
              const newVal = Array.isArray(val) ? val[0] : val;
              setProp((props) => {
                props.shadow = newVal;
              }, 300);
            }}
          />
        </Item>
      </Section>
    </Box>
  );
};
