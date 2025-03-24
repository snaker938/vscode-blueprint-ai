import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './LayoutTab.css';
import { useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import { CustomLayers } from './LayersComponent/CustomLayers';

import {
  TextField,
  Dropdown,
  IDropdownOption,
  Toggle,
  Slider,
  Text,
} from '@fluentui/react';

/** The container props interface. */
interface ContainerProps {
  layoutType?: 'container' | 'row' | 'section' | 'grid';

  width?: string;
  height?: string;
  background?: string;
  margin?: number[]; // [top, right, bottom, left]
  padding?: number[]; // [top, right, bottom, left]
  radius?: number;
  shadow?: number;
  fillSpace?: 'yes' | 'no';

  borderStyle?: string;
  borderColor?: string;
  borderWidth?: number;

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

  gap?: number;
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';

  columns?: number;
  rows?: number;
  rowGap?: number;
  columnGap?: number;
  justifyItems?: 'start' | 'center' | 'end' | 'stretch';
  alignGridItems?: 'start' | 'center' | 'end' | 'stretch';
}

const Wrapper = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

export const LayoutTab: React.FC = () => {
  const { actions, query } = useEditor();

  // Fetch the ROOT node and its current props.
  const rootNode = query.node(ROOT_NODE).get();
  const initialProps = (rootNode.data.props || {}) as ContainerProps;

  /**
   * We use fallback defaults (the `??` operator) to ensure state cannot be `undefined`.
   */

  // Layout type
  const [layoutType, setLayoutType] = useState<
    'container' | 'row' | 'section' | 'grid'
  >(initialProps.layoutType ?? 'container');

  // Dimensions & background
  const [width, setWidth] = useState(initialProps.width ?? '300px');
  const [height, setHeight] = useState(initialProps.height ?? '150px');
  const [background, setBackground] = useState(
    initialProps.background ?? '#ffffff'
  );

  // Margin [top, right, bottom, left]
  const [marginTop, setMarginTop] = useState(initialProps.margin?.[0] ?? 0);
  const [marginRight, setMarginRight] = useState(initialProps.margin?.[1] ?? 0);
  const [marginBottom, setMarginBottom] = useState(
    initialProps.margin?.[2] ?? 0
  );
  const [marginLeft, setMarginLeft] = useState(initialProps.margin?.[3] ?? 0);

  // Padding [top, right, bottom, left]
  const [paddingTop, setPaddingTop] = useState(initialProps.padding?.[0] ?? 0);
  const [paddingRight, setPaddingRight] = useState(
    initialProps.padding?.[1] ?? 0
  );
  const [paddingBottom, setPaddingBottom] = useState(
    initialProps.padding?.[2] ?? 0
  );
  const [paddingLeft, setPaddingLeft] = useState(
    initialProps.padding?.[3] ?? 0
  );

  // Decoration
  const [radius, setRadius] = useState(initialProps.radius ?? 0);
  const [shadow, setShadow] = useState(initialProps.shadow ?? 0);

  // Fill space toggle
  const [fillSpace, setFillSpace] = useState<'yes' | 'no'>(
    initialProps.fillSpace ?? 'no'
  );

  // Border
  const [borderStyle, setBorderStyle] = useState(
    initialProps.borderStyle ?? 'solid'
  );
  const [borderColor, setBorderColor] = useState(
    initialProps.borderColor ?? '#cccccc'
  );
  const [borderWidth, setBorderWidth] = useState(initialProps.borderWidth ?? 1);

  // Flex / row / section
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>(
    initialProps.flexDirection ?? 'row'
  );
  const [alignItems, setAlignItems] = useState<
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'baseline'
    | 'stretch'
    | 'start'
    | 'end'
  >(initialProps.alignItems ?? 'flex-start');
  const [justifyContent, setJustifyContent] = useState<
    'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
  >(initialProps.justifyContent ?? 'flex-start');

  // Row
  const [gap, setGap] = useState(initialProps.gap ?? 0);
  const [flexWrap, setFlexWrap] = useState<'nowrap' | 'wrap' | 'wrap-reverse'>(
    initialProps.flexWrap ?? 'nowrap'
  );

  // Grid
  const [columns, setColumns] = useState(initialProps.columns ?? 2);
  const [rows, setRows] = useState(initialProps.rows ?? 2);
  const [rowGap, setRowGap] = useState(initialProps.rowGap ?? 10);
  const [columnGap, setColumnGap] = useState(initialProps.columnGap ?? 10);
  const [justifyItems, setJustifyItems] = useState<
    'start' | 'center' | 'end' | 'stretch'
  >(initialProps.justifyItems ?? 'stretch');
  const [alignGridItems, setAlignGridItems] = useState<
    'start' | 'center' | 'end' | 'stretch'
  >(initialProps.alignGridItems ?? 'stretch');

  /**
   * Sync local state -> Root node whenever values change.
   */
  useEffect(() => {
    actions.setProp(ROOT_NODE, (props: ContainerProps) => {
      props.layoutType = layoutType;

      props.width = width;
      props.height = height;
      props.background = background;

      props.margin = [marginTop, marginRight, marginBottom, marginLeft];
      props.padding = [paddingTop, paddingRight, paddingBottom, paddingLeft];

      props.radius = radius;
      props.shadow = shadow;
      props.fillSpace = fillSpace;

      props.borderStyle = borderStyle;
      props.borderColor = borderColor;
      props.borderWidth = borderWidth;

      props.flexDirection = flexDirection;
      props.alignItems = alignItems;
      props.justifyContent = justifyContent;

      props.gap = gap;
      props.flexWrap = flexWrap;

      props.columns = columns;
      props.rows = rows;
      props.rowGap = rowGap;
      props.columnGap = columnGap;
      props.justifyItems = justifyItems;
      props.alignGridItems = alignGridItems;
    });
  }, [
    actions,
    layoutType,
    width,
    height,
    background,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    radius,
    shadow,
    fillSpace,
    borderStyle,
    borderColor,
    borderWidth,
    flexDirection,
    alignItems,
    justifyContent,
    gap,
    flexWrap,
    columns,
    rows,
    rowGap,
    columnGap,
    justifyItems,
    alignGridItems,
  ]);

  /**
   * Options for your dropdowns.
   */
  const layoutTypeOptions: IDropdownOption[] = [
    { key: 'container', text: 'Container' },
    { key: 'row', text: 'Row' },
    { key: 'section', text: 'Section' },
    { key: 'grid', text: 'Grid' },
  ];

  const borderStyleOptions: IDropdownOption[] = [
    { key: 'solid', text: 'Solid' },
    { key: 'dashed', text: 'Dashed' },
    { key: 'dotted', text: 'Dotted' },
    { key: 'double', text: 'Double' },
  ];

  const alignItemsOptions: IDropdownOption[] = [
    { key: 'flex-start', text: 'Start' },
    { key: 'center', text: 'Center' },
    { key: 'flex-end', text: 'End' },
    { key: 'stretch', text: 'Stretch' },
    { key: 'baseline', text: 'Baseline' },
  ];

  const justifyContentOptions: IDropdownOption[] = [
    { key: 'flex-start', text: 'Start' },
    { key: 'center', text: 'Center' },
    { key: 'flex-end', text: 'End' },
    { key: 'space-between', text: 'Space Between' },
    { key: 'space-around', text: 'Space Around' },
  ];

  const flexWrapOptions: IDropdownOption[] = [
    { key: 'nowrap', text: 'No Wrap' },
    { key: 'wrap', text: 'Wrap' },
    { key: 'wrap-reverse', text: 'Wrap Reverse' },
  ];

  const justifyItemsOptions: IDropdownOption[] = [
    { key: 'start', text: 'Start' },
    { key: 'center', text: 'Center' },
    { key: 'end', text: 'End' },
    { key: 'stretch', text: 'Stretch' },
  ];

  const alignGridItemsOptions: IDropdownOption[] = [
    { key: 'start', text: 'Start' },
    { key: 'center', text: 'Center' },
    { key: 'end', text: 'End' },
    { key: 'stretch', text: 'Stretch' },
  ];

  return (
    <Wrapper>
      <Text
        variant="xLarge"
        styles={{
          root: { color: '#4b3f72', fontWeight: 700, marginBottom: 15 },
        }}
      >
        Layout
      </Text>

      {/* Layout Type */}
      <div className="layout-tab-section">
        <label className="section-label">Layout Type</label>
        <Dropdown
          options={layoutTypeOptions}
          selectedKey={layoutType}
          onChange={(_, option) => {
            if (!option) return;
            setLayoutType(
              option.key as 'container' | 'row' | 'section' | 'grid'
            );
          }}
        />
      </div>

      {/* Dimensions */}
      <div className="layout-tab-section">
        <label className="section-label">Dimensions</label>
        <div className="dimension-row">
          <div className="dimension-input">
            <label>Width</label>
            <TextField
              value={width}
              onChange={(_, val) => setWidth(val ?? '')}
            />
          </div>
          <div className="dimension-input">
            <label>Height</label>
            <TextField
              value={height}
              onChange={(_, val) => setHeight(val ?? '')}
            />
          </div>
        </div>
      </div>

      {/* Background */}
      <div className="layout-tab-section">
        <label className="section-label">Background</label>
        <TextField
          label="Background Color"
          value={background}
          onChange={(_, val) => setBackground(val ?? '')}
        />
      </div>

      {/* Margin */}
      <div className="layout-tab-section">
        <label className="section-label">Margin</label>
        <div className="padding-row">
          <div className="input-small">
            <label>Top</label>
            <TextField
              value={String(marginTop)}
              onChange={(_, val) => setMarginTop(Number(val) || 0)}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Right</label>
            <TextField
              value={String(marginRight)}
              onChange={(_, val) => setMarginRight(Number(val) || 0)}
              type="number"
            />
          </div>
        </div>
        <div className="padding-row">
          <div className="input-small">
            <label>Bottom</label>
            <TextField
              value={String(marginBottom)}
              onChange={(_, val) => setMarginBottom(Number(val) || 0)}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Left</label>
            <TextField
              value={String(marginLeft)}
              onChange={(_, val) => setMarginLeft(Number(val) || 0)}
              type="number"
            />
          </div>
        </div>
      </div>

      {/* Padding */}
      <div className="layout-tab-section">
        <label className="section-label">Padding</label>
        <div className="padding-row">
          <div className="input-small">
            <label>Top</label>
            <TextField
              value={String(paddingTop)}
              onChange={(_, val) => setPaddingTop(Number(val) || 0)}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Right</label>
            <TextField
              value={String(paddingRight)}
              onChange={(_, val) => setPaddingRight(Number(val) || 0)}
              type="number"
            />
          </div>
        </div>
        <div className="padding-row">
          <div className="input-small">
            <label>Bottom</label>
            <TextField
              value={String(paddingBottom)}
              onChange={(_, val) => setPaddingBottom(Number(val) || 0)}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Left</label>
            <TextField
              value={String(paddingLeft)}
              onChange={(_, val) => setPaddingLeft(Number(val) || 0)}
              type="number"
            />
          </div>
        </div>
      </div>

      {/* Decoration: Radius & Shadow */}
      <div className="layout-tab-section">
        <label className="section-label">Decoration</label>
        <div className="slider-pair">
          <label>Corner Radius: {radius}px</label>
          <Slider
            min={0}
            max={50}
            step={1}
            value={radius}
            showValue={false}
            onChange={(val) => setRadius(val)}
          />
        </div>

        <div className="slider-pair">
          <label>Shadow: {shadow}px</label>
          <Slider
            min={0}
            max={50}
            step={1}
            value={shadow}
            showValue={false}
            onChange={(val) => setShadow(val)}
          />
        </div>
      </div>

      {/* Border */}
      <div className="layout-tab-section">
        <label className="section-label">Border</label>
        <TextField
          label="Border Color"
          value={borderColor}
          onChange={(_, val) => setBorderColor(val ?? '')}
        />

        <Dropdown
          label="Border Style"
          options={borderStyleOptions}
          selectedKey={borderStyle}
          onChange={(_, option) => {
            if (!option) return;
            setBorderStyle(option.key as string);
          }}
        />

        <div className="slider-pair">
          <label>Border Width: {borderWidth}px</label>
          <Slider
            min={0}
            max={20}
            step={1}
            value={borderWidth}
            showValue={false}
            onChange={(val) => setBorderWidth(val)}
          />
        </div>
      </div>

      {/* Layout Settings */}
      <div className="layout-tab-section">
        <label className="section-label">Layout Settings</label>
        <div className="toggle-row">
          <label>Fill Space</label>
          <Toggle
            checked={fillSpace === 'yes'}
            onChange={(_, checked) => {
              setFillSpace(checked ? 'yes' : 'no');
            }}
          />
        </div>

        {/* container / section => flexDirection, alignItems, justifyContent */}
        {(layoutType === 'container' || layoutType === 'section') && (
          <>
            <Dropdown
              label="Flex Direction"
              selectedKey={flexDirection}
              options={[
                { key: 'row', text: 'Row' },
                { key: 'column', text: 'Column' },
              ]}
              onChange={(_, option) => {
                if (!option) return;
                setFlexDirection(option.key as 'row' | 'column');
              }}
            />

            <Dropdown
              label="Align Items"
              selectedKey={alignItems}
              options={alignItemsOptions}
              onChange={(_, option) => {
                if (!option) return;
                setAlignItems(
                  option.key as
                    | 'flex-start'
                    | 'flex-end'
                    | 'center'
                    | 'baseline'
                    | 'stretch'
                    | 'start'
                    | 'end'
                );
              }}
            />

            <Dropdown
              label="Justify Content"
              selectedKey={justifyContent}
              options={justifyContentOptions}
              onChange={(_, option) => {
                if (!option) return;
                setJustifyContent(
                  option.key as
                    | 'flex-start'
                    | 'flex-end'
                    | 'center'
                    | 'space-between'
                    | 'space-around'
                );
              }}
            />
          </>
        )}

        {/* Row => forced flex-direction: row, plus gap, flexWrap, alignItems, justifyContent */}
        {layoutType === 'row' && (
          <>
            <div className="slider-pair">
              <label>Gap: {gap}px</label>
              <Slider
                min={0}
                max={50}
                step={1}
                value={gap}
                showValue={false}
                onChange={(val) => setGap(val)}
              />
            </div>

            <Dropdown
              label="Flex Wrap"
              selectedKey={flexWrap}
              options={flexWrapOptions}
              onChange={(_, option) => {
                if (!option) return;
                setFlexWrap(option.key as 'nowrap' | 'wrap' | 'wrap-reverse');
              }}
            />

            <Dropdown
              label="Align Items"
              selectedKey={alignItems}
              options={alignItemsOptions}
              onChange={(_, option) => {
                if (!option) return;
                setAlignItems(
                  option.key as
                    | 'flex-start'
                    | 'flex-end'
                    | 'center'
                    | 'baseline'
                    | 'stretch'
                    | 'start'
                    | 'end'
                );
              }}
            />

            <Dropdown
              label="Justify Content"
              selectedKey={justifyContent}
              options={justifyContentOptions}
              onChange={(_, option) => {
                if (!option) return;
                setJustifyContent(
                  option.key as
                    | 'flex-start'
                    | 'flex-end'
                    | 'center'
                    | 'space-between'
                    | 'space-around'
                );
              }}
            />
          </>
        )}

        {/* Grid => columns, rows, rowGap, columnGap, justifyItems, alignGridItems */}
        {layoutType === 'grid' && (
          <>
            <div className="slider-pair">
              <label>Columns: {columns}</label>
              <Slider
                min={1}
                max={12}
                step={1}
                value={columns}
                showValue={false}
                onChange={(val) => setColumns(val)}
              />
            </div>

            <div className="slider-pair">
              <label>Rows: {rows}</label>
              <Slider
                min={1}
                max={12}
                step={1}
                value={rows}
                showValue={false}
                onChange={(val) => setRows(val)}
              />
            </div>

            <div className="slider-pair">
              <label>Row Gap: {rowGap}px</label>
              <Slider
                min={0}
                max={50}
                step={1}
                value={rowGap}
                showValue={false}
                onChange={(val) => setRowGap(val)}
              />
            </div>

            <div className="slider-pair">
              <label>Column Gap: {columnGap}px</label>
              <Slider
                min={0}
                max={50}
                step={1}
                value={columnGap}
                showValue={false}
                onChange={(val) => setColumnGap(val)}
              />
            </div>

            <Dropdown
              label="Justify Items"
              selectedKey={justifyItems}
              options={justifyItemsOptions}
              onChange={(_, option) => {
                if (!option) return;
                setJustifyItems(
                  option.key as 'start' | 'center' | 'end' | 'stretch'
                );
              }}
            />

            <Dropdown
              label="Align Grid Items"
              selectedKey={alignGridItems}
              options={alignGridItemsOptions}
              onChange={(_, option) => {
                if (!option) return;
                setAlignGridItems(
                  option.key as 'start' | 'center' | 'end' | 'stretch'
                );
              }}
            />
          </>
        )}
      </div>

      <div className="big-separator" />

      <Text
        variant="xLarge"
        styles={{
          root: {
            color: '#4b3f72',
            fontWeight: 700,
            marginBottom: 10,
          },
        }}
      >
        Layers
      </Text>
      <div className="layout-tab-section layers-section">
        <CustomLayers />
      </div>
    </Wrapper>
  );
};
