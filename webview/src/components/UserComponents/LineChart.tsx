import React from 'react';
import { useNode } from '@craftjs/core';

interface LineChartProps {
  title?: string;
  data?: number[];
}

export const LineChart: React.FC<LineChartProps> & { craft?: any } = ({
  title,
  data,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{ padding: '10px', textAlign: 'center' }}
    >
      <h3>{title}</h3>
      <svg width="200" height="100" style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke="#4CAF50"
          strokeWidth="2"
          points={
            data?.map((val, i) => `${i * 40},${100 - val}`).join(' ') || ''
          }
        />
      </svg>
    </div>
  );
};

LineChart.craft = {
  displayName: 'Line Chart',
  props: {
    title: 'Sample Line Chart',
    data: [10, 30, 70, 50, 90],
  },
};
