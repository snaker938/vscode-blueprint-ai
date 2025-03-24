import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';

/** A helper interface so we can unify all layout types in one component. */
interface ContainerProps {
  /** The chosen layout type: 'container' | 'row' | 'section' | 'grid' */
  layoutType?: 'container' | 'row' | 'section' | 'grid';

  /** Common dimension/appearance properties */
  width?: string;
  height?: string;
  background?: string;
  margin?: number[]; // [top, right, bottom, left]
  padding?: number[]; // [top, right, bottom, left]
  radius?: number;
  shadow?: number;
  fillSpace?: 'yes' | 'no';

  /** Generic border props (flattened) */
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;

  /**
   * Props for Container/Section (flex) layouts
   * (Row uses these too, though 'row' typically implies a forced 'row' direction.)
   */
  flexDirection?: 'row' | 'column';
  alignItems?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch'
    | 'start'
    | 'end';
  justifyContent?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around';

  /**
   * Row-specific props
   */
  gap?: number;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  /**
   * Grid-specific props
   */
  columns?: number;
  rows?: number;
  rowGap?: number;
  columnGap?: number;
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  alignGridItems?: 'start' | 'center' | 'end' | 'stretch';
}

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 */
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
    <Section title={label}>
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
    </Section>
  );
}

export const ContainerProperties = () => {
  const {
    // Layout type
    layoutType,

    // Common dimension/appearance
    width,
    height,
    background,
    margin,
    padding,
    radius,
    shadow,
    fillSpace,

    // Border
    borderStyle,
    borderColor,
    borderWidth,

    // Flex/Row/Section
    flexDirection,
    alignItems,
    justifyContent,

    // Row
    gap,
    flexWrap,

    // Grid
    columns,
    rows,
    rowGap,
    columnGap,
    justifyItems,
    alignGridItems,

    // Whether this node is the root container
    isRoot,

    actions: { setProp },
  } = useNode((node) => {
    const props = node.data.props as ContainerProps;

    return {
      // Layout
      layoutType: props.layoutType ?? 'container',

      // Dimensions / colors
      width: props.width ?? '300px',
      height: props.height ?? '150px',
      background: props.background ?? '#ffffff',

      // Spacing
      margin: props.margin,
      padding: props.padding,

      // Other appearance
      radius: props.radius ?? 0,
      shadow: props.shadow ?? 0,
      fillSpace: props.fillSpace ?? 'no',

      // Border
      borderStyle: props.borderStyle ?? 'solid',
      borderColor: props.borderColor ?? '#cccccc',
      borderWidth: props.borderWidth ?? 1,

      // Flex
      flexDirection: props.flexDirection ?? 'row',
      alignItems: props.alignItems ?? 'flex-start',
      justifyContent: props.justifyContent ?? 'flex-start',

      // Row
      gap: props.gap ?? 0,
      flexWrap: props.flexWrap ?? 'nowrap',

      // Grid
      columns: props.columns ?? 2,
      rows: props.rows ?? 2,
      rowGap: props.rowGap ?? 10,
      columnGap: props.columnGap ?? 10,
      justifyItems: props.justifyItems ?? 'stretch',
      alignGridItems: props.alignGridItems ?? 'stretch',

      // Check if this node is the root container
      isRoot: node.data.custom?.isRootContainer === true,
    };
  });

  return (
    <>
      {/* LAYOUT TYPE (hidden if root) */}
      {!isRoot && (
        <Section title="Layout Type">
          <Item>
            <Radio
              label="Layout Type"
              value={layoutType}
              onChangeValue={(val) =>
                setProp((props: ContainerProps) => {
                  props.layoutType = val as ContainerProps['layoutType'];
                })
              }
              options={[
                { label: 'Container', value: 'container' },
                { label: 'Row', value: 'row' },
                { label: 'Section', value: 'section' },
                { label: 'Grid', value: 'grid' },
              ]}
            />
          </Item>
        </Section>
      )}

      {/* DIMENSIONS */}
      <Section title="Dimensions">
        <Item>
          <TextInput
            label="Width"
            value={width}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.width = val;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.height = val;
              })
            }
          />
        </Item>
      </Section>

      {/* COLOURS */}
      <Section title="Colours">
        <Item>
          <ColorPicker
            label="Background Colour"
            value={background}
            onChangeValue={(newVal) =>
              setProp((props: ContainerProps) => {
                props.background = newVal;
              })
            }
            allowTextInput
            helperText="Pick or enter background colour"
          />
        </Item>
      </Section>

      {/* MARGIN (hidden if root) */}
      {!isRoot && (
        <SpacingControl
          label="Margin"
          values={margin}
          onChangeValues={(vals) =>
            setProp((props: ContainerProps) => {
              props.margin = vals;
            })
          }
        />
      )}

      {/* PADDING (always shown) */}
      <SpacingControl
        label="Padding"
        values={padding}
        onChangeValues={(vals) =>
          setProp((props: ContainerProps) => {
            props.padding = vals;
          })
        }
      />

      {/* DECORATION */}
      <Section title="Decoration">
        <Item>
          <Slider
            label="Corner Radius"
            value={radius}
            min={0}
            max={50}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.radius = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Shadow"
            value={shadow}
            min={0}
            max={50}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>
      </Section>

      {/* BORDER */}
      <Section title="Border">
        <Item>
          <ColorPicker
            label="Border Colour"
            value={borderColor}
            onChangeValue={(newColour) =>
              setProp((props: ContainerProps) => {
                props.borderColor = newColour;
              })
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Border Style"
            value={borderStyle}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.borderStyle = val;
              })
            }
          />
        </Item>
        <Item>
          <Slider
            label="Border Width"
            value={borderWidth}
            min={0}
            max={20}
            step={1}
            onChangeValue={(val) =>
              setProp((props: ContainerProps) => {
                props.borderWidth = val;
              })
            }
          />
        </Item>
      </Section>

      {/* LAYOUT SETTINGS */}
      <Section title="Layout Settings">
        {/* Fill Space (hidden if root) */}
        {!isRoot && (
          <Item>
            <SwitchInput
              label="Fill Space"
              value={fillSpace === 'yes'}
              onChangeValue={(checked) =>
                setProp((props: ContainerProps) => {
                  props.fillSpace = checked ? 'yes' : 'no';
                })
              }
            />
          </Item>
        )}

        {/*
         * container / section / row -> flex-based
         * grid -> grid-based
         */}

        {/* If layoutType is "container" or "section", show flex controls */}
        {(layoutType === 'container' || layoutType === 'section') && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Item>
                <Radio
                  label="Flex Direction"
                  value={flexDirection}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.flexDirection = val as 'row' | 'column';
                    })
                  }
                  options={[
                    { label: 'Row', value: 'row' },
                    { label: 'Column', value: 'column' },
                  ]}
                />
              </Item>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Item>
                <Radio
                  label="Align Items"
                  value={alignItems}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.alignItems = val as ContainerProps['alignItems'];
                    })
                  }
                  options={[
                    { label: 'Start', value: 'flex-start' },
                    { label: 'Center', value: 'center' },
                    { label: 'End', value: 'flex-end' },
                  ]}
                />
              </Item>
            </Grid>
            <Grid item xs={12}>
              <Item>
                <Radio
                  label="Justify Content"
                  value={justifyContent}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.justifyContent =
                        val as ContainerProps['justifyContent'];
                    })
                  }
                  options={[
                    { label: 'Start', value: 'flex-start' },
                    { label: 'Center', value: 'center' },
                    { label: 'End', value: 'flex-end' },
                    { label: 'Space Between', value: 'space-between' },
                    { label: 'Space Around', value: 'space-around' },
                  ]}
                />
              </Item>
            </Grid>
          </Grid>
        )}

        {/* If layoutType is "row", forcibly flex-direction: row, plus gap & wrap */}
        {layoutType === 'row' && (
          <>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Item>
                  <Slider
                    label="Gap"
                    value={gap}
                    min={0}
                    max={50}
                    step={1}
                    onChangeValue={(val) =>
                      setProp((props: ContainerProps) => {
                        props.gap = val;
                      })
                    }
                  />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Radio
                    label="Flex Wrap"
                    value={flexWrap}
                    onChangeValue={(val) =>
                      setProp((props: ContainerProps) => {
                        props.flexWrap = val as
                          | 'nowrap'
                          | 'wrap'
                          | 'wrap-reverse';
                      })
                    }
                    options={[
                      { label: 'No wrap', value: 'nowrap' },
                      { label: 'Wrap', value: 'wrap' },
                      { label: 'Wrap Reverse', value: 'wrap-reverse' },
                    ]}
                  />
                </Item>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <Item>
                  <Radio
                    label="Align Items"
                    value={alignItems}
                    onChangeValue={(val) =>
                      setProp((props: ContainerProps) => {
                        props.alignItems = val as ContainerProps['alignItems'];
                      })
                    }
                    options={[
                      { label: 'Start', value: 'flex-start' },
                      { label: 'Center', value: 'center' },
                      { label: 'End', value: 'flex-end' },
                      { label: 'Stretch', value: 'stretch' },
                      { label: 'Baseline', value: 'baseline' },
                    ]}
                  />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <Radio
                    label="Justify Content"
                    value={justifyContent}
                    onChangeValue={(val) =>
                      setProp((props: ContainerProps) => {
                        props.justifyContent =
                          val as ContainerProps['justifyContent'];
                      })
                    }
                    options={[
                      { label: 'Start', value: 'flex-start' },
                      { label: 'Center', value: 'center' },
                      { label: 'End', value: 'flex-end' },
                      { label: 'Space Between', value: 'space-between' },
                      { label: 'Space Around', value: 'space-around' },
                    ]}
                  />
                </Item>
              </Grid>
            </Grid>
          </>
        )}

        {/* If layoutType is "grid", show grid controls */}
        {layoutType === 'grid' && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Columns & Rows */}
            <Grid item xs={6}>
              <Item>
                <Slider
                  label="Columns"
                  value={columns}
                  min={1}
                  max={12}
                  step={1}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.columns = val;
                    })
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Slider
                  label="Rows"
                  value={rows}
                  min={1}
                  max={12}
                  step={1}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.rows = val;
                    })
                  }
                />
              </Item>
            </Grid>

            {/* Row Gap & Column Gap */}
            <Grid item xs={6}>
              <Item>
                <Slider
                  label="Row Gap"
                  value={rowGap}
                  min={0}
                  max={50}
                  step={1}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.rowGap = val;
                    })
                  }
                />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Slider
                  label="Column Gap"
                  value={columnGap}
                  min={0}
                  max={50}
                  step={1}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.columnGap = val;
                    })
                  }
                />
              </Item>
            </Grid>

            {/* Justify Items & Align Grid Items */}
            <Grid item xs={6}>
              <Item>
                <Radio
                  label="Justify Items"
                  value={justifyItems}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.justifyItems = val as
                        | 'start'
                        | 'center'
                        | 'end'
                        | 'stretch';
                    })
                  }
                  options={[
                    { label: 'Start', value: 'start' },
                    { label: 'Center', value: 'center' },
                    { label: 'End', value: 'end' },
                    { label: 'Stretch', value: 'stretch' },
                  ]}
                />
              </Item>
            </Grid>
            <Grid item xs={6}>
              <Item>
                <Radio
                  label="Align Items"
                  value={alignGridItems}
                  onChangeValue={(val) =>
                    setProp((props: ContainerProps) => {
                      props.alignGridItems = val as
                        | 'start'
                        | 'center'
                        | 'end'
                        | 'stretch';
                    })
                  }
                  options={[
                    { label: 'Start', value: 'start' },
                    { label: 'Center', value: 'center' },
                    { label: 'End', value: 'end' },
                    { label: 'Stretch', value: 'stretch' },
                  ]}
                />
              </Item>
            </Grid>
          </Grid>
        )}
      </Section>
    </>
  );
};
