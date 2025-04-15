import React, { RefObject } from 'react';

interface ImageUploadSectionProps {
  uploadedImage: File | null;
  imagePreviewUrl: string | null;
  onUploadClick: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  truncateFileName: (name: string, maxLength: number) => string;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  uploadedImage,
  imagePreviewUrl,
  onUploadClick,
  onImageChange,
  removeImage,
  fileInputRef,
  truncateFileName,
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
        Image Upload
      </h4>
      <p style={{ margin: '6px 0', color: '#555', fontSize: '0.85rem' }}>
        Optionally include a reference image.
      </p>

      {uploadedImage ? (
        <div
          style={{
            position: 'relative',
            border: '1px solid #ccc',
            marginTop: '8px',
          }}
        >
          <img
            src={imagePreviewUrl || ''}
            alt="User upload"
            style={{
              width: '100%',
              display: 'block',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px 8px',
              backgroundColor: '#fafafa',
              borderTop: '1px solid #ccc',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#555' }}>
              Referencing{' '}
              <em style={{ fontStyle: 'italic', color: '#777' }}>
                {truncateFileName(uploadedImage.name, 20)}
              </em>
            </span>
            <button
              onClick={removeImage}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                color: '#d00',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          style={{
            width: '100%',
            border: '1px dashed #aaa',
            padding: '10px',
            cursor: 'pointer',
            marginTop: '8px',
            backgroundColor: '#fff',
          }}
          onClick={onUploadClick}
        >
          Upload an Image
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onImageChange}
      />
    </div>
  );
};
