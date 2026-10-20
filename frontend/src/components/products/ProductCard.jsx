import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import PriceDisplay from '../common/PriceDisplay';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const mainImage = product.images?.[0] || '/placeholder-electronics.svg';

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = '/placeholder-electronics.svg';
  };

  return (
    <div className={`product-card ${isOutOfStock ? 'card-out-of-stock' : ''}`}>
      {/* Card Header: Badges & Wishlist Action */}
      <div className="card-top-bar">
        <div className="card-badges-stack">
          {product.isFeatured && <span className="badge-tag tag-featured">Featured</span>}
          {product.discountPercentage > 0 && (
            <span className="badge-tag tag-discount">{product.discountPercentage}% OFF</span>
          )}
        </div>

        <button
          className={`wishlist-btn-circle ${inWishlist ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={18} fill={inWishlist ? '#EF4444' : 'transparent'} color={inWishlist ? '#EF4444' : '#64748B'} />
        </button>
      </div>

      {/* Product Image Link */}
      <Link to={`/product/${product.slug || product._id}`} className="card-img-link">
        <img
          src={mainImage}
          alt={product.name}
          className="product-card-thumb"
          loading="lazy"
          onError={handleImageError}
        />
      </Link>

      {/* Card Body Info */}
      <div className="card-body-content">
        <div className="card-meta-row">
          <span className="product-brand-tag">{product.brand}</span>
          {product.category?.name && (
            <span className="product-cat-tag">{product.category.name}</span>
          )}
        </div>

        <h3 className="product-card-title">
          <Link to={`/product/${product.slug || product._id}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="card-rating-row">
          <RatingStars rating={product.ratingAverage} count={product.ratingCount} size={14} />
        </div>

        {/* Price in INR */}
        <div className="card-price-row">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discountPercentage={product.discountPercentage}
            size="md"
          />
        </div>

        {/* Stock Status */}
        <div className="card-stock-indicator">
          {isOutOfStock ? (
            <span className="stock-label text-out">Out of Stock</span>
          ) : isLowStock ? (
            <span className="stock-label text-low">Only {product.stock} units left!</span>
          ) : (
            <span className="stock-label text-in">In Stock</span>
          )}
        </div>

        {/* Actions Button */}
        <div className="card-actions-row">
          <button
            className="btn btn-primary btn-add-cart"
            disabled={isOutOfStock}
            onClick={() => addToCart(product, 1)}
          >
            <ShoppingCart size={16} />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
