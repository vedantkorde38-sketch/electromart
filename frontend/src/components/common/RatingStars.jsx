import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count, size = 16, showNumber = true, className = '' }) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className={`rating-stars-container ${className}`}>
      <div className="stars-wrapper" aria-label={`Rating: ${safeRating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = star <= Math.round(safeRating);
          return (
            <Star
              key={star}
              size={size}
              className={filled ? 'star-filled' : 'star-empty'}
              fill={filled ? '#F59E0B' : 'transparent'}
              color={filled ? '#F59E0B' : '#CBD5E1'}
            />
          );
        })}
      </div>
      {showNumber && (
        <span className="rating-value">{safeRating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="rating-count">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
