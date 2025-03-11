import React, {
  CSSProperties,
  MouseEvent,
  forwardRef,
  MutableRefObject,
} from 'react';
import { useNode, Node } from '@craftjs/core';
import { HeadingProperties } from './HeadingProperties';

/** Strict 4-number array for margin/padding usage */
type FourNumberArray = [number, number, number, number];

/** Heading levels supported */
type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Heading component props */
export interface IHeadingProps {
  text?: string;
  level?: HeadingLevel;
  color?: string;
  fontSize?: number;
  fontWeight?: number | 'normal' | 'bold' | 'bolder' | 'lighter';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  margin?: FourNumberArray;
  padding?: FourNumberArray;
}

/** Default values for Heading props */
const defaultProps: Partial<IHeadingProps> = {
  text: 'Heading Text',
  level: 1,
  color: '#000000',
  fontSize: 24,
  fontWeight: 'bold',
  textAlign: 'left',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

/**
 * The Craft-specific interface used to define how the component is
 * handled by the editor (e.g., draggable rules, settings component, etc.)
 */
interface IHeadingCraft {
  displayName: string;
  props: Partial<IHeadingProps>;
  isCanvas?: boolean;
  rules: {
    canDrag: (node: Node) => boolean;
  };
  related: {
    settings: typeof HeadingProperties;
  };
}

/**
 * Extend FC so we can annotate Heading with a static `.craft` field.
 */
interface IHeading extends React.FC<IHeadingProps> {
  craft: IHeadingCraft;
}

/**
 * Heading component, wrapped with React.forwardRef so that
 * Craft.js can attach a ref for drag-and-drop functionality.
 */
export const Heading = forwardRef<HTMLDivElement, IHeadingProps>(
  (incomingProps, ref) => {
    // Pull out both connect and drag from useNode
    const {
      connectors: { connect, drag },
    } = useNode((node: Node) => ({
      selected: node.events.selected,
    }));

    // Merge defaultProps with the incoming props
    const props: IHeadingProps = { ...defaultProps, ...incomingProps };
    const {
      text,
      level,
      color,
      fontSize,
      fontWeight,
      textAlign,
      margin,
      padding,
    } = props;

    // Ensure margin/padding are 4-number arrays
    const safeMargin: FourNumberArray = Array.isArray(margin)
      ? margin
      : [0, 0, 0, 0];
    const safePadding: FourNumberArray = Array.isArray(padding)
      ? padding
      : [0, 0, 0, 0];

    // Construct the heading style
    const headingStyle: CSSProperties = {
      color,
      fontSize,
      fontWeight,
      textAlign,
      margin: `${safeMargin[0]}px ${safeMargin[1]}px ${safeMargin[2]}px ${safeMargin[3]}px`,
      padding: `${safePadding[0]}px ${safePadding[1]}px ${safePadding[2]}px ${safePadding[3]}px`,
    };

    // Dynamically choose the heading tag (h1 - h6)
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;

    // Prevent clicks from propagating if needed
    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
    };

    /**
     * Combine Craft.js' connect+drag with the forwarded ref
     * so the editor can attach the correct ref for DnD.
     */
    const setRef = (dom: HTMLDivElement | null) => {
      if (dom) {
        connect(drag(dom));
      }
      if (typeof ref === 'function') {
        ref(dom);
      } else if (ref) {
        (ref as MutableRefObject<HTMLDivElement | null>).current = dom;
      }
    };

    return (
      <div ref={setRef} style={headingStyle} onClick={handleClick}>
        <HeadingTag>{text}</HeadingTag>
      </div>
    );
  }
);

/**
 * Configure this component for the Craft.js editor.
 * - `displayName`: How it appears in the Layers panel
 * - `props`: Default props
 * - `isCanvas`: Whether this component can contain child nodes
 * - `rules`: Draggable conditions, etc.
 * - `related.settings`: The settings panel component
 */
(Heading as unknown as IHeading).craft = {
  displayName: 'Heading',
  props: defaultProps,
  isCanvas: false,
  rules: {
    canDrag: () => true,
  },
  related: {
    settings: HeadingProperties,
  },
};

export default Heading;
