import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import './LayoutTab.css';
import { CustomLayers } from './LayersComponent/CustomLayers';
import { useEditor } from '@craftjs/core';

import { Toggle, Dropdown, TextField, Slider, Text } from '@fluentui/react';

const Wrapper = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  padding: 15px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const alignmentOptions = [
  { key: 'start', text: 'Start' },
  { key: 'center', text: 'Center' },
  { key: 'end', text: 'End' },
];

const LayoutTab: React.FC = () => {
  // Hook into the Craft editor to access actions and query
  const { actions, query } = useEditor();

  // Grab any initial Root node props if they've been set;
  // fallback to some defaults if undefined:
  const rootNode = query.node('ROOT').get();
  const initialProps = rootNode.data.props || {};

  // State for all layout-related props that we want to sync with the root node
  const [rows, setRows] = useState(String(initialProps.rows ?? '1'));
  const [columns, setColumns] = useState(String(initialProps.columns ?? '1'));
  const [alignment, setAlignment] = useState(initialProps.alignment ?? 'start');
  const [gapSize, setGapSize] = useState(initialProps.gapSize ?? 3);

  const [paddingTop, setPaddingTop] = useState(
    String(initialProps.paddingTop ?? '1')
  );
  const [paddingRight, setPaddingRight] = useState(
    String(initialProps.paddingRight ?? '1')
  );
  const [paddingBottom, setPaddingBottom] = useState(
    String(initialProps.paddingBottom ?? '1')
  );
  const [paddingLeft, setPaddingLeft] = useState(
    String(initialProps.paddingLeft ?? '1')
  );

  const [marginTop, setMarginTop] = useState(
    String(initialProps.marginTop ?? '1')
  );
  const [marginRight, setMarginRight] = useState(
    String(initialProps.marginRight ?? '1')
  );
  const [marginBottom, setMarginBottom] = useState(
    String(initialProps.marginBottom ?? '1')
  );
  const [marginLeft, setMarginLeft] = useState(
    String(initialProps.marginLeft ?? '1')
  );

  // "Grid Visible" is local-only (not sent to the Root node)
  const [gridVisible, setGridVisible] = useState(true);

  /**
   * Whenever any of our layout states change, we update the Root node props.
   * This ensures that the Root node (and thus the rendered grid) reflects our inputs.
   */
  useEffect(() => {
    actions.setProp('ROOT', (props: any) => {
      props.rows = rows;
      props.columns = columns;
      props.alignment = alignment;
      props.gapSize = gapSize;

      props.paddingTop = paddingTop;
      props.paddingRight = paddingRight;
      props.paddingBottom = paddingBottom;
      props.paddingLeft = paddingLeft;

      props.marginTop = marginTop;
      props.marginRight = marginRight;
      props.marginBottom = marginBottom;
      props.marginLeft = marginLeft;
    });
  }, [
    actions,
    rows,
    columns,
    alignment,
    gapSize,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
  ]);

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

      <div className="layout-tab-section layout-tab-top-section">
        <div className="layout-grid-row">
          <div className="grid-input-pair">
            <label>Rows</label>
            <TextField
              value={rows}
              onChange={(_, v) => setRows(v ?? '')}
              type="number"
            />
          </div>
          <div className="grid-input-pair">
            <label>Columns</label>
            <TextField
              value={columns}
              onChange={(_, v) => setColumns(v ?? '')}
              type="number"
            />
          </div>
        </div>

        <div className="layout-alignment-row">
          <Dropdown
            label="Alignment"
            selectedKey={alignment}
            options={alignmentOptions}
            onChange={(_, option) => {
              if (option) setAlignment(option.key as string);
            }}
          />
          <div className="grid-toggle">
            <label className="toggle-label">Grid Visible</label>
            <Toggle
              checked={gridVisible}
              onChange={(_, checked) => setGridVisible(!!checked)}
            />
          </div>
        </div>

        <div
          className="layout-gap-row"
          style={{ display: 'flex', alignItems: 'center', width: '100%' }}
        >
          <label
            className="gap-label"
            style={{ whiteSpace: 'nowrap', marginRight: 10 }}
          >
            Gap Size
          </label>
          <Slider
            min={0}
            max={10}
            step={1}
            value={gapSize}
            showValue
            onChange={(val) => setGapSize(val)}
            styles={{ root: { flexGrow: 1 } }}
          />
        </div>
      </div>

      <div className="layout-tab-section padding-section">
        <h3>Padding</h3>
        <div className="padding-row">
          <div className="input-small">
            <label>Top</label>
            <TextField
              value={paddingTop}
              onChange={(_, v) => setPaddingTop(v ?? '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Right</label>
            <TextField
              value={paddingRight}
              onChange={(_, v) => setPaddingRight(v ?? '')}
              type="number"
            />
          </div>
        </div>
        <div className="padding-row">
          <div className="input-small">
            <label>Bottom</label>
            <TextField
              value={paddingBottom}
              onChange={(_, v) => setPaddingBottom(v ?? '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Left</label>
            <TextField
              value={paddingLeft}
              onChange={(_, v) => setPaddingLeft(v ?? '')}
              type="number"
            />
          </div>
        </div>
      </div>

      <div className="layout-tab-section margin-section">
        <h3>Margin</h3>
        <div className="padding-row">
          <div className="input-small">
            <label>Top</label>
            <TextField
              value={marginTop}
              onChange={(_, v) => setMarginTop(v ?? '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Right</label>
            <TextField
              value={marginRight}
              onChange={(_, v) => setMarginRight(v ?? '')}
              type="number"
            />
          </div>
        </div>
        <div className="padding-row">
          <div className="input-small">
            <label>Bottom</label>
            <TextField
              value={marginBottom}
              onChange={(_, v) => setMarginBottom(v ?? '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Left</label>
            <TextField
              value={marginLeft}
              onChange={(_, v) => setMarginLeft(v ?? '')}
              type="number"
            />
          </div>
        </div>
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

export default LayoutTab;
