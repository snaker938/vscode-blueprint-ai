import { CSSProperties, FC } from 'react';
import { useNode, Node } from '@craftjs/core';
import * as AiIcons from 'react-icons/ai'; // Example library
import { IconProperties } from './IconProperties';

/**
 * Props for the Icon component
 */
export interface IIconProps {
  /** The string name of the icon from the imported icon library */
  iconName?: string;
  /** The icon size (in px) */
  size?: number;
  /** The icon color (CSS color string) */
  color?: string;
  /** Optional margin [top, right, bottom, left] in px */
  margin?: [number, number, number, number];
  /** Optional padding [top, right, bottom, left] in px */
  padding?: [number, number, number, number];
}

/** Default props for the Icon component */
const defaultProps: Partial<IIconProps> = {
  iconName: 'AiFillSmile', // fallback icon if input is invalid
  size: 24,
  color: '#000000',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

/**
 * The Icon component, using react-icons (Ai set) as an example.
 */
export const Icon: FC<IIconProps> & { craft?: any } = (incomingProps) => {
  // Access node info from Craft
  const { connectors } = useNode(() => ({
    // Node data can be collected here if needed
  }));

  // Combine incoming props with defaults
  const props = { ...defaultProps, ...incomingProps } as IIconProps;

  const {
    iconName,
    size,
    color,
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
  } = props;

  // Attempt to retrieve the icon component by name, fallback to AiFillSmile
  const ChosenIcon = (AiIcons as any)[iconName!] || AiIcons['AiFillSmile'];

  // Compute container style
  const iconStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
    // add more styling as needed
  };

  return (
    <div ref={(ref) => ref && connectors.connect(ref)} style={iconStyle}>
      <ChosenIcon size={size} color={color} />
    </div>
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
    canDrag: (_node: Node) => {
      void _node;
      return true;
    },
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  // Reference to the separate properties editor file
  related: {
    settings: IconProperties,
  },
};
