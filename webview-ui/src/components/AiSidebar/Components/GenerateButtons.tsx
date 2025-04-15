import React from 'react';

interface GenerateButtonsProps {
  onGenerateClick: () => void;
  onClearAll: () => void;
}

export const GenerateButtons: React.FC<GenerateButtonsProps> = ({
  onGenerateClick,
  onClearAll,
}) => {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        gap: '8px',
      }}
    >
      <button
        onClick={onGenerateClick}
        style={{
          flex: 1,
          backgroundColor: '#6942f5',
          color: '#fff',
          border: 'none',
          padding: '10px 0',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '0.9rem',
        }}
      >
        Generate
      </button>
      <button
        onClick={onClearAll}
        style={{
          backgroundColor: '#bbb',
          color: '#fff',
          border: 'none',
          padding: '10px 16px',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '0.9rem',
        }}
      >
        Clear
      </button>
    </div>
  );
};
