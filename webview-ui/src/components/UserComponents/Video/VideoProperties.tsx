import React from 'react';
import { useNode } from '@craftjs/core';
import { Section } from '../../PropertiesSidebar/UI/Section';
import { Item } from '../../PropertiesSidebar/UI/Item';
import { TextInput } from '../../PropertiesSidebar/UI/TextInput';
import { SwitchInput } from '../../PropertiesSidebar/UI/SwitchInput';

export interface IVideoProps {
  videoId: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
  controls?: boolean;
  interactable?: boolean;
}

export const VideoProperties: React.FC = () => {
  const {
    videoId,
    width,
    height,
    autoplay,
    controls,
    interactable,
    actions: { setProp },
  } = useNode((node) => ({
    videoId: node.data.props.videoId,
    width: node.data.props.width,
    height: node.data.props.height,
    autoplay: node.data.props.autoplay,
    controls: node.data.props.controls,
    interactable: node.data.props.interactable,
  }));

  return (
    <>
      <Section title="Video" defaultExpanded={false}>
        <Item>
          <TextInput
            label="YouTube Video ID"
            value={videoId}
            onChangeValue={(newVal) =>
              setProp((props: IVideoProps) => {
                props.videoId = newVal;
              })
            }
          />
        </Item>
      </Section>
      <Section title="Size" defaultExpanded={false}>
        <Item>
          <TextInput
            label="Width"
            value={width || ''}
            onChangeValue={(newVal) =>
              setProp((props: IVideoProps) => {
                props.width = newVal;
              })
            }
            helperText='Examples: "400px", "100%", "auto"'
          />
        </Item>
        <Item>
          <TextInput
            label="Height"
            value={height || ''}
            onChangeValue={(newVal) =>
              setProp((props: IVideoProps) => {
                props.height = newVal;
              })
            }
            helperText='Examples: "225px", "auto"'
          />
        </Item>
      </Section>
      <Section title="Playback" defaultExpanded={false}>
        <Item>
          <SwitchInput
            label="Autoplay?"
            value={!!autoplay}
            onChangeValue={(checked) =>
              setProp((props: IVideoProps) => {
                props.autoplay = checked;
              })
            }
          />
        </Item>
        <Item>
          <SwitchInput
            label="Show Controls?"
            value={controls ?? true}
            onChangeValue={(checked) =>
              setProp((props: IVideoProps) => {
                props.controls = checked;
              })
            }
          />
        </Item>
      </Section>
      <Section title="Interactivity" defaultExpanded={false}>
        <Item>
          <SwitchInput
            label="Interactable?"
            value={interactable ?? false}
            onChangeValue={(checked) =>
              setProp((props: IVideoProps) => {
                props.interactable = checked;
              })
            }
          />
        </Item>
      </Section>
    </>
  );
};
