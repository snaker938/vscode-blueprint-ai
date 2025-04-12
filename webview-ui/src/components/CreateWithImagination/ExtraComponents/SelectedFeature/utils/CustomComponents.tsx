// CustomComponents.tsx
import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { styled } from 'styled-components';

/**
 * A constant holding the Base64-encoded placeholder image.
 * Replace this string with your own Base64 image if desired.
 */
const PLACEHOLDER_BASE64 =
  'data:image/png;base64,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';

interface ImageWrapperProps {
  alt: string;
  containerStyle?: React.CSSProperties;
  objectFit?: React.CSSProperties['objectFit'];
}

export const ImageWrapper: React.FC<ImageWrapperProps> = ({
  alt,
  containerStyle,
  objectFit = 'cover',
}) => {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      <img
        src={PLACEHOLDER_BASE64}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#fff',
          fontSize: '0.8rem',
          padding: '4px 8px',
          borderTopRightRadius: '6px',
          maxWidth: '90%',
          wordBreak: 'break-word',
        }}
      >
        AI PROMPT: {alt}
      </div>
    </div>
  );
};

// Styled container for the YouTube player
const YoutubeDiv = styled.div`
  width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }

  iframe {
    pointer-events: auto;
  }
`;

interface VideoWrapperProps {
  videoId: string;
  style?: React.CSSProperties;
}

export const VideoWrapper: React.FC<VideoWrapperProps> = ({
  videoId,
  style = {},
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if YouTube API is available
  useEffect(() => {
    // Set a timeout to check if the YouTube component loads properly
    const timer = setTimeout(() => {
      if (!isLoaded) {
        console.warn('YouTube component did not load within expected time');
        if (!error) {
          setError(
            'YouTube player failed to initialize. This may be due to network issues or security restrictions.'
          );
        }
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoaded, error]);

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      origin: window.location.origin,
      enablejsapi: 1,
      rel: 0,
      modestbranding: 1,
      disablekb: 1,
      fs: 0,
      playsinline: 1,
    },
  };

  const onError = (playerError: any) => {
    console.error('YouTube Player Error:', playerError);
    let errorMessage =
      'Video playback not allowed. This may be due to security restrictions in the environment.';
    if (playerError && playerError.data) {
      errorMessage += ` Error code: ${playerError.data}`;
    }
    setError(errorMessage);
  };

  const onReady = (event: any) => {
    setIsLoaded(true);
    // Attempt to play the video
    setTimeout(() => {
      try {
        event.target.playVideo();
      } catch (e) {
        console.error('Failed to auto-play video after delay:', e);
      }
    }, 1000);
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {error ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            color: '#666',
            padding: '20px',
            textAlign: 'center',
          }}
        >
          <div>{error}</div>
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#0078d4',
              textDecoration: 'underline',
              marginTop: '10px',
            }}
          >
            Open in YouTube
          </a>
        </div>
      ) : (
        <YoutubeDiv>
          {(() => {
            try {
              return (
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  onError={onError}
                  onReady={onReady}
                />
              );
            } catch (e) {
              console.error('Error rendering YouTube component:', e);
              return (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f5f5f5',
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div>Failed to load YouTube player</div>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0078d4',
                      textDecoration: 'underline',
                      marginTop: '10px',
                    }}
                  >
                    Open in YouTube
                  </a>
                </div>
              );
            }
          })()}
        </YoutubeDiv>
      )}
    </div>
  );
};
