import React from 'react';

interface SelectedElementInfoProps {
  isSelected: boolean;
  selectedElementName?: string;
}

export const SelectedElementInfo: React.FC<SelectedElementInfoProps> = ({
  isSelected,
  selectedElementName,
}) => {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}
    >
      <h4
        style={{
          margin: 0,
          fontSize: '1rem',
          fontWeight: 600,
          color: '#444',
        }}
      >
        Selected Element
      </h4>
      {isSelected && selectedElementName ? (
        <p style={{ margin: '6px 0 0', color: '#333', fontSize: '0.9rem' }}>
          Currently referencing: <strong>{selectedElementName}</strong>
        </p>
      ) : (
        <p style={{ margin: '6px 0 0', color: '#999', fontSize: '0.9rem' }}>
          No element selected
        </p>
      )}
    </div>
  );
};
