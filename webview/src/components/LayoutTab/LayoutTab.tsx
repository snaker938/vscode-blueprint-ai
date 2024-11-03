import React, { useState } from 'react';
import {
  TextField,
  Toggle,
  DefaultButton,
  Slider,
  Dropdown,
  IDropdownOption,
  Label,
} from '@fluentui/react';
import './LayoutTab.css';

const LayoutTab: React.FC = () => {
  const [rows, setRows] = useState<number>(1);
  const [columns, setColumns] = useState<number>(1);
  const [gridVisible, setGridVisible] = useState<boolean>(true);
  const [gapSize, setGapSize] = useState<number>(0);
  const [alignment, setAlignment] = useState<string>('start');
  const [padding, setPadding] = useState<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
  const [margin, setMargin] = useState<{
    top: number;
    right: number;
    bottom: number;
    left: number;
  }>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const alignmentOptions: IDropdownOption[] = [
    { key: 'start', text: 'Start' },
    { key: 'center', text: 'Center' },
    { key: 'end', text: 'End' },
    { key: 'stretch', text: 'Stretch' },
  ];

  const addGridCell = () => {
    // Implement logic to add a grid cell
  };

  const handleRowsChange = (value: string | undefined) => {
    const num = parseInt(value || '0', 10);
    if (!isNaN(num) && num >= 1) {
      setRows(num);
    }
  };

  const handleColumnsChange = (value: string | undefined) => {
    const num = parseInt(value || '0', 10);
    if (!isNaN(num) && num >= 1) {
      setColumns(num);
    }
  };

  const handlePaddingChange = (side: string, value: string | undefined) => {
    const num = parseInt(value || '0', 10);
    if (!isNaN(num)) {
      setPadding({ ...padding, [side]: num });
    }
  };

  const handleMarginChange = (side: string, value: string | undefined) => {
    const num = parseInt(value || '0', 10);
    if (!isNaN(num)) {
      setMargin({ ...margin, [side]: num });
    }
  };

  const resetLayout = () => {
    setRows(1);
    setColumns(1);
    setGridVisible(true);
    setGapSize(0);
    setAlignment('start');
    setPadding({ top: 0, right: 0, bottom: 0, left: 0 });
    setMargin({ top: 0, right: 0, bottom: 0, left: 0 });
  };

  return (
    <div className="layout-tab">
      <div className="section">
        <Label className="section-title">Grid Settings</Label>
        <div className="grid-settings">
          <TextField
            label="Rows"
            type="number"
            min={1}
            value={rows.toString()}
            onChange={(e, newValue) => handleRowsChange(newValue)}
          />
          <TextField
            label="Columns"
            type="number"
            min={1}
            value={columns.toString()}
            onChange={(e, newValue) => handleColumnsChange(newValue)}
          />
          <DefaultButton
            text="Add Grid Cell"
            onClick={addGridCell}
            className="add-grid-cell-button"
          />
          <Toggle
            label="Grid Visible"
            checked={gridVisible}
            onChange={(e, checked) => setGridVisible(!!checked)}
          />
        </div>
      </div>

      <div className="section">
        <Label className="section-title">Gap Size</Label>
        <Slider
          min={0}
          max={50}
          value={gapSize}
          onChange={(value) => setGapSize(value)}
          showValue
        />
      </div>

      <div className="section">
        <Label className="section-title">Alignment</Label>
        <Dropdown
          options={alignmentOptions}
          selectedKey={alignment}
          onChange={(e, option) => setAlignment(option?.key as string)}
        />
      </div>

      <div className="section">
        <Label className="section-title">Padding</Label>
        <div className="spacing-controls">
          <TextField
            label="Top"
            type="number"
            value={padding.top.toString()}
            onChange={(e, newValue) => handlePaddingChange('top', newValue)}
          />
          <TextField
            label="Right"
            type="number"
            value={padding.right.toString()}
            onChange={(e, newValue) => handlePaddingChange('right', newValue)}
          />
          <TextField
            label="Bottom"
            type="number"
            value={padding.bottom.toString()}
            onChange={(e, newValue) => handlePaddingChange('bottom', newValue)}
          />
          <TextField
            label="Left"
            type="number"
            value={padding.left.toString()}
            onChange={(e, newValue) => handlePaddingChange('left', newValue)}
          />
        </div>
      </div>

      <div className="section">
        <Label className="section-title">Margin</Label>
        <div className="spacing-controls">
          <TextField
            label="Top"
            type="number"
            value={margin.top.toString()}
            onChange={(e, newValue) => handleMarginChange('top', newValue)}
          />
          <TextField
            label="Right"
            type="number"
            value={margin.right.toString()}
            onChange={(e, newValue) => handleMarginChange('right', newValue)}
          />
          <TextField
            label="Bottom"
            type="number"
            value={margin.bottom.toString()}
            onChange={(e, newValue) => handleMarginChange('bottom', newValue)}
          />
          <TextField
            label="Left"
            type="number"
            value={margin.left.toString()}
            onChange={(e, newValue) => handleMarginChange('left', newValue)}
          />
        </div>
      </div>

      <DefaultButton
        text="Reset Layout"
        onClick={resetLayout}
        className="reset-layout-button"
      />
    </div>
  );
};

export default LayoutTab;
