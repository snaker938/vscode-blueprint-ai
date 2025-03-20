import { CSSProperties, FC } from 'react';
import { useNode } from '@craftjs/core';
import { Resizer } from '../Utils/Resizer';

import { StarRatingProperties } from './StarRatingProperties';

/**
 * Interface for the StarRating component's props.
 * (Adjust as needed to match your requirements)
 */
interface StarRatingProps {
  /** The current rating out of maxRating. */
  rating?: number;
  /** The maximum rating. */
  maxRating?: number;
  /** Color of the filled part of the stars. */
  starColor?: string;
  /** Spacing (in px) between stars. */
  starSpacing?: number;
  /** Background color (container wrapper). */
  background?: string;
  /** The overall width of the star rating block. */
  width?: string;
  /** The overall height of the star rating block. */
  height?: string;
  /** Margin in the format [top, right, bottom, left]. */
  margin?: [number, number, number, number];
  /** Padding in the format [top, right, bottom, left]. */
  padding?: [number, number, number, number];
}

/** Default props for the StarRating component. */
const defaultProps: Partial<StarRatingProps> = {
  rating: 3,
  maxRating: 5,
  starColor: '#FFD700',
  starSpacing: 4,
  background: '#ffffff',
  width: '150px',
  height: '50px',
  margin: [0, 0, 0, 0],
  padding: [0, 0, 0, 0],
};

/**
 * Extend FC with a "craft" property signature
 * so we can define StarRating.craft without TS errors.
 */
interface IStarRatingCraft {
  displayName: string;
  props: Partial<StarRatingProps>;
  related: {
    settings: any; // or typeof StarRatingProperties, if you prefer
  };
}

interface IStarRating extends FC<StarRatingProps> {
  craft: IStarRatingCraft;
}

/**
 * A simple StarRating component demonstrating how
 * to use Craft's Resizer and props interface.
 */
export const StarRating: IStarRating = (incomingProps) => {
  // Access node connectors from Craft.js
  const { connectors } = useNode(() => ({}));

  // Merge incoming props with defaults
  const props: StarRatingProps = { ...defaultProps, ...incomingProps };
  const {
    rating = 3,
    maxRating = 5,
    starColor = '#FFD700',
    starSpacing = 4,
    background = '#ffffff',
    width = '150px',
    height = '50px',
    margin = [0, 0, 0, 0],
    padding = [0, 0, 0, 0],
  } = props;

  // Calculate container sizes
  const containerWidth = parseFloat(width);
  const containerHeight = parseFloat(height);

  // Compute how much horizontal space is taken by starSpacing
  const totalStarSpacing = starSpacing * (maxRating - 1);

  // Calculate the effective drawable area (subtracting padding)
  const effectiveWidth =
    containerWidth - (padding[1] + padding[3]) - totalStarSpacing;
  const effectiveHeight = containerHeight - (padding[0] + padding[2]);

  // Compute size for each star
  const computedStarSize = Math.max(
    0,
    Math.min(effectiveWidth / maxRating, effectiveHeight)
  );

  // Prepare container style
  const containerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    background,
    width,
    height,
    margin: `${margin[0]}px ${margin[1]}px ${margin[2]}px ${margin[3]}px`,
    padding: `${padding[0]}px ${padding[1]}px ${padding[2]}px ${padding[3]}px`,
    overflow: 'hidden',
  };

  // Generate stars
  const stars = Array.from({ length: maxRating }, (_, i) => {
    const index = i + 1;
    const isFilled = index <= rating;

    return (
      <svg
        key={index}
        width={computedStarSize}
        height={computedStarSize}
        viewBox="0 0 24 24"
        fill={isFilled ? starColor : 'none'}
        stroke={starColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ marginRight: i < maxRating - 1 ? starSpacing : 0 }}
      >
        <polygon points="12 2 15 10 23 10 17 14 19 22 12 17 5 22 7 14 1 10 9 10" />
      </svg>
    );
  });

  return (
    <Resizer
      // Connect this ref to Craft (making it resizable & selectable)
      ref={(ref) => {
        if (ref) connectors.connect(ref);
      }}
      propKey={{ width: 'width', height: 'height' }}
      style={containerStyle}
    >
      {stars}
    </Resizer>
  );
};

/**
 * Craft.js configuration
 */
StarRating.craft = {
  displayName: 'StarRating',
  props: defaultProps,
  related: {
    settings: StarRatingProperties,
  },
};
