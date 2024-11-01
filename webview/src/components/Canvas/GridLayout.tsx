import React from 'react';
import GridLayout from 'react-grid-layout';

const GridEditor: React.FC = () => {
  const layout = [
    { i: '1', x: 0, y: 0, w: 4, h: 2 },
    // ...additional grid items...
  ];

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
    >
      <div key="1" style={{ background: '#ccc' }}>
        Grid Item 1
      </div>
      {/* ...additional grid items... */}
    </GridLayout>
  );
};

export default GridEditor;
