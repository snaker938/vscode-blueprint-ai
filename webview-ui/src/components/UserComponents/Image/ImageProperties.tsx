import React, { useState, useRef } from 'react';
import { useNode } from '@craftjs/core';
import { Grid } from '@mui/material';

import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { Slider } from '../../PropertiesSidebar/UI/Slider';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';

/**
 * The interface for Image component props
 */
export interface ImagePropertiesProps {
  /**
   * The image source (base64, URL, etc.).
   */
  src?: string;
  /**
   * The alternative text displayed if the image cannot be shown.
   */
  alt?: string;
  /**
   * CSS width (e.g., "100px" or "auto").
   */
  width?: string;
  /**
   * CSS height (e.g., "100px" or "auto").
   */
  height?: string;
  /**
   * Margin as [top, right, bottom, left].
   */
  margin?: [number, number, number, number];
  /**
   * Padding as [top, right, bottom, left].
   */
  padding?: [number, number, number, number];
  /**
   * The amount of box-shadow blur (0 = no shadow).
   */
  shadow?: number;
  /**
   * The border-radius in pixels.
   */
  borderRadius?: number;
  /**
   * CSS shorthand for border (e.g., "1px solid #000").
   */
  border?: string;
  /**
   * Optional React children.
   */
  children?: React.ReactNode;
}

/**
 * A small helper to enforce exactly four numeric values (top, right, bottom, left).
 * If arr has fewer than 4 items, missing ones become 0.
 * If arr has more than 4 items, the extras are ignored.
 */
function ensure4Values(arr: number[]): [number, number, number, number] {
  const [top, right, bottom, left] = arr;
  return [top ?? 0, right ?? 0, bottom ?? 0, left ?? 0];
}

/**
 * A small helper to display margin/padding controls with a Slider + TextInput for each side.
 * NOTE: We’ve removed the <Section> from inside this function to avoid nested sections.
 */
