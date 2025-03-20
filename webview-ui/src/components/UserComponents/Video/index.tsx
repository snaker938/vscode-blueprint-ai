import { CSSProperties, FC } from 'react';
import { useNode, Node } from '@craftjs/core';
import ReactPlayer from 'react-player';
import { Resizer } from '../Utils/Resizer';
import { VideoProperties } from './VideoProperties';

export interface IVideoProps {
  videoId?: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
  /** When true, allows the video to be interacted with while editing */
  interactable?: boolean;
}

const defaultProps: Partial<IVideoProps> = {
  videoId: '91_ZULhScRc',
  width: '400px',
  height: '225px',
  autoplay: false,
  controls: true,
  interactable: false,
};

export const Video: FC<IVideoProps> & { craft?: any } = (incomingProps) => {
  const props = { ...defaultProps, ...incomingProps };
  const { videoId, width, height, autoplay, controls, interactable } = props;

  const {
    connectors: { connect },
    actions: { setProp },
  } = useNode((node: Node) => ({
    id: node.id,
  }));

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: width ?? 'auto',
    height: height ?? 'auto',
  };

  const overlayStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    background: 'transparent',
    pointerEvents: interactable ? 'none' : 'auto',
  };

  const handleToggleClick = () => {
    setProp((props: IVideoProps) => {
      props.interactable = false;
    });
  };

  return (
    <div>
      {interactable && (
        <div style={{ marginBottom: '8px' }}>
          <button
            onClick={handleToggleClick}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            Disable Interactivity
          </button>
        </div>
      )}
      <Resizer
        ref={(ref) => ref && connect(ref)}
        propKey={{ width: 'width', height: 'height' }}
        style={containerStyle}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${videoId}`}
            playing={autoplay}
            controls={controls}
            width="100%"
            height="100%"
          />
          <div style={overlayStyle} />
        </div>
      </Resizer>
    </div>
  );
};

Video.craft = {
  displayName: 'Video',
  props: defaultProps,
  isCanvas: false,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  related: {
    settings: VideoProperties,
  },
};
