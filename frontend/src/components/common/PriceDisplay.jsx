import React from 'react';
import { formatINR } from '../../utils/currency';

const PriceDisplay = ({
  price,
  originalPrice,
  discountPercentage,
  size = 'md',
  showSavings = false,
  className = ''
}) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPct = discountPercentage || (hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0);
  const savings = hasDiscount ? originalPrice - price : 0;

  return (
    <div className={`price-display-wrapper ${size} ${className}`}>
      <div className="price-main-row">
        <span className="price-current">{formatINR(price)}</span>
        {hasDiscount && (
          <>
            <span className="price-original">{formatINR(originalPrice)}</span>
            <span className="price-discount-badge">{discountPct}% OFF</span>
          </>
        )}
      </div>
      {showSavings && savings > 0 && (
        <span className="price-savings-text">
          You save {formatINR(savings)}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
