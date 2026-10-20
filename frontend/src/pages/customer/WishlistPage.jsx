import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import PriceDisplay from '../../components/common/PriceDisplay';
import EmptyState from '../../components/common/EmptyState';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (product) => {
    const success = await addToCart(product, 1);
    if (success) {
      removeFromWishlist(product._id);
    }
  };

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Save electronic appliances and gadgets you love by tapping the heart icon on any product."
          actionText="Explore Electronics Catalog"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="wishlist-page-container">
      <div className="container">
        <div className="wishlist-header-row">
          <div>
            <h1 className="wishlist-title">My Saved Wishlist</h1>
            <p className="wishlist-subtitle">You have <strong>{wishlist.length}</strong> items saved</p>
          </div>
          <Link to="/shop" className="btn btn-outline btn-sm">
            <span>Continue Shopping</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((product) => {
            if (!product || typeof product !== 'object') return null;
            const isOutOfStock = product.stock <= 0;
            const mainImg = product.images?.[0] || '/placeholder-electronics.svg';

            return (
              <div key={product._id} className="wishlist-card">
                <button
                  type="button"
                  className="wishlist-card-remove-btn"
                  onClick={() => removeFromWishlist(product._id)}
                  title="Remove from Wishlist"
                  aria-label="Remove item"
                >
                  <Trash2 size={16} />
                </button>

                <Link to={`/product/${product.slug || product._id}`} className="wishlist-img-link">
                  <img
                    src={mainImg}
                    alt={product.name}
                    className="wishlist-item-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-electronics.svg';
                    }}
                  />
                </Link>

                <div className="wishlist-card-body">
                  <span className="wishlist-brand">{product.brand}</span>
                  <h3 className="wishlist-item-title">
                    <Link to={`/product/${product.slug || product._id}`}>
                      {product.name}
                    </Link>
                  </h3>

                  <div className="wishlist-price-box">
                    <PriceDisplay
                      price={product.price}
                      originalPrice={product.originalPrice}
                      discountPercentage={product.discountPercentage}
                      size="sm"
                    />
                  </div>

                  <div className="wishlist-stock-status">
                    {isOutOfStock ? (
                      <span className="stock-label text-out">Out of Stock</span>
                    ) : (
                      <span className="stock-label text-in">In Stock ({product.stock} left)</span>
                    )}
                  </div>

                  <div className="wishlist-actions-bar">
                    <button
                      type="button"
                      className="btn btn-primary btn-block btn-sm"
                      disabled={isOutOfStock}
                      onClick={() => handleMoveToCart(product)}
                    >
                      <ShoppingCart size={15} />
                      <span>{isOutOfStock ? 'Out of Stock' : 'Move to Cart'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
