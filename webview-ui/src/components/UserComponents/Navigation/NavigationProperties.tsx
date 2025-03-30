/**
 * NavigationProperties.tsx
 * The property editor for the Navigation component (Navbar/Sidebar).
 */

import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { useNode } from '@craftjs/core';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { Radio } from '../../PropertiesSidebar/UI/Radio';

// 1) Import from the new store
import { Page, getPages, subscribePageChange } from '../../../store/store';
import { INavigationProps } from './index';

/**
 * Convert a spacing string (e.g. "10px 5px") to an array [top, right, bottom, left].
 */
function parseSpacing(spacingStr?: string): number[] {
  if (!spacingStr) return [0, 0, 0, 0];
  const parts = spacingStr.split(/\s+/).filter(Boolean);
  const nums = parts.map((part) => parseInt(part.replace('px', ''), 10) || 0);
  while (nums.length < 4) {
    nums.push(0);
  }
  if (nums.length > 4) {
    nums.length = 4;
  }
  return nums;
}

/**
 * Convert a 4-number spacing array (e.g. [10, 5, 10, 5])
 * to a spacing string "10px 5px 10px 5px".
 */
function spacingArrayToString(spacingArr: number[]): string {
  return spacingArr.map((num) => `${num}px`).join(' ');
}

/**
 * A helper to display margin/padding with a Slider & numeric text input for each side.
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

/**
 * The property editor for our Navigation component.
 */
