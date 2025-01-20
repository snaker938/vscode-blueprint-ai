// webview-ui/src/components/UserComponents/Container/ContainerSettings.tsx

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { ChromePicker } from 'react-color';
import { Box, Slider } from '@mui/material';

import { Section, Dropdown, TextInput, Item } from '../../PropertiesSidebar/UI';
import type { ContainerProps } from './index';

export const ContainerSettings: React.FC = () => {
  const {
    width,
    height,
    background,
    color,
    margin,
    padding,
    shadow,
    radius,
    flexDirection,
    fillSpace,
    alignItems,
    justifyContent,
    actions: { setProp },
  } = useNode((node) => ({
    width: node.data.props.width,
    height: node.data.props.height,
    background: node.data.props.background,
    color: node.data.props.color,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    radius: node.data.props.radius,
    flexDirection: node.data.props.flexDirection,
    fillSpace: node.data.props.fillSpace,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
  })) as unknown as {
    width: string;
    height: string;
    background: { r: number; g: number; b: number; a: number };
    color: { r: number; g: number; b: number; a: number };
    margin: string[];
    padding: string[];
    shadow: number;
    radius: number;
    flexDirection: string;
    fillSpace: string;
    alignItems: string;
    justifyContent: string;
    actions: {
      setProp(
        cb: (props: Partial<ContainerProps>) => void,
        throttleRate?: number
      ): void;
    };
  };

  const [bgColor, setBgColor] = useState(background);
  const [txtColor, setTxtColor] = useState(color);

  const marginText = margin.join(', ');
  const paddingText = padding.join(', ');

  const updateBgColor = (newColor: any) => {
    setBgColor(newColor.rgb);
    setProp((props) => {
      props.background = newColor.rgb;
    }, 500);
  };

  const updateTxtColor = (newColor: any) => {
    setTxtColor(newColor.rgb);
    setProp((props) => {
      props.color = newColor.rgb;
    }, 500);
  };

  return (
    <Box sx={{ width: 300, fontSize: 14 }}>
      {/* DIMENSIONS */}
      <Section title="Dimensions" defaultExpanded>
        <Item>
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(val) =>
              setProp((props) => {
                props.width = val;
              }, 500)
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height || ''}
            onChangeValue={(val) =>
              setProp((props) => {
                props.height = val;
              }, 500)
            }
          />
        </Item>
      </Section>

      {/* COLORS */}
      <Section title="Colors">
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Background</p>
          <ChromePicker
            color={bgColor}
            onChange={updateBgColor}
            disableAlpha={false}
          />
        </Item>
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Text Color</p>
          <ChromePicker
            color={txtColor}
            onChange={updateTxtColor}
            disableAlpha={false}
          />
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

      {/* PADDING */}
      <Section title="Padding">
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>
            Padding (top, right, bottom, left)
          </p>
          <TextInput
            label="Padding"
            value={paddingText}
            onChangeValue={(val) => {
              const arr = val.split(',').map((s) => s.trim());
              setProp((props) => {
                props.padding = arr;
              }, 500);
            }}
          />
        </Item>
      </Section>

      {/* DECORATION */}
      <Section title="Decoration">
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Shadow</p>
          <Slider
            min={0}
            max={10}
            step={1}
            value={shadow}
            onChange={(_, sliderVal) => {
              const val = Array.isArray(sliderVal) ? sliderVal[0] : sliderVal;
              setProp((props) => {
                props.shadow = val;
              }, 300);
            }}
          />
        </Item>
        <Item>
          <p style={{ marginBottom: 4, fontWeight: 500 }}>Border Radius</p>
          <Slider
            min={0}
            max={100}
            step={1}
            value={radius}
            onChange={(_, sliderVal) => {
              const val = Array.isArray(sliderVal) ? sliderVal[0] : sliderVal;
              setProp((props) => {
                props.radius = val;
              }, 300);
            }}
          />
        </Item>
      </Section>

      {/* ALIGNMENT */}
      <Section title="Alignment">
        <Item>
          <Dropdown
            label="Flex Direction"
            value={flexDirection}
            onChangeValue={(newVal) =>
              setProp((props) => {
                props.flexDirection = newVal;
              }, 300)
            }
            options={[
              { value: 'row', label: 'Row' },
              { value: 'column', label: 'Column' },
              { value: 'row-reverse', label: 'Row Reverse' },
              { value: 'column-reverse', label: 'Column Reverse' },
            ]}
          />
        </Item>
        <Item>
          <Dropdown
            label="Fill Space?"
            value={fillSpace}
            onChangeValue={(newVal) =>
              setProp((props) => {
                props.fillSpace = newVal;
              }, 300)
            }
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />
        </Item>
        <Item>
          <Dropdown
            label="Align Items"
            value={alignItems}
            onChangeValue={(newVal) =>
              setProp((props) => {
                props.alignItems = newVal;
              }, 300)
            }
            options={[
              { value: 'flex-start', label: 'flex-start' },
              { value: 'center', label: 'center' },
              { value: 'flex-end', label: 'flex-end' },
              { value: 'stretch', label: 'stretch' },
            ]}
          />
        </Item>
        <Item>
          <Dropdown
            label="Justify Content"
            value={justifyContent}
            onChangeValue={(newVal) =>
              setProp((props) => {
                props.justifyContent = newVal;
              }, 300)
            }
            options={[
              { value: 'flex-start', label: 'flex-start' },
              { value: 'center', label: 'center' },
              { value: 'flex-end', label: 'flex-end' },
              { value: 'space-between', label: 'space-between' },
              { value: 'space-around', label: 'space-around' },
              { value: 'space-evenly', label: 'space-evenly' },
            ]}
          />
        </Item>
      </Section>
    </Box>
  );
};
