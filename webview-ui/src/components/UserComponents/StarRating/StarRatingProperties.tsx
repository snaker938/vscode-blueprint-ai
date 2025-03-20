import React from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

// UI components from your PropertiesSidebar
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';

// --------------------------------------------
// SpacingControl helper function
// --------------------------------------------
function SpacingControl({
  label,
  values,
  onChangeValues,
  max = 100,
}: {
  label: string;
  values?: number[];
  onChangeValues: (newValues: number[]) => void;
  max?: number;
}) {
  const safeValues = values ?? [0, 0, 0, 0];

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
              const newVals = [...safeValues];
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
              const newVals = [...safeValues];
              newVals[idx] = num;
              onChangeValues(newVals);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

// --------------------------------------------
// Interface for the StarRating component's props
// --------------------------------------------
export interface StarRatingComponentProps {
  /** The current rating out of maxRating. */
  rating: number;

  /** The maximum rating. */
  maxRating: number;

  /** Color of the filled part of the stars. */
  starColor: string;

  /** Spacing (in px) between stars. */
  starSpacing: number;

  /** Background color (container wrapper). */
  background: string;

  /** The overall width of the star rating block (e.g., "150px" or "100%"). */
  width: string;

  /** The overall height of the star rating block (e.g., "50px" or "auto"). */
  height: string;

  /** Margin in the format [top, right, bottom, left]. */
  margin: [number, number, number, number];

  /** Padding in the format [top, right, bottom, left]. */
  padding: [number, number, number, number];
}

/**
 * StarRatingProperties
 *
 * A property editor for the StarRating component within Craft.
 * It exposes controls for rating, maximum rating, star color, spacing,
 * as well as background, dimensions, margins, and paddings.
 */
export const StarRatingProperties: React.FC = () => {
  const {
    rating,
    maxRating,
    starColor,
    starSpacing,
    background,
    width,
    height,
    margin,
    padding,
    actions: { setProp },
  } = useNode((node) => ({
    rating: node.data.props.rating,
    maxRating: node.data.props.maxRating,
    starColor: node.data.props.starColor,
    starSpacing: node.data.props.starSpacing,
    background: node.data.props.background,
    width: node.data.props.width,
    height: node.data.props.height,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
  }));

  return (
    <>
      {/* STAR RATING CONTROLS */}
      <Section title="Star Settings" defaultExpanded={false}>
        <Item>
          {/* Current rating */}
          <Slider
            label="Current Rating"
            value={rating}
            min={0}
            max={maxRating}
            onChangeValue={(newVal) =>
              setProp((props: StarRatingComponentProps) => {
                props.rating = Math.max(0, Math.min(newVal, props.maxRating));
              })
            }
            helperText="Adjust current rating"
          />
        </Item>

        <Item>
          {/* Max rating */}
          <Slider
            label="Max Rating"
            value={maxRating}
            min={1}
            max={20}
            onChangeValue={(newVal) =>
              setProp((props: StarRatingComponentProps) => {
                props.maxRating = newVal;
                // Ensure the current rating doesn't exceed new max
                if (props.rating > newVal) {
                  props.rating = newVal;
                }
              })
            }
            helperText="Total stars"
          />
        </Item>

        <Item>
          {/* Star spacing */}
          <Slider
            label="Star Spacing"
            value={starSpacing}
            min={0}
            max={30}
            onChangeValue={(newVal) =>
              setProp((props: StarRatingComponentProps) => {
                props.starSpacing = newVal;
              })
            }
            helperText="Pixels between stars"
          />
        </Item>

        <Item>
          {/* Star color */}
          <ColorPicker
            label="Star Color"
            value={starColor}
            onChangeValue={(newHex) =>
              setProp((props: StarRatingComponentProps) => {
                props.starColor = newHex;
              })
            }
            allowTextInput
            helperText="Pick a star color"
          />
        </Item>
      </Section>

      {/* APPEARANCE & LAYOUT */}
      <Section title="Appearance" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Background Color"
            value={background}
            onChangeValue={(newHex) =>
              setProp((props: StarRatingComponentProps) => {
                props.background = newHex;
              })
            }
            helperText="Container background"
          />
        </Item>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Item>
              <TextInput
                label="Width"
                value={width}
                onChangeValue={(newVal) =>
                  setProp((props: StarRatingComponentProps) => {
                    props.width = newVal;
                  })
                }
                helperText="Ex: 150px or 100%"
              />
            </Item>
          </Grid>
          <Grid item xs={6}>
            <Item>
              <TextInput
                label="Height"
                value={height}
                onChangeValue={(newVal) =>
                  setProp((props: StarRatingComponentProps) => {
                    props.height = newVal;
                  })
                }
                helperText="Ex: 50px or auto"
              />
            </Item>
          </Grid>
        </Grid>
      </Section>

      {/* SPACING */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: StarRatingComponentProps) => {
                props.margin = [
                  vals[0] || 0,
                  vals[1] || 0,
                  vals[2] || 0,
                  vals[3] || 0,
                ];
              })
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: StarRatingComponentProps) => {
                props.padding = [
                  vals[0] || 0,
                  vals[1] || 0,
                  vals[2] || 0,
                  vals[3] || 0,
                ];
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
