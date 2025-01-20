// webview-ui/src/components/UserComponents/Container/ContainerSettings.tsx

import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  TextField,
  Slider,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  InputLabel,
  Box,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ChromePicker } from 'react-color';

import type { ContainerProps } from './index';

/**
 * A modern, user-friendly settings panel for the Container.
 * Sections for:
 *  - Dimensions (width, height)
 *  - Colors (background, color)
 *  - Margin
 *  - Padding
 *  - Decoration (shadow, radius)
 *  - Alignment (flexDirection, fillSpace, alignItems, justifyContent)
 */
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

  // Local states for background + color pickers
  const [bgColor, setBgColor] = useState(background);
  const [txtColor, setTxtColor] = useState(color);

  // Convert color object => "rgba()"
  // const rgbaString = (c: typeof background) =>
  // `rgba(${c.r},${c.g},${c.b},${c.a})`;

  const updateBgColor = (newColor: any) => {
    setBgColor(newColor.rgb);
    setProp((props: Partial<ContainerProps>) => {
      props.background = newColor.rgb;
    }, 500);
  };

  const updateTxtColor = (newColor: any) => {
    setTxtColor(newColor.rgb);
    setProp((props: Partial<ContainerProps>) => {
      props.color = newColor.rgb;
    }, 500);
  };

  // Helpers for margin/padding text
  const marginText = margin.join(', ');
  const paddingText = padding.join(', ');

  return (
    <Box sx={{ width: '100%', maxWidth: 360, fontSize: 14 }}>
      {/* DIMENSIONS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Dimensions</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormLabel>Width</FormLabel>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            value={width || ''}
            onChange={(e) => {
              const val = e.target.value;
              setProp((props) => {
                props.width = val;
              }, 500);
            }}
            sx={{ mb: 1 }}
          />
          <FormLabel>Height</FormLabel>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            value={height || ''}
            onChange={(e) => {
              const val = e.target.value;
              setProp((props) => {
                props.height = val;
              }, 500);
            }}
          />
        </AccordionDetails>
      </Accordion>

      {/* COLORS */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Colors</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormLabel sx={{ mb: 1 }}>Background</FormLabel>
          <ChromePicker
            color={bgColor}
            onChange={updateBgColor}
            disableAlpha={false}
          />

          <FormLabel sx={{ mt: 2 }}>Text Color</FormLabel>
          <ChromePicker
            color={txtColor}
            onChange={updateTxtColor}
            disableAlpha={false}
          />
        </AccordionDetails>
      </Accordion>

      {/* MARGIN */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Margin</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormLabel>Margin (top,right,bottom,left)</FormLabel>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            value={marginText}
            onChange={(e) => {
              const arr = e.target.value.split(',').map((s) => s.trim());
              setProp((props) => {
                props.margin = arr;
              }, 500);
            }}
            helperText="Comma-separated. E.g. 10,0,10,0"
          />
        </AccordionDetails>
      </Accordion>

      {/* PADDING */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Padding</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormLabel>Padding (top,right,bottom,left)</FormLabel>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            sx={{ mt: 1 }}
            value={paddingText}
            onChange={(e) => {
              const arr = e.target.value.split(',').map((s) => s.trim());
              setProp((props) => {
                props.padding = arr;
              }, 500);
            }}
            helperText="Comma-separated. E.g. 10,10,10,10"
          />
        </AccordionDetails>
      </Accordion>

      {/* DECORATION */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Decoration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <FormLabel>Shadow</FormLabel>
            <Slider
              min={0}
              max={10}
              step={1}
              value={shadow}
              onChange={(_, value) => {
                const val = Array.isArray(value) ? value[0] : value;
                setProp((props) => {
                  props.shadow = val;
                }, 300);
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <FormLabel>Border Radius</FormLabel>
            <Slider
              min={0}
              max={100}
              step={1}
              value={radius}
              onChange={(_, value) => {
                const val = Array.isArray(value) ? value[0] : value;
                setProp((props) => {
                  props.radius = val;
                }, 300);
              }}
            />
          </FormControl>
        </AccordionDetails>
      </Accordion>

      {/* ALIGNMENT */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Alignment</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Flex Direction</InputLabel>
            <Select
              size="small"
              value={flexDirection}
              label="Flex Direction"
              onChange={(e) => {
                const val = e.target.value as string;
                setProp((props) => {
                  props.flexDirection = val;
                }, 300);
              }}
            >
              <MenuItem value="row">row</MenuItem>
              <MenuItem value="column">column</MenuItem>
              <MenuItem value="row-reverse">row-reverse</MenuItem>
              <MenuItem value="column-reverse">column-reverse</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Fill Space?</InputLabel>
            <Select
              size="small"
              value={fillSpace}
              label="Fill Space?"
              onChange={(e) => {
                const val = e.target.value as string;
                setProp((props) => {
                  props.fillSpace = val;
                }, 300);
              }}
            >
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Align Items</InputLabel>
            <Select
              size="small"
              value={alignItems}
              label="Align Items"
              onChange={(e) => {
                const val = e.target.value as string;
                setProp((props) => {
                  props.alignItems = val;
                }, 300);
              }}
            >
              <MenuItem value="flex-start">flex-start</MenuItem>
              <MenuItem value="center">center</MenuItem>
              <MenuItem value="flex-end">flex-end</MenuItem>
              <MenuItem value="stretch">stretch</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Justify Content</InputLabel>
            <Select
              size="small"
              value={justifyContent}
              label="Justify Content"
              onChange={(e) => {
                const val = e.target.value as string;
                setProp((props) => {
                  props.justifyContent = val;
                }, 300);
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
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};
