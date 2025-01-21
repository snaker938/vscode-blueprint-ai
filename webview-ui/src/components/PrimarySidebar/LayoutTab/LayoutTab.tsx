import React, { useState } from 'react';
import styled from 'styled-components';
import './LayoutTab.css';
import { Layers } from '@craftjs/layers';
import {
  Toggle,
  Dropdown,
  TextField,
  Slider,
  PrimaryButton,
  Text,
} from '@fluentui/react';

const Wrapper = styled.div`
  width: 300px;
  background-color: #f9f9f9;
  // border-right: 1px solid #e1e1e1;
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
  const [rows, setRows] = useState('1');
  const [columns, setColumns] = useState('1');
  const [alignment, setAlignment] = useState('start');
  const [gridVisible, setGridVisible] = useState(true);
  const [gapSize, setGapSize] = useState(3);

  const [paddingTop, setPaddingTop] = useState('1');
  const [paddingRight, setPaddingRight] = useState('1');
  const [paddingBottom, setPaddingBottom] = useState('1');
  const [paddingLeft, setPaddingLeft] = useState('1');

  const [marginTop, setMarginTop] = useState('1');
  const [marginRight, setMarginRight] = useState('1');
  const [marginBottom, setMarginBottom] = useState('1');
  const [marginLeft, setMarginLeft] = useState('1');

  const handleAddGridCell = () => {
    alert('Add Grid Cell clicked!');
  };

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
              onChange={(_, v) => setRows(v || '')}
              type="number"
            />
          </div>
          <div className="grid-input-pair">
            <label>Columns</label>
            <TextField
              value={columns}
              onChange={(_, v) => setColumns(v || '')}
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

        <div className="layout-gap-row">
          <label className="gap-label">Gap Size</label>
          <Slider
            min={0}
            max={10}
            step={1}
            value={gapSize}
            showValue
            onChange={(val) => setGapSize(val)}
          />
        </div>

        <PrimaryButton
          text="Add Grid Cell"
          className="add-grid-cell-btn"
          onClick={handleAddGridCell}
        />
      </div>

      <div className="layout-tab-section padding-section">
        <h3>Padding</h3>
        <div className="padding-row">
          <div className="input-small">
            <label>Top</label>
            <TextField
              value={paddingTop}
              onChange={(_, v) => setPaddingTop(v || '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Right</label>
            <TextField
              value={paddingRight}
              onChange={(_, v) => setPaddingRight(v || '')}
              type="number"
            />
          </div>
        </div>
        <div className="padding-row">
          <div className="input-small">
            <label>Bottom</label>
            <TextField
              value={paddingBottom}
              onChange={(_, v) => setPaddingBottom(v || '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Left</label>
            <TextField
              value={paddingLeft}
              onChange={(_, v) => setPaddingLeft(v || '')}
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
              onChange={(_, v) => setMarginTop(v || '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Right</label>
            <TextField
              value={marginRight}
              onChange={(_, v) => setMarginRight(v || '')}
              type="number"
            />
          </div>
        </div>
        <div className="padding-row">
          <div className="input-small">
            <label>Bottom</label>
            <TextField
              value={marginBottom}
              onChange={(_, v) => setMarginBottom(v || '')}
              type="number"
            />
          </div>
          <div className="input-small">
            <label>Left</label>
            <TextField
              value={marginLeft}
              onChange={(_, v) => setMarginLeft(v || '')}
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
        <Layers expandRootOnLoad={true} />
      </div>
    </Wrapper>
  );
};

export default LayoutTab;
