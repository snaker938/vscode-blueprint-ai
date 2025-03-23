import React, { useMemo, useState, useEffect } from 'react';
import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

/**
 * Import your UI components from your library:
 * Adjust these imports to the correct paths in your codebase.
 */
import { ColorPicker } from '../../PropertiesSidebar/UI/ColorPicker';
import { Dropdown } from '../../PropertiesSidebar/UI/Dropdown';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Radio } from '../../PropertiesSidebar/UI/Radio';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

import { TextProps, RenderMode, LinkType } from './index';

/**
 * Import your page-store helpers
 */
import {
  getGlobalPages,
  subscribeGlobalPagesChange,
} from '../../PrimarySidebar/PagesTab/pageStore';

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
  // Fallback to [0,0,0,0] if values is undefined
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
 * A helper to show a single numeric slider + text input.
 * We’ll use it for fontWeight, but it could be reused for other numeric props.
 */
function SingleValueSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
}) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Slider
          label={label}
          value={value}
          min={min}
          max={max}
          step={step || 1}
          onChangeValue={onChange}
          showValueInput={false}
        />
      </Grid>
      <Grid item xs={6}>
        <TextInput
          label={`${label} (Value)`}
          type="number"
          value={value.toString()}
          onChangeValue={(val) => {
            const num = parseInt(val, 10);
            if (!isNaN(num)) {
              onChange(num);
            }
          }}
        />
      </Grid>
    </Grid>
  );
}

/**
 * Export the settings panel for our Text component.
 * This component is referenced in TextComponent.craft.related.settings.
 */
