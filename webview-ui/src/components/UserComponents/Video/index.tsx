import { useNode, useEditor } from '@craftjs/core';
import YouTube from 'react-youtube';
import { styled } from 'styled-components';

//
// Inline Settings Component
//
const VideoProperties = () => {
  // Access the props and setProp() function from the current node
  const {
    actions: { setProp },
    videoId,
  } = useNode((node) => ({
    videoId: node.data.props.videoId,
  }));

  return (
    <div style={{ padding: '10px' }}>
      <label
        htmlFor="videoId"
        style={{ display: 'block', marginBottom: '5px' }}
      >
        YouTube Video ID
      </label>
      <input
        id="videoId"
        type="text"
        value={videoId}
        style={{ width: '100%' }}
        onChange={(e) => {
          const value = e.target.value;
          // Update the prop via setProp
          setProp((props: any) => {
            props.videoId = value;
          });
        }}
      />
    </div>
  );
};

//
// Styled Container
//
const YoutubeDiv = styled.div<{ $enabled: boolean }>`
  width: 100%;
  height: 100%;

  > div {
    height: 100%;
  }

  iframe {
    pointer-events: ${(props) => (props.$enabled ? 'none' : 'auto')};
  }
`;

//
// Main Video Component
//
export const Video = (props: any) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const { videoId } = props;

  return (
    <YoutubeDiv
      ref={(dom) => {
        // Ensure `dom` is not null before connecting
        if (dom) {
          connect(dom);
        }
      }}
      $enabled={enabled}
    >
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
        }}
      />
    </YoutubeDiv>
  );
};

//
// Craft.js configuration
//
Video.craft = {
  displayName: 'Video',
  props: {
    videoId: 'IwzUs1IMdyQ', // default video
  },
  related: {
    // Link the inline settings component:
    toolbar: VideoProperties,
  },
};
