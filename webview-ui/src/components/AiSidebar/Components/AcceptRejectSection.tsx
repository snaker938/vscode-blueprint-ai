import React from 'react';

interface AcceptRejectSectionProps {
  onAccept: () => void;
  onReject: () => void;
}

export const AcceptRejectSection: React.FC<AcceptRejectSectionProps> = ({
  onAccept,
  onReject,
}) => {
  return (
    <div
      style={{
        padding: '16px',
        margin: '16px',
        border: '1px solid #ccc',
        background: '#f9f9f9',
        borderRadius: '4px',
      }}
    >
      <h3
        style={{
          marginTop: 0,
          fontSize: '1rem',
          fontWeight: 600,
          color: '#333',
        }}
      >
        Accept These Changes?
      </h3>
      <p
        style={{
          fontSize: '0.9rem',
          color: '#555',
          margin: '6px 0 12px',
        }}
      >
        We have generated new suggestions based on your prompt. Would you like
        to accept them?
      </p>
      <div>
        <button
          onClick={onAccept}
          style={{
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            marginRight: '6px',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          Accept
        </button>
        <button
          onClick={onReject}
          style={{
            backgroundColor: '#f44336',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '0.9rem',
          }}
        >
          Reject
        </button>
      </div>
    </div>
  );
};
