import React from 'react';

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
}) => {
  if (!isLoading) return null;

  return (
    <>
      <style>
        {`
          @keyframes indeterminate-progress {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `}
      </style>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <p style={{ marginBottom: '16px', fontSize: '1.2rem', color: '#444' }}>
          Generating...
        </p>
        <div
          style={{
            position: 'relative',
            width: '50%',
            height: '10px',
            background: '#ccc',
            overflow: 'hidden',
            borderRadius: '5px',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '-100%',
              width: '100%',
              background: '#6942f5',
              animation: 'indeterminate-progress 1.5s infinite linear',
            }}
          />
        </div>
      </div>
    </>
  );
};
