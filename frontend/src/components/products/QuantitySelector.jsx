import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ quantity = 1, max = 10, onChange, disabled = false }) => {
  const handleDecrement = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div className={`qty-selector-group ${disabled ? 'disabled' : ''}`}>
      <button
        type="button"
        className="qty-btn btn-minus"
        onClick={handleDecrement}
        disabled={disabled || quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="qty-number-display">{quantity}</span>
      <button
        type="button"
        className="qty-btn btn-plus"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};

export default QuantitySelector;
