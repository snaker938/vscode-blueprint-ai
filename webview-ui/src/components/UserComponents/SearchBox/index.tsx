/**
 * SearchBox/index.tsx
 *

 */

import {
  CSSProperties,
  FC,
  MouseEvent,
  useState,
  ChangeEvent,
  useEffect,
} from 'react';
import { Node, useNode } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';
import { SearchBoxProperties } from './SearchBoxProperties';

/**
 * Properties for the SearchBox component.
 * (A matching interface/props definition will be placed in SearchBoxProperties.tsx.)
 */
export interface ISearchBoxProps {
  /** The placeholder text for the search input */
  placeholder?: string;

  /** The current search text value */
  searchText?: string;

  /** Background color of the search box container */
  backgroundColor?: string;

  /** Text color for the input text */
  textColor?: string;

  /** Border color for the outer container/input */
  borderColor?: string;

  /** Width of the border in pixels */
  borderWidth?: number;

  /** Border style (e.g. 'solid', 'dashed', etc.) */
  borderStyle?: string;

  /** Border radius (in pixels) for rounded corners */
  borderRadius?: number;

  /** Horizontal + Vertical padding [top, right, bottom, left] (in pixels) */
  padding?: [number, number, number, number];

  /** Horizontal + Vertical margin [top, right, bottom, left] (in pixels) */
  margin?: [number, number, number, number];

  /** Box shadow level (0 for none) */
  shadow?: number;

  /** Width of the entire search box container (e.g. '100%', '300px', etc.) */
  width?: string;

  /** Height of the entire search box container (e.g. '50px', 'auto', etc.) */
  height?: string;
}

/**
 * Default property values for the SearchBox component.
 */
const defaultProps: Partial<ISearchBoxProps> = {
  placeholder: 'Search...',
  searchText: '',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  borderColor: '#cccccc',
  borderWidth: 1,
  borderStyle: 'solid',
  borderRadius: 4,
  padding: [4, 8, 4, 8],
  margin: [0, 0, 0, 0],
  shadow: 0,
  width: '200px',
  height: 'auto',
};

/**
 * We'll define a "craft" property interface for the SearchBox
 * so we can attach Craft.js configuration (similar to how Container does).
 */
interface ISearchBoxCraft {
  displayName: string;
  props: Partial<ISearchBoxProps>;
  rules: {
    canDrag: (node: Node) => boolean;
    canMove: (node: Node) => boolean;
    canDelete: (node: Node) => boolean;
    canSelect: (node: Node) => boolean;
  };
  related?: {
    settings: typeof SearchBoxProperties;
  };
}

/**
 * The specialized SearchBox component extends React.FC with an attached "craft" property.
 */
interface ISearchBox extends FC<ISearchBoxProps> {
  craft: ISearchBoxCraft;
}

/**
 * SearchBox component: Renders a styled container with an <input> for searching.
 */
export const SearchBox: ISearchBox = (incomingProps) => {
  // Access and merge default props
  const props: ISearchBoxProps = { ...defaultProps, ...incomingProps };

  // Access Node actions from craft
  const { connectors } = useNode(() => ({
    // Here you could collect relevant data or event states if needed
  }));

  const {
    placeholder,
    searchText,
    backgroundColor,
    textColor,
    borderColor,
    borderWidth,
    borderStyle,
    borderRadius,
    padding,
    margin,
    shadow,
    width,
    height,
  } = props;

  const [value, setValue] = useState<string>(searchText || '');

  useEffect(() => {
    // If the incoming prop changes in the editor, sync it
    setValue(searchText || '');
  }, [searchText]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    // If you want to store this in craft state, you'd do:
    // useNode().actions.setProp((props: ISearchBoxProps) => {
    //   props.searchText = e.target.value;
    // });
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // prevent parent canvas selection
  };

  /**
   * Construct styles
   */
  const safePadding = Array.isArray(padding) ? padding : [4, 8, 4, 8];
  const safeMargin = Array.isArray(margin) ? margin : [0, 0, 0, 0];

  // Compute a box shadow if shadow > 0
  const computedBoxShadow =
    shadow && shadow > 0
      ? `0px 3px 10px rgba(0,0,0,0.1), 0px 3px ${shadow}px rgba(0,0,0,0.2)`
      : 'none';

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    backgroundColor,
    color: textColor,
    width,
    height,
    margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
    padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    borderColor,
    borderWidth: borderWidth ? `${borderWidth}px` : '1px',
    borderStyle: borderStyle || 'solid',
    borderRadius: borderRadius || 0,
    boxShadow: computedBoxShadow,
    boxSizing: 'border-box',
  };

  const inputStyle: CSSProperties = {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    color: textColor,
    fontSize: 'inherit',
  };

  /**
   * We'll wrap the <input> inside a Resizer to allow resizing in the editor.
   * The user can resize width & height from the bounding box.
   */
  return (
    <Resizer
      // Provide a ref callback to connect the node
      ref={(ref) => ref && connectors.connect(ref)}
      // Indicate that width & height can be changed
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
      onClick={handleClick}
    >
      <input
        style={inputStyle}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
    </Resizer>
  );
};

/**
 * Configure Craft.js rules and default props for the SearchBox.
 */
SearchBox.craft = {
  displayName: 'SearchBox',
  props: defaultProps,
  rules: {
    canDrag: () => true,
    canMove: () => true,
    canDelete: () => true,
    canSelect: () => true,
  },
  // If/when SearchBoxProperties is created,
  // you could add it here for the settings panel:
  related: {
    settings: SearchBoxProperties,
  },
};