export const NavigationProperties: React.FC = () => {
  // Pull props from the currently selected Navigation node in Craft.js
  const {
    navType,
    displayName,
    background,
    collapsible,
    collapsedWidth,
    expandedWidth,
    width,
    height,
    highlightSelected,
    linkStyle,
    textColor,
    margin,
    padding,
    pageDisplayNames,
    actions: { setProp },
  } = useNode((node) => {
    const props = node.data.props as INavigationProps;
    return {
      navType: props.navType ?? 'navbar',
      displayName: props.displayName ?? 'MySite',
      background: props.background ?? '#ffffff',
      collapsible: props.collapsible ?? true,
      collapsedWidth: props.collapsedWidth ?? '60px',
      expandedWidth: props.expandedWidth ?? '250px',
      width: props.width ?? '200px',
      height: props.height ?? '100%',
      highlightSelected: props.highlightSelected ?? true,
      linkStyle: props.linkStyle ?? {},
      textColor: props.textColor ?? '#333',
      margin: props.margin ?? '0',
      padding: props.padding ?? '10px',
      // If pageDisplayNames is undefined, fallback to an empty object
      pageDisplayNames: props.pageDisplayNames ?? {},
    };
  });

  // 2) Track the global pages from the store to show page-name overrides
  const [globalPages, setGlobalPages] = useState<Page[]>(() => getPages());

  useEffect(() => {
    // Subscribe to changes in pages or suggested pages
    const handlePagesChange = () => {
      setGlobalPages(getPages());
    };
    const unsub = subscribePageChange(handlePagesChange);
    return () => {
      unsub();
    };
  }, []);

  // If the linkStyle includes a color, use it. Otherwise fallback to textColor or '#333'
  const linkColor: string = (linkStyle.color as string) || '#333';

  // Parse margin/padding for spacing controls
  const marginValues = parseSpacing(margin);
  const paddingValues = parseSpacing(padding);

  return (
    <>
      {/* NAV TYPE SECTION */}
      <Section title="Navigation Type" defaultExpanded>
        <Item>
          <Radio
            label="Select Navigation Type"
            value={navType}
            onChangeValue={(val) =>
              setProp((props: INavigationProps) => {
                props.navType = val as 'navbar' | 'sidebar';
              })
            }
            options={[
              { label: 'Navbar', value: 'navbar' },
              { label: 'Sidebar', value: 'sidebar' },
            ]}
            row
          />
        </Item>
      </Section>

      {/* GENERAL SETTINGS */}
      <Section title="General" defaultExpanded>
        <Item>
          <TextInput
            label="Display Name"
            value={displayName}
            onChangeValue={(newVal) =>
              setProp((props: INavigationProps) => {
                props.displayName = newVal;
              })
            }
          />
        </Item>

        <Item>
          <ColorPicker
            label="Background Color"
            value={background}
            onChangeValue={(newColor) =>
              setProp((props: INavigationProps) => {
                props.background = newColor;
              })
            }
            allowTextInput
            helperText="Navbar/Sidebar background"
          />
        </Item>

        <Item>
          <ColorPicker
            label="Text Color"
            value={textColor}
            onChangeValue={(newColor) =>
              setProp((props: INavigationProps) => {
                props.textColor = newColor;
              })
            }
            allowTextInput
            helperText="Brand name & general text color"
          />
        </Item>

        <Item>
          <SwitchInput
            label="Highlight Selected Page?"
            value={highlightSelected}
            onChangeValue={(checked) =>
              setProp((props: INavigationProps) => {
                props.highlightSelected = checked;
              })
            }
          />
        </Item>
      </Section>

      {/* SPACING CONTROLS */}
      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={marginValues}
            onChangeValues={(newVals) =>
              setProp((props: INavigationProps) => {
                props.margin = spacingArrayToString(newVals);
              })
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={paddingValues}
            onChangeValues={(newVals) =>
              setProp((props: INavigationProps) => {
                props.padding = spacingArrayToString(newVals);
              })
            }
          />
        </Item>
      </Section>

      {/* LINK STYLE */}
      <Section title="Link Style" defaultExpanded={false}>
        <Item>
          <ColorPicker
            label="Link Color"
            value={linkColor}
            onChangeValue={(newColor) =>
              setProp((props: INavigationProps) => {
                props.linkStyle = {
                  ...props.linkStyle,
                  color: newColor,
                };
              })
            }
            allowTextInput
          />
        </Item>
      </Section>

      {/* SIDEBAR SETTINGS */}
      {navType === 'sidebar' && (
        <Section title="Sidebar Settings" defaultExpanded={false}>
          <Item>
            <SwitchInput
              label="Collapsible?"
              value={collapsible}
              onChangeValue={(checked) =>
                setProp((props: INavigationProps) => {
                  props.collapsible = checked;
                })
              }
            />
          </Item>

          {/* If collapsible is false, show a plain width input */}
          {!collapsible && (
            <Item>
              <TextInput
                label="Width"
                value={width}
                onChangeValue={(newVal) =>
                  setProp((props: INavigationProps) => {
                    props.width = newVal;
                  })
                }
                helperText="e.g. '200px'"
              />
            </Item>
          )}

          {/* If collapsible is true, show collapsed/expanded widths */}
          {collapsible && (
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Item>
                  <TextInput
                    label="Collapsed Width"
                    value={collapsedWidth}
                    onChangeValue={(newVal) =>
                      setProp((props: INavigationProps) => {
                        props.collapsedWidth = newVal;
                      })
                    }
                    helperText="e.g. '60px'"
                  />
                </Item>
              </Grid>
              <Grid item xs={6}>
                <Item>
                  <TextInput
                    label="Expanded Width"
                    value={expandedWidth}
                    onChangeValue={(newVal) =>
                      setProp((props: INavigationProps) => {
                        props.expandedWidth = newVal;
                      })
                    }
                    helperText="e.g. '250px'"
                  />
                </Item>
              </Grid>
            </Grid>
          )}

          <Item>
            <TextInput
              label="Height"
              value={height}
              onChangeValue={(newVal) =>
                setProp((props: INavigationProps) => {
                  props.height = newVal;
                })
              }
              helperText="e.g. '100%'"
            />
          </Item>
        </Section>
      )}

      {/* PAGE DISPLAY NAME OVERRIDES */}
      {globalPages && globalPages.length > 0 && (
        <Section title="Page Display Name Overrides" defaultExpanded={false}>
          {globalPages.map((page) => {
            const overrideVal = pageDisplayNames[page.id] || '';
            return (
              <Item key={page.id}>
                <TextInput
                  label={`Override: ${page.name}`}
                  value={overrideVal}
                  onChangeValue={(newVal) =>
                    setProp((props: INavigationProps) => {
                      props.pageDisplayNames = {
                        ...(props.pageDisplayNames || {}),
                        [page.id]: newVal,
                      };
                    })
                  }
                  helperText={`ID: ${page.id}`}
                />
              </Item>
            );
          })}
        </Section>
      )}
    </>
  );
};
