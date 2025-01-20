// webview-ui/src/components/UserComponents/Container/ContainerSettings.tsx

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
  FormControl,
  FormLabel,
  TextField,
  Slider,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from '@mui/material';
import { ContainerProps } from './index';

/**
 * A minimal ContainerSettings that edits:
 *  - background (rgba)
 *  - color (rgba)
 *  - flexDirection
 *  - alignItems
 *  - justifyContent
 *  - fillSpace
 *  - padding
 *  - margin
 *  - shadow
 *  - radius
 */
export const ContainerSettings: React.FC = () => {
  const {
    background,
    color,
    flexDirection,
    alignItems,
    justifyContent,
    fillSpace,
    padding,
    margin,
    shadow,
    radius,
    actions: { setProp },
  } = useNode<ContainerProps>((node) => ({
    background: node.data.props.background,
    color: node.data.props.color,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    justifyContent: node.data.props.justifyContent,
    fillSpace: node.data.props.fillSpace,
    padding: node.data.props.padding,
    margin: node.data.props.margin,
    shadow: node.data.props.shadow,
    radius: node.data.props.radius,
    width: node.data.props.width,
    height: node.data.props.height,
    marginTop: node.data.props.marginTop,
    marginLeft: node.data.props.marginLeft,
    marginRight: node.data.props.marginRight,
    marginBottom: node.data.props.marginBottom,
    children: node.data.props.children,
  }));

  // Quick local RGBA => string for backgrounds
  // Or do more advanced color pickers, etc.
  const [bgValue, setBgValue] = useState(
    `rgba(${background.r},${background.g},${background.b},${background.a})`
  );
  const [fgValue, setFgValue] = useState(
    `rgba(${color.r},${color.g},${color.b},${color.a})`
  );

  const parseRgbaString = (rgbaStr: string) => {
    // Attempt basic parse: "rgba(r,g,b,a)"
    const match = rgbaStr
      .replace(/\s+/g, '')
      .match(/^rgba\((\d+),(\d+),(\d+),([\d.]+)\)$/i);
    if (!match) {
      // fallback
      return { r: 255, g: 255, b: 255, a: 1 };
    }
    return {
      r: parseInt(match[1]),
      g: parseInt(match[2]),
      b: parseInt(match[3]),
      a: parseFloat(match[4]),
    };
  };

  return (
    <div style={{ padding: '8px', maxWidth: 300 }}>
      <Typography variant="h6" gutterBottom>
        Container Settings
      </Typography>

      {/* BACKGROUND */}
      <FormControl fullWidth margin="normal">
        <FormLabel>Background (RGBA)</FormLabel>
        <TextField
          value={bgValue}
          onChange={(e) => {
            const val = e.target.value;
            setBgValue(val);
            const parsed = parseRgbaString(val);
            setProp((props: ContainerProps) => {
              props.background = parsed;
            });
          }}
        />
      </FormControl>

      {/* COLOR */}
      <FormControl fullWidth margin="normal">
        <FormLabel>Text Color (RGBA)</FormLabel>
        <TextField
          value={fgValue}
          onChange={(e) => {
            const val = e.target.value;
            setFgValue(val);
            const parsed = parseRgbaString(val);
            setProp((props: ContainerProps) => {
              props.color = parsed;
            });
          }}
        />
      </FormControl>

      {/* FLEX DIRECTION */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="direction-label">Flex Direction</InputLabel>
        <Select
          labelId="direction-label"
          value={flexDirection}
          label="Flex Direction"
          onChange={(e) => {
            const val = e.target.value as string;
            setProp((props: ContainerProps) => {
              props.flexDirection = val;
            });
          }}
        >
          <MenuItem value="row">row</MenuItem>
          <MenuItem value="column">column</MenuItem>
          <MenuItem value="row-reverse">row-reverse</MenuItem>
          <MenuItem value="column-reverse">column-reverse</MenuItem>
        </Select>
      </FormControl>

      {/* ALIGN ITEMS */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="align-label">Align Items</InputLabel>
        <Select
          labelId="align-label"
          value={alignItems}
          label="Align Items"
          onChange={(e) => {
            const val = e.target.value as string;
            setProp((props: ContainerProps) => {
              props.alignItems = val;
            });
          }}
        >
          <MenuItem value="flex-start">flex-start</MenuItem>
          <MenuItem value="center">center</MenuItem>
          <MenuItem value="flex-end">flex-end</MenuItem>
          <MenuItem value="stretch">stretch</MenuItem>
        </Select>
      </FormControl>

      {/* JUSTIFY CONTENT */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="justify-label">Justify Content</InputLabel>
        <Select
          labelId="justify-label"
          value={justifyContent}
          label="Justify Content"
          onChange={(e) => {
            const val = e.target.value as string;
            setProp((props: ContainerProps) => {
              props.justifyContent = val;
            });
          }}
        >
          <MenuItem value="flex-start">flex-start</MenuItem>
          <MenuItem value="center">center</MenuItem>
          <MenuItem value="flex-end">flex-end</MenuItem>
          <MenuItem value="space-between">space-between</MenuItem>
          <MenuItem value="space-around">space-around</MenuItem>
          <MenuItem value="space-evenly">space-evenly</MenuItem>
        </Select>
      </FormControl>

      {/* FILL SPACE */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="fill-label">Fill Space?</InputLabel>
        <Select
          labelId="fill-label"
          value={fillSpace}
          label="Fill Space?"
          onChange={(e) => {
            const val = e.target.value as string;
            setProp((props: ContainerProps) => {
              props.fillSpace = val;
            });
          }}
        >
          <MenuItem value="no">no</MenuItem>
          <MenuItem value="yes">yes</MenuItem>
        </Select>
      </FormControl>

      {/* PADDING */}
      <FormControl fullWidth margin="normal">
        <FormLabel>
          Padding (array of 4 strings, e.g. top/right/bottom/left)
        </FormLabel>
        <TextField
          value={padding.join(',')}
          onChange={(e) => {
            const arr = e.target.value.split(',').map((v) => v.trim());
            setProp((props: ContainerProps) => {
              props.padding = arr as [string, string, string, string];
            });
          }}
          helperText="Comma-separated (top,right,bottom,left)"
        />
      </FormControl>

      {/* MARGIN */}
      <FormControl fullWidth margin="normal">
        <FormLabel>Margin (array of 4 strings)</FormLabel>
        <TextField
          value={margin.join(',')}
          onChange={(e) => {
            const arr = e.target.value.split(',').map((v) => v.trim());
            setProp((props: ContainerProps) => {
              props.margin = arr as [string, string, string, string];
            });
          }}
          helperText="Comma-separated (top,right,bottom,left)"
        />
      </FormControl>

      {/* SHADOW */}
      <FormControl fullWidth margin="normal">
        <FormLabel>Shadow</FormLabel>
        <Slider
          value={shadow}
          min={0}
          max={10}
          onChange={(_, value) => {
            const newVal = Array.isArray(value) ? value[0] : value;
            setProp((props: ContainerProps) => {
              props.shadow = newVal;
            });
          }}
        />
      </FormControl>

      {/* RADIUS */}
      <FormControl fullWidth margin="normal">
        <FormLabel>Border Radius</FormLabel>
        <Slider
          value={radius}
          min={0}
          max={100}
          onChange={(_, value) => {
            const newVal = Array.isArray(value) ? value[0] : value;
            setProp((props: ContainerProps) => {
              props.radius = newVal;
            });
          }}
        />
      </FormControl>
    </div>
  );
};
