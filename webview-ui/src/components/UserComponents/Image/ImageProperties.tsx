import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

// The properties panel component for the CraftJS Image component
export const ImageProperties: React.FC = () => {
  // Access the current src prop and setProp action from CraftJS
  const {
    actions: { setProp },
    props: nodeProps,
  } = useNode((node) => ({
    props: node.data.props,
  }));
  const currentSrc = (nodeProps.src as string) || '';

  const [error, setError] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState<string>(''); // holds the URL input value
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection from local disk
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null); // reset previous errors

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(
        'Unsupported file type. Please upload a JPEG, PNG, GIF, or WebP image.'
      );
      // Clear the file input so the user can re-select if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit. Please choose a smaller image.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // File is valid – proceed to read it as Base64 data URL
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      // Update the CraftJS node's src property with the base64 data URL
      setProp(
        (props: any) => {
          props.src = dataUrl;
        }, // update function
        500
      ); // throttle to avoid rapid state updates if needed
      // Clear any previously entered URL, since we're now using an uploaded image
      setTempUrl('');
    };
    reader.onerror = () => {
      console.error('Error reading file as data URL');
      setError(
        'Failed to read file. Please try again or use a different image.'
      );
    };
    reader.readAsDataURL(file); // start reading the file (async)&#8203;:contentReference[oaicite:9]{index=9}
    if (fileInputRef.current) fileInputRef.current.value = ''; // reset input
  };

  // Handle manual URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUrl(e.target.value);
  };

  // Apply the entered URL as the image source
  const handleApplyUrl = () => {
    const url = tempUrl.trim();
    if (!url) {
      setError('Please enter an image URL.');
      return;
    }
    // Basic URL format validation (must start with http and end with an image extension)
    const isImageUrl = /^https?:\/\/.+\.(png|jpe?g|gif|webp)(\?.*)?$/i.test(
      url
    );
    if (!isImageUrl) {
      setError(
        'Invalid URL or file type. URL should end in .png, .jpg, .gif, or .webp.'
      );
      return;
    }
    setError(null);
    // Update the CraftJS node's src to the external URL
    setProp((props: any) => {
      props.src = url;
    });
    // (We do not reset tempUrl here, so it remains in the input field)
  };

  // Handle the AI Image button click (stub for now)
  const handleUseAIImage = () => {
    console.log('Use AI Image (DALL·E) button clicked');
    // Future implementation: integrate with AI image generation (e.g., fetch from DALL·E API)
  };

  return (
    <div className="image-properties-panel">
      {/* Image Preview and Actions */}
      {currentSrc ? (
        <div className="image-preview-section">
          {/* Show a small preview of the current image */}
          <img
            src={currentSrc}
            alt="Selected"
            style={{
              maxWidth: '100%',
              maxHeight: '150px',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          />
          {/* Replace and Remove buttons */}
          <div>
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              Replace Image
            </button>
            <button
              type="button"
              onClick={() => {
                // Clear the image
                setProp((props: any) => {
                  props.src = '';
                });
                setError(null);
                setTempUrl(''); // optional: clear URL field as well
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            >
              Remove Image
            </button>
          </div>
        </div>
      ) : (
        <div className="no-image-section" style={{ marginBottom: '0.5rem' }}>
          <p>No image selected.</p>
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            Upload Image
          </button>
          <button type="button" onClick={handleUseAIImage}>
            Use AI Image (DALL·E)
          </button>
        </div>
      )}

      {/* Hidden file input for uploads */}
      <input
        type="file"
        accept="image/png, image/jpeg, image/gif, image/webp"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* URL input section */}
      <div className="image-url-section" style={{ marginTop: '0.5rem' }}>
        <input
          type="text"
          placeholder="Enter image URL"
          value={tempUrl}
          onChange={handleUrlChange}
          style={{ width: '70%' }}
        />
        <button
          type="button"
          onClick={handleApplyUrl}
          style={{ marginLeft: '0.5rem' }}
        >
          Use URL
        </button>
      </div>

      {/* Error message display */}
      {error && (
        <p
          className="image-error"
          style={{ color: 'red', marginTop: '0.5rem' }}
        >
          {error}
        </p>
      )}
    </div>
  );
};
