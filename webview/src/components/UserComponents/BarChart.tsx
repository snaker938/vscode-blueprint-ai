import React from 'react';
import { useNode } from '@craftjs/core';

interface BarChartProps {
  title?: string;
  data?: number[];
}

export const BarChart: React.FC<BarChartProps> & { craft?: any } = ({
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
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
        {data?.map((value, index) => (
          <div
            key={index}
            style={{
              width: '20px',
              height: `${value}px`,
              backgroundColor: '#4CAF50',
            }}
          />
        ))}
      </div>
    </div>
  );
};

BarChart.craft = {
  displayName: 'Bar Chart',
  props: {
    title: 'Sample Bar Chart',
    data: [40, 60, 80, 20, 100],
  },
};
