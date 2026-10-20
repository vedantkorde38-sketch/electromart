import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import QuantitySelector from '../products/QuantitySelector';
import { formatINR } from '../../utils/currency';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const product = item.product;

  if (!product) return null;

  const itemTotal = (product.price || 0) * item.quantity;
  const mainImage = product.images?.[0] || '/placeholder-electronics.svg';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder-electronics.svg';
  };

  return (
    <div className="cart-item-row">
      {/* Product Image */}
      <Link to={`/product/${product.slug || product._id}`} className="cart-item-image-box">
        <img
          src={mainImage}
          alt={product.name}
          className="cart-item-img"
          onError={handleImageError}
        />
      </Link>

      {/* Product Details */}
      <div className="cart-item-info">
        <span className="cart-item-brand">{product.brand}</span>
        <h4 className="cart-item-name">
          <Link to={`/product/${product.slug || product._id}`}>
            {product.name}
          </Link>
        </h4>
        <div className="cart-item-price-unit">
          Unit Price: <strong>{formatINR(product.price)}</strong>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="cart-original-price">{formatINR(product.originalPrice)}</span>
          )}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="cart-item-quantity">
        <QuantitySelector
          quantity={item.quantity}
          max={product.stock || 10}
          onChange={(newQty) => updateQuantity(product._id, newQty)}
        />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="cart-low-stock-hint">Only {product.stock} left</span>
        )}
      </div>

      {/* Subtotal */}
      <div className="cart-item-total">
        <span className="total-label-mobile">Total: </span>
        <span className="cart-item-total-val">{formatINR(itemTotal)}</span>
      </div>

      {/* Remove Button */}
      <div className="cart-item-actions">
        <button
          type="button"
          onClick={() => removeFromCart(product._id)}
          className="cart-remove-btn"
          aria-label="Remove item from cart"
          title="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
