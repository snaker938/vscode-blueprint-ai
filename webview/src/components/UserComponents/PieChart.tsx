import React from 'react';
import { useNode } from '@craftjs/core';

interface PieChartProps {
  title?: string;
  data?: number[];
}

export const PieChart: React.FC<PieChartProps> & { craft?: any } = ({
  title,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <h3>{title}</h3>
      <div
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background:
            'conic-gradient(#4CAF50 0% 25%, #FF5722 25% 50%, #FFC107 50% 75%, #2196F3 75% 100%)',
        }}
      />
    </div>
  );
};

PieChart.craft = {
  displayName: 'Pie Chart',
  props: {
    title: 'Sample Pie Chart',
  },
};