export const TextProperties: React.FC = () => {
  /**
   * Access the current component's props and the setProp action from Craft.js
   */
  const {
    actions: { setProp },

    // Existing props
    renderMode,
    fontSize,
    textAlign,
    fontWeight,
    textColor,
    shadow,
    text,
    margin,
    placeholder,
    fontFamily,
    background,
    multiline,
    disabled,
    readOnly,
    padding,
    radius,
    borderColor,
    borderStyle,
    borderWidth,
    width,
    height,
    href,
    linkType,
    pageId,

    // Textbox props
    maxLength,
    rows,
    cols,
    autoFocus,
    spellCheck,

    // Checkbox props
    hasCheckbox,
    checked,
    checkboxPosition,
  } = useNode((node) => ({
    // Destructure node.data.props so we can display/update them
    renderMode: node.data.props.renderMode,
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    fontWeight: node.data.props.fontWeight,
    textColor: node.data.props.textColor,
    shadow: node.data.props.shadow,
    text: node.data.props.text,
    margin: node.data.props.margin,
    placeholder: node.data.props.placeholder,
    fontFamily: node.data.props.fontFamily,
    background: node.data.props.background,
    multiline: node.data.props.multiline,
    disabled: node.data.props.disabled,
    readOnly: node.data.props.readOnly,
    padding: node.data.props.padding,
    radius: node.data.props.radius,
    borderColor: node.data.props.borderColor,
    borderStyle: node.data.props.borderStyle,
    borderWidth: node.data.props.borderWidth,
    width: node.data.props.width,
    height: node.data.props.height,
    href: node.data.props.href,
    linkType: node.data.props.linkType,
    pageId: node.data.props.pageId,

    maxLength: node.data.props.maxLength,
    rows: node.data.props.rows,
    cols: node.data.props.cols,
    autoFocus: node.data.props.autoFocus,
    spellCheck: node.data.props.spellCheck,

    hasCheckbox: node.data.props.hasCheckbox,
    checked: node.data.props.checked,
    checkboxPosition: node.data.props.checkboxPosition,
  }));

  /**************************************************************************
   * Replace pageVersion with direct pages state for the dropdown
   **************************************************************************/
  const [pages, setPages] = useState(() => getGlobalPages());

  useEffect(() => {
    // Subscribe to changes in the global pages array
    const unsubscribe = subscribeGlobalPagesChange(() => {
      // Whenever globalPages changes, update our local `pages` state
      setPages(getGlobalPages());
    });
    return unsubscribe;
  }, []);

  /**************************************************************************
   * Utility: sets any prop key to a new value using setProp
   **************************************************************************/
  const handleChange = <K extends keyof TextProps>(
    propName: K,
    value: TextProps[K]
  ) => {
    setProp((props: TextProps) => {
      props[propName] = value;
    });
  };

  /**************************************************************************
   * Some preset arrays or objects for rendering
   **************************************************************************/
  const linkTypeOptions = [
    { label: 'External URL', value: 'externalUrl' },
    { label: 'Page (internal)', value: 'page' },
  ];

  const textAlignOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'Center', value: 'center' },
    { label: 'Justify', value: 'justify' },
  ];

  const pageDropdownOptions = useMemo(() => {
    return pages.map((p) => ({
      label: `${p.name} (ID: ${p.id})`,
      value: p.id.toString(),
    }));
  }, [pages]);

  /**************************************************************************
   * Render
   **************************************************************************/
  return (
    <React.Fragment>
      {/* --- Rendering Mode Section --- */}
      <Section title="Mode" defaultExpanded={false}>
        <Item>
          <Radio
            label="Render Mode"
            options={[
              { label: 'Textbox', value: 'textbox' },
              { label: 'Link', value: 'link' },
              { label: 'Dropdown', value: 'dropdown' },
            ]}
            value={renderMode || 'textbox'}
            onChangeValue={(val) =>
              handleChange('renderMode', val as RenderMode)
            }
            row
          />
        </Item>
      </Section>

      {/* --- Text Content Section --- */}
      <Section title="Text Content" defaultExpanded={false}>
        <Item>
          <TextInput
            label={
              renderMode === 'dropdown'
                ? 'Dropdown Items (use "||" as separator)'
                : 'Text'
            }
            value={text ?? ''}
            onChangeValue={(val) => handleChange('text', val)}
          />
        </Item>

        {/* If using textbox mode, placeholder + other textbox props might be relevant */}
        {renderMode === 'textbox' && (
          <Item>
            <TextInput
              label="Placeholder"
              value={placeholder ?? ''}
              onChangeValue={(val) => handleChange('placeholder', val)}
            />
          </Item>
        )}
      </Section>

      {/* --- Appearance Section --- */}
      <Section title="Appearance" defaultExpanded={false}>
        <Item>
          <Dropdown
            label="Text Align"
            value={textAlign ?? 'left'}
            onChangeValue={(val) => handleChange('textAlign', val)}
            options={textAlignOptions}
          />
        </Item>
        {/* Font Weight with slider + text input */}
        <Item>
          <SingleValueSlider
            label="Font Weight"
            value={parseInt(fontWeight ?? '400', 10)}
            min={100}
            max={900}
            step={100}
            onChange={(val) => handleChange('fontWeight', val.toString())}
          />
        </Item>
        <Item>
          <TextInput
            label="Font Family"
            value={fontFamily ?? ''}
            onChangeValue={(val) => handleChange('fontFamily', val)}
          />
        </Item>
        <Item>
          <Slider
            label="Font Size"
            value={fontSize ?? 15}
            min={8}
            max={72}
            step={1}
            onChangeValue={(val) => handleChange('fontSize', val)}
          />
        </Item>
        <Item>
          <Slider
            label="Shadow Intensity"
            value={shadow ?? 0}
            min={0}
            max={100}
            step={1}
            onChangeValue={(val) => handleChange('shadow', val)}
          />
        </Item>
        <Item>
          <ColorPicker
            label="Text Color"
            value={textColor}
            onChangeValue={(newHex) => handleChange('textColor', newHex)}
          />
        </Item>
        <Item>
          <ColorPicker
            label="Background"
            value={background}
            onChangeValue={(newHex) => handleChange('background', newHex)}
          />
        </Item>
      </Section>

      {/* --- Layout & Spacing Section --- */}
      <Section title="Layout & Spacing" defaultExpanded={false}>
        <Item>
          <Slider
            label="Border Width"
            value={borderWidth ?? 0}
            min={0}
            max={20}
            step={1}
            onChangeValue={(val) => handleChange('borderWidth', val)}
          />
        </Item>
        <Item>
          <TextInput
            label="Border Style"
            value={borderStyle ?? 'solid'}
            onChangeValue={(val) => handleChange('borderStyle', val)}
          />
        </Item>
        <Item>
          <ColorPicker
            label="Border Color"
            value={borderColor}
            onChangeValue={(newHex) => handleChange('borderColor', newHex)}
          />
        </Item>
        <Item>
          <Slider
            label="Border Radius"
            value={radius ?? 0}
            min={0}
            max={50}
            step={1}
            onChangeValue={(val) => handleChange('radius', val)}
          />
        </Item>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(newVals) =>
              handleChange(
                'margin',
                newVals as [number, number, number, number]
              )
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(newVals) =>
              handleChange(
                'padding',
                newVals as [number, number, number, number]
              )
            }
          />
        </Item>
        <Item>
          <TextInput
            label="Width"
            value={width ?? ''}
            onChangeValue={(val) => handleChange('width', val)}
            helperText="Use CSS units (e.g. 200px, 50%, auto)"
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height ?? ''}
            onChangeValue={(val) => handleChange('height', val)}
            helperText="Use CSS units (e.g. 40px, auto)"
          />
        </Item>
      </Section>

      {/* --- Link Section (only relevant if renderMode === 'link') --- */}
      {renderMode === 'link' && (
        <Section title="Link Settings" defaultExpanded={false}>
          <Item>
            <Radio
              label="Link Type"
              options={linkTypeOptions}
              value={linkType ?? 'externalUrl'}
              onChangeValue={(val) => handleChange('linkType', val as LinkType)}
            />
          </Item>
          {/* If externalUrl, show only the Href input */}
          {linkType === 'externalUrl' && (
            <Item>
              <TextInput
                label="External URL (href)"
                value={href ?? ''}
                onChangeValue={(val) => handleChange('href', val)}
              />
            </Item>
          )}

          {/* If page, show a dropdown of pages */}
          {linkType === 'page' && (
            <Item>
              <Dropdown
                label="Select Page"
                value={pageId?.toString() ?? ''}
                onChangeValue={(val) =>
                  handleChange('pageId', parseInt(val, 10) || 0)
                }
                options={pageDropdownOptions}
              />
            </Item>
          )}
        </Section>
      )}

      {/* --- Interactions Section (for multiline, disabled, readOnly) --- */}
      <Section title="Interactions" defaultExpanded={false}>
        {/* Show multiline only if renderMode === 'textbox' */}
        {renderMode === 'textbox' && (
          <Item>
            <SwitchInput
              label="Multiline?"
              value={!!multiline}
              onChangeValue={(val) => handleChange('multiline', val)}
            />
          </Item>
        )}
        <Item>
          <SwitchInput
            label="Disabled"
            value={!!disabled}
            onChangeValue={(val) => handleChange('disabled', val)}
          />
        </Item>
        <Item>
          <SwitchInput
            label="Read-Only"
            value={!!readOnly}
            onChangeValue={(val) => handleChange('readOnly', val)}
          />
        </Item>
      </Section>

      {/* --- Textbox Props (only if textbox mode) --- */}
      {renderMode === 'textbox' && (
        <Section title="Textbox Props" defaultExpanded={false}>
          <Item>
            <TextInput
              label="Max Length"
              type="number"
              value={maxLength?.toString() ?? ''}
              onChangeValue={(val) =>
                handleChange('maxLength', parseInt(val, 10) || undefined)
              }
            />
          </Item>
          <Item>
            <TextInput
              label="Rows (for multiline)"
              type="number"
              value={rows?.toString() ?? ''}
              onChangeValue={(val) =>
                handleChange('rows', parseInt(val, 10) || undefined)
              }
            />
          </Item>
          <Item>
            <TextInput
              label="Cols (for multiline)"
              type="number"
              value={cols?.toString() ?? ''}
              onChangeValue={(val) =>
                handleChange('cols', parseInt(val, 10) || undefined)
              }
            />
          </Item>
          <Item>
            <SwitchInput
              label="Auto Focus"
              value={!!autoFocus}
              onChangeValue={(val) => handleChange('autoFocus', val)}
            />
          </Item>
          <Item>
            <SwitchInput
              label="Spell Check"
              value={spellCheck ?? true}
              onChangeValue={(val) => handleChange('spellCheck', val)}
            />
          </Item>
        </Section>
      )}

      {/* --- Checkbox Props (applies to either mode) --- */}
      <Section title="Checkbox" defaultExpanded={false}>
        <Item>
          <SwitchInput
            label="Has Checkbox?"
            value={!!hasCheckbox}
            onChangeValue={(val) => handleChange('hasCheckbox', val)}
          />
        </Item>
        {hasCheckbox && (
          <>
            <Item>
              <SwitchInput
                label="Checked?"
                value={!!checked}
                onChangeValue={(val) => handleChange('checked', val)}
              />
            </Item>
            <Item>
              <Radio
                label="Checkbox Position"
                options={[
                  { label: 'Left', value: 'left' },
                  { label: 'Right', value: 'right' },
                ]}
                value={checkboxPosition ?? 'left'}
                onChangeValue={(val) =>
                  handleChange('checkboxPosition', val as 'left' | 'right')
                }
                row
              />
            </Item>
          </>
        )}
      </Section>
    </React.Fragment>
  );
};
