import { CSSProperties, FC } from 'react';
import { useNode } from '@craftjs/core';
import * as AiIcons from 'react-icons/ai';
import { IconProperties } from './IconProperties';
import { Resizer } from '../Utils/Resizer';

/**
 * Props for the Icon component
 */
export interface IIconProps {
  /** The string name of the icon from the imported icon library */
  iconName?: string;
  /** The icon color (CSS color string) */
  color?: string;
  /** Optional margin [top, right, bottom, left] in px */
  margin?: [number, number, number, number];
  /** Optional padding [top, right, bottom, left] in px */
  padding?: [number, number, number, number];
  /** Container width (for resizing) */
  width?: number;
  /** Container height (for resizing) */
  height?: number;
}

/** Default props for the Icon component */
const defaultProps: Partial<IIconProps> = {
  iconName: 'AiFillSmile', // fallback icon if input is invalid
  color: '#000000',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
  width: 50,
  height: 50,
};

/**
 * The Icon component, using react-icons (Ai set) as an example.
 */
export const Icon: FC<IIconProps> & { craft?: any } = (incomingProps) => {
  const {
    connectors: { connect },
  } = useNode(() => ({}));

  // Combine incoming props with defaults
  const props = { ...defaultProps, ...incomingProps } as IIconProps;
  const {
    iconName,
    color,
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
    width,
    height,
  } = props;

  // Attempt to retrieve the icon component by name, fallback to AiFillSmile
  const ChosenIcon = (AiIcons as any)[iconName!] || AiIcons['AiFillSmile'];

  // Compute container style
  const containerStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
    width,
    height,
  };

  return (
    <Resizer
      // Connect this DOM node to Craft for selection/resizing
      ref={(ref) => {
        if (ref) connect(ref);
      }}
      // Map width & height to Resizer so Craft can store changes
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
    >
      {/* Icon fills the container by using 100% width/height */}
      <ChosenIcon style={{ width: '100%', height: '100%' }} color={color} />
    </Resizer>
  );
};

/**
 * Craft configuration for the Icon component
 */
Icon.craft = {
  displayName: 'Icon',
  // Set initial default props
  props: defaultProps,
  // This component isn't a canvas, so it won't hold child components
  isCanvas: false,
  // Basic rules for drag/move/delete/select
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  // Reference to the separate properties editor file
  related: {
    settings: IconProperties,
  },
};
