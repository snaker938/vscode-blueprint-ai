import React from 'react';
import UndoButton from './UndoButton';
import RedoButton from './RedoButton';
import SaveButton from './SaveButton';
import ExportButton from './ExportButton';
import './Toolbar.css'; // Optional: styles for the toolbar

const Toolbar: React.FC = () => {
  return (
    <div className="toolbar">
      <UndoButton />
      <RedoButton />
      <SaveButton />
      <ExportButton />
    </div>
  );
};

export default Toolbar;
