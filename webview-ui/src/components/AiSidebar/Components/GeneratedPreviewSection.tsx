import React from 'react';

interface GeneratedPreviewSectionProps {
  storePrompt: string;
  uploadedImage: File | null;
  imagePreviewUrl: string | null;
  message: string;
  onCloseGeneratedView: () => void;
}

export const GeneratedPreviewSection: React.FC<
  GeneratedPreviewSectionProps
> = ({
  storePrompt,
  uploadedImage,
  imagePreviewUrl,
  message,
  onCloseGeneratedView,
}) => {
  return (
    <div
      style={{
        padding: '16px',
        borderBottom: '1px solid #eee',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
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
          Generated Preview
        </h4>
        <button
          onClick={onCloseGeneratedView}
          style={{
            border: 'none',
            background: 'transparent',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>
      </div>
      <div
        style={{
          marginBottom: '16px',
          padding: '8px',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      >
        <h5 style={{ margin: '0 0 4px', fontWeight: 'bold' }}>Your Prompt:</h5>
        <p style={{ margin: 0, color: '#333' }}>{storePrompt}</p>
      </div>
      {uploadedImage && imagePreviewUrl && (
        <div
          style={{
            marginBottom: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            overflow: 'hidden',
          }}
        >
          <img
            src={imagePreviewUrl}
            alt="Uploaded"
            style={{
              width: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
          />
        </div>
      )}
      <div
        style={{
          padding: '8px',
          backgroundColor: '#e1f5fe',
          border: '1px solid #b3e5fc',
          borderRadius: '4px',
        }}
      >
        <p
          style={{
            margin: 0,
            color: '#0277bd',
            fontSize: '0.9rem',
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
};