function SpacingControl({
  label,
  values,
  onChangeValues,
  max = 100,
}: {
  label: string;
  values?: number[];
  onChangeValues: (newValues: number[]) => void;
  max?: number;
}) {
  // Fallback to [0,0,0,0] if values is undefined
  const safeValues = values ?? [0, 0, 0, 0];

  return (
    <Grid container spacing={2}>
      {['Top', 'Right', 'Bottom', 'Left'].map((pos, idx) => (
        <Grid item xs={6} key={pos}>
          <Slider
            label={`${label} ${pos}`}
            value={safeValues[idx]}
            min={0}
            max={max}
            onChangeValue={(val) => {
              const newVals = [...safeValues];
              newVals[idx] = val;
              onChangeValues(newVals);
            }}
            showValueInput={false}
          />
          <TextInput
            label={pos}
            type="number"
            value={safeValues[idx].toString()}
            onChangeValue={(val) => {
              const num = parseInt(val, 10) || 0;
              const newVals = [...safeValues];
              newVals[idx] = num;
              onChangeValues(newVals);
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

/**
 * Properties panel for the CraftJS Image component.
 */
export const ImageProperties: React.FC<ImagePropertiesProps> = () => {
  const {
    src,
    alt,
    width,
    height,
    margin,
    padding,
    shadow,
    borderRadius,
    border,
    actions: { setProp },
  } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    margin: node.data.props.margin,
    padding: node.data.props.padding,
    shadow: node.data.props.shadow,
    borderRadius: node.data.props.borderRadius,
    border: node.data.props.border,
  }));

  const [error, setError] = useState<string | null>(null);
  const [tempUrl, setTempUrl] = useState<string>(''); // holds the URL input value
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For easy referencing in the UI
  const currentSrc = src || '';

  /**
   * Handle file selection from local disk
   */
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 5MB limit. Please choose a smaller image.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // File is valid – read it as Base64 data URL
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target?.result as string;
      setProp((props: ImagePropertiesProps) => {
        props.src = dataUrl;
      }, 500);
      setTempUrl(''); // clear any previously entered URL
    };
    reader.onerror = () => {
      console.error('Error reading file as data URL');
      setError(
        'Failed to read file. Please try again or use a different image.'
      );
    };
    reader.readAsDataURL(file); // start reading the file (async)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // reset input
    }
  };

  /**
   * Handle manual URL input change
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempUrl(e.target.value);
  };

  /**
   * Apply the entered URL as the image source
   */
  const handleApplyUrl = () => {
    const url = tempUrl.trim();
    if (!url) {
      setError('Please enter an image URL.');
      return;
    }
    // Basic validation: must start with http(s) and end with an image extension
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
    setProp((props: ImagePropertiesProps) => {
      props.src = url;
    });
    // We keep tempUrl so the user sees it in the input
  };

  /**
   * Handle the AI Image button click (stub for now)
   */
  const handleUseAIImage = () => {
    console.log('Use AI Image (DALL·E) button clicked');
    // Future: Integrate with AI image generation (e.g., DALL·E API).
  };

  return (
    <div className="image-properties-panel">
      {/* IMAGE UPLOAD / PREVIEW SECTION */}
      {currentSrc ? (
        <div className="image-preview-section">
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
          <div>
            <button type="button" onClick={() => fileInputRef.current?.click()}>
              Replace Image
            </button>
            <button
              type="button"
              onClick={() => {
                // Clear the image
                setProp((props: ImagePropertiesProps) => {
                  props.src = '';
                });
                setError(null);
                setTempUrl('');
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
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

      {/* BELOW: SECTIONS FOR OTHER IMAGE PROPS */}

      <Section title="Basic Properties" defaultExpanded>
        {/* Alt Text */}
        <Item>
          <TextInput
            label="Alt Text"
            value={alt || ''}
            onChangeValue={(newVal) =>
              setProp((props: ImagePropertiesProps) => {
                props.alt = newVal;
              })
            }
          />
        </Item>

        {/* Width / Height */}
        <Item>
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(val) =>
              setProp((props: ImagePropertiesProps) => {
                props.width = val;
              })
            }
            helperText='e.g. "100px", "50%", or "auto"'
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height || ''}
            onChangeValue={(val) =>
              setProp((props: ImagePropertiesProps) => {
                props.height = val;
              })
            }
            helperText='e.g. "100px", "auto"'
          />
        </Item>
      </Section>

      <Section title="Spacing" defaultExpanded={false}>
        <Item>
          <SpacingControl
            label="Margin"
            values={margin}
            onChangeValues={(vals) =>
              setProp((props: ImagePropertiesProps) => {
                // Ensure exactly 4 values
                props.margin = ensure4Values(vals);
              })
            }
          />
        </Item>
        <Item>
          <SpacingControl
            label="Padding"
            values={padding}
            onChangeValues={(vals) =>
              setProp((props: ImagePropertiesProps) => {
                // Ensure exactly 4 values
                props.padding = ensure4Values(vals);
              })
            }
          />
        </Item>
      </Section>

      <Section title="Styling" defaultExpanded={false}>
        {/* Shadow */}
        <Item>
          <Slider
            label="Shadow"
            value={shadow ?? 0}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: ImagePropertiesProps) => {
                props.shadow = val;
              })
            }
          />
        </Item>

        {/* Border Radius */}
        <Item>
          <Slider
            label="Border Radius"
            value={borderRadius ?? 0}
            min={0}
            max={100}
            onChangeValue={(val) =>
              setProp((props: ImagePropertiesProps) => {
                props.borderRadius = val;
              })
            }
          />
        </Item>

        {/* Border */}
        <Item>
          <TextInput
            label="Border"
            value={border || ''}
            onChangeValue={(val) =>
              setProp((props: ImagePropertiesProps) => {
                props.border = val;
              })
            }
            helperText='e.g. "1px solid #000"'
          />
        </Item>
      </Section>
    </div>
  );
};
