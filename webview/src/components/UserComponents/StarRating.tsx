import React from 'react';
import { useNode } from '@craftjs/core';
import { Icon } from '@fluentui/react';

interface StarRatingProps {
  maxStars?: number;
  rating?: number;
}

export const StarRating: React.FC<StarRatingProps> & { craft?: any } = ({
  maxStars,
  rating,
}) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => connect(drag(ref))}
      style={{ display: 'flex', gap: '4px' }}
    >
      {[...Array(maxStars)].map((_, index) => (
        <Icon
          key={index}
          iconName={index < (rating || 0) ? 'FavoriteStarFill' : 'FavoriteStar'}
          style={{ color: '#FFD700' }}
        />
      ))}
    </div>
  );
};

StarRating.craft = {
  displayName: 'Star Rating',
  props: {
    maxStars: 5,
    rating: 3,
  },
};
