import React from 'react';

interface HeaderSectionProps {
  onClose?: () => void;
}

export const HeaderSection: React.FC<HeaderSectionProps> = ({ onClose }) => {
  return (
    <div
      style={{
        position: 'relative',
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}
    >
      <h2
        style={{
          margin: 0,
          fontWeight: 600,
          fontSize: '1.3rem',
          color: '#333',
        }}
      >
        Blueprint AI
      </h2>
      <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#555' }}>
        Generate new designs or refine existing ones.
      </p>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: 'transparent',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      )}
    </div>
  );
};
