import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * Defines the shape of the props for the Link component.
 */
interface ILinkProps {
  text?: string;
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  color?: string;
  background?: string;
  /** Exactly 4 elements: [top, right, bottom, left] */
  margin?: [number, number, number, number];
  /** Exactly 4 elements: [top, right, bottom, left] */
  padding?: [number, number, number, number];
  radius?: number;
  shadow?: number;
  width?: string;
  height?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
  children?: React.ReactNode;
}

/**
 * Props for the LinkProperties component.
 */
export interface LinkPropertiesProps {
  nodeId?: string;
}

/**
 * A small helper to display margin/padding controls with
 * a Slider + TextInput for each side.
 */
function SpacingControl({
  label,
  values,
  onChangeValues,
  max = 100,
}: {
  label: string;
  /** Expect a 4-element array or undefined */
  values?: [number, number, number, number];
  /** Must return a 4-element array */
  onChangeValues: (newValues: [number, number, number, number]) => void;
  max?: number;
}) {
  // If undefined, default to [0, 0, 0, 0]
  const safeValues: [number, number, number, number] = values ?? [0, 0, 0, 0];

  return (
    <Grid container spacing={2}>
      {['Top', 'Right', 'Bottom', 'Left'].map((pos, idx) => (
        <Grid item xs={6} key={pos}>
          <Slider
            label={`${label} ${pos}`}
            value={safeValues[idx]}
            min={0}
            max={max}
            onChangeValue={(val) => {
              // Copy & mutate the 4-element array
              const newVals = [...safeValues] as [
                number,
                number,
                number,
                number
              ];
              newVals[idx] = val;
              onChangeValues(newVals);
            }}
            showValueInput={false}
          />
          <TextInput
            label={pos}
            type="number"
            value={safeValues[idx].toString()}
            onChangeValue={(val) => {
              const num = parseInt(val, 10) || 0;
              const newVals = [...safeValues] as [
                number,
                number,
                number,
                number
              ];
              newVals[idx] = num;
              onChangeValues(newVals);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export const LinkProperties: React.FC<LinkPropertiesProps> = () => {
  const {
    text,
    href,
    target,
    color,
    background,
    margin,
    padding,
    radius,
    shadow,
    width,
    height,
    borderWidth,
    borderStyle,
    borderColor,
    actions: { setProp },
  } = useNode((node) => ({
    text: node.data.props.text,
    href: node.data.props.href,
    target: node.data.props.target,
    color: node.data.props.color,
    background: node.data.props.background,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    radius: node.data.props.radius,
    shadow: node.data.props.shadow,
    width: node.data.props.width,
    height: node.data.props.height,
    borderWidth: node.data.props.borderWidth,
    borderStyle: node.data.props.borderStyle,
    borderColor: node.data.props.borderColor,
  }));

  return (
    <>
      {/* LINK SECTION */}
      <Section title="Link" defaultExpanded>
        <Item>
          <TextInput
            label="Text"
            value={text || ''}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.text = newVal;
              })
            }
            helperText="If empty, children will be displayed instead"
          />
        </Item>

        <Item>
          <TextInput
            label="URL (href)"
            value={href || ''}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.href = newVal;
              })
            }
          />
        </Item>

        <Item>
          <Dropdown
            label="Target"
            value={target || '_blank'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.target = newVal as
                  | '_blank'
                  | '_self'
                  | '_parent'
                  | '_top';
              })
            }
            options={[
              { label: '_blank (New Tab)', value: '_blank' },
              { label: '_self (Same Tab)', value: '_self' },
              { label: '_parent', value: '_parent' },
              { label: '_top', value: '_top' },
            ]}
          />
        </Item>
      </Section>

      {/* STYLE SECTION */}
      <Section title="Style" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Text Color"
            value={color || '#000000'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.color = newVal;
              })
            }
          />
        </Item>

        <Item>
          <ColorPicker
            label="Background"
            value={background || 'transparent'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.background = newVal;
              })
            }
          />
        </Item>

        <Item>
          <Slider
            label="Shadow"
            value={shadow || 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: ILinkProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>

        <Item>
          <Slider
            label="Corner Radius"
            value={radius || 0}
            min={0}
            max={50}
            onChangeValue={(val) =>
              setProp((props: ILinkProps) => {
                props.radius = val;
              })
            }
          />
        </Item>
      </Section>

      {/* BORDER SECTION */}
      <Section title="Border" defaultExpanded={false}>
        <Item>
          <Slider
            label="Border Width"
            value={borderWidth || 0}
            min={0}
            max={20}
            onChangeValue={(val) =>
              setProp((props: ILinkProps) => {
                props.borderWidth = val;
              })
            }
          />
        </Item>

        <Item>
          <Dropdown
            label="Border Style"
            value={borderStyle || 'solid'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.borderStyle = newVal;
              })
            }
            options={[
              { value: 'none', label: 'None' },
              { value: 'solid', label: 'Solid' },
              { value: 'dotted', label: 'Dotted' },
              { value: 'dashed', label: 'Dashed' },
              { value: 'double', label: 'Double' },
            ]}
          />
        </Item>

        <Item>
          <ColorPicker
            label="Border Color"
            value={borderColor || '#000000'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.borderColor = newVal;
              })
            }
          />
        </Item>
      </Section>

      {/* SPACING SECTION */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: ILinkProps) => {
                props.margin = vals;
              })
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: ILinkProps) => {
                props.padding = vals;
              })
            }
          />
        </Item>
      </Section>

      {/* SIZE SECTION */}
      <Section title="Size" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Width"
            value={width || 'auto'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.width = newVal;
              })
            }
            helperText='e.g. "100px" or "auto"'
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height || 'auto'}
            onChangeValue={(newVal) =>
              setProp((props: ILinkProps) => {
                props.height = newVal;
              })
            }
            helperText='e.g. "50px" or "auto"'
          />
        </Item>
      </Section>
    </>
  );
};
