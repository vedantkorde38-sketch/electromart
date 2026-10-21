import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Share2,
  ChevronRight,
  Sliders,
  Check
} from 'lucide-react';
import PriceDisplay from '../../components/common/PriceDisplay';
import RatingStars from '../../components/common/RatingStars';
import QuantitySelector from '../../components/products/QuantitySelector';
import ReviewSection from '../../components/products/ReviewSection';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TradeInCard from '../../components/tradeIn/TradeInCard';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ProductDetailsPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'reviews'
  const [isAdded, setIsAdded] = useState(false);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${identifier}`);
      if (data.success && data.product) {
        setProduct(data.product);
        setSelectedImage(data.product.images?.[0] || '/placeholder-electronics.svg');
        setRelatedProducts(data.relatedProducts || []);
      }
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (identifier) {
      fetchProductDetails();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [identifier]);

  if (loading) {
    return <LoadingSpinner text="Loading electronic product details..." size="lg" />;
  }

  if (!product) {
    return (
      <div className="container py-5 text-center">
        <h2>Product Not Found</h2>
        <p>The electronic item you are looking for is no longer available.</p>
        <Link to="/shop" className="btn btn-primary mt-3">Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const inCompare = isInCompare(product._id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1400);
    }
    return success;
  };

  const handleBuyNow = async () => {
    const success = await addToCart(product, quantity);
    if (success) {
      navigate('/checkout');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on ElectroMart!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!', 'info');
    }
  };

  const specificationsList = product.specifications instanceof Map
    ? Object.fromEntries(product.specifications)
    : product.specifications || {};

  return (
    <div className="product-details-master">
      <div className="container">
        {/* Breadcrumbs */}
        <nav className="details-breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop">Shop</Link>
          {product.category && (
            <>
              <ChevronRight size={14} />
              <Link to={`/category/${product.category.slug}`}>{product.category.name}</Link>
            </>
          )}
          <ChevronRight size={14} />
          <span className="crumb-current">{product.name}</span>
        </nav>

        {/* Top Product Overview Grid */}
        <div className="details-main-grid">
          {/* Left Column: Image Gallery */}
          <div className="details-gallery-column">
            <div className="main-image-display-box">
              <img
                src={selectedImage}
                alt={product.name}
                className="details-hero-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-electronics.svg';
                }}
              />
              {product.discountPercentage > 0 && (
                <span className="gallery-discount-badge">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnails Row */}
            {product.images && product.images.length > 1 && (
              <div className="gallery-thumbnails-strip">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-electronics.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information & Purchase Controls */}
          <div className="details-info-column">
            <div className="details-meta-header">
              <span className="brand-title-badge">{product.brand}</span>
              <span className="product-sku-tag">SKU: {product._id.slice(-8).toUpperCase()}</span>
            </div>

            <h1 className="details-product-name">{product.name}</h1>

            {/* Rating & Review Jump */}
            <div className="details-rating-strip">
              <RatingStars rating={product.ratingAverage} count={product.ratingCount} size={18} />
              <button
                type="button"
                className="jump-to-reviews-btn"
                onClick={() => {
                  setActiveTab('reviews');
                  document.getElementById('product-tabs-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Read all {product.ratingCount || 0} customer reviews
              </button>
            </div>

            {/* Pricing Section in Indian Rupees (₹) */}
            <div className="details-pricing-card">
              <PriceDisplay
                price={product.price}
                originalPrice={product.originalPrice}
                discountPercentage={product.discountPercentage}
                size="lg"
                showSavings={true}
              />
              <span className="gst-inclusive-label">Inclusive of all Indian taxes and GST</span>
            </div>

            {/* Stock Availability */}
            <div className="details-stock-status">
              {isOutOfStock ? (
                <div className="stock-alert alert-out">
                  <AlertCircle size={18} />
                  <span>Currently Out of Stock. Restocking soon.</span>
                </div>
              ) : isLowStock ? (
                <div className="stock-alert alert-low">
                  <AlertCircle size={18} />
                  <span>Hurry! Only {product.stock} units left in stock.</span>
                </div>
              ) : (
                <div className="stock-alert alert-in">
                  <CheckCircle size={18} />
                  <span>In Stock &amp; Ready to Ship from Mumbai warehouse</span>
                </div>
              )}
            </div>

            {/* Quantity Selector & Purchase Actions */}
            {!isOutOfStock && (
              <div className="details-purchase-controls">
                <div className="qty-row">
                  <label className="qty-row-label">Quantity:</label>
                  <QuantitySelector
                    quantity={quantity}
                    max={Math.min(product.stock, 10)}
                    onChange={setQuantity}
                  />
                </div>

                <div className="cta-buttons-cluster">
                  <button
                    type="button"
                    className={`btn btn-primary btn-lg btn-add-main ${isAdded ? 'btn-added-pop' : ''}`}
                    onClick={handleAddToCart}
                  >
                    {isAdded ? (
                      <>
                        <Check size={20} />
                        <span>Added to Cart! ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    className="btn btn-warning btn-lg btn-buy-now"
                    onClick={handleBuyNow}
                  >
                    <Zap size={20} />
                    <span>Buy Now</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-details-wishlist ${inWishlist ? 'active' : ''}`}
                    onClick={() => toggleWishlist(product)}
                    title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart
                      size={22}
                      fill={inWishlist ? '#EF4444' : 'transparent'}
                      color={inWishlist ? '#EF4444' : '#64748B'}
                    />
                  </button>

                  <button
                    type="button"
                    className={`btn-details-wishlist btn-details-compare ${inCompare ? 'active' : ''}`}
                    onClick={() => toggleCompare(product)}
                    title={inCompare ? 'Remove from Comparison' : 'Compare with other electronics'}
                  >
                    <Sliders size={20} />
                  </button>

                  <button
                    type="button"
                    className="btn-details-share"
                    onClick={handleShare}
                    title="Share product"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Apple & ElectroMart Trade-In Calculator Card */}
            <TradeInCard targetProduct={product} />

            {/* Assurance Badges */}
            <div className="details-assurance-card">
              <div className="assurance-item">
                <ShieldCheck size={20} className="icon-blue" />
                <div>
                  <strong>Official Warranty</strong>
                  <p>1 Year Comprehensive Brand Warranty Included</p>
                </div>
              </div>

              <div className="assurance-item">
                <Truck size={20} className="icon-green" />
                <div>
                  <strong>Free Express Delivery</strong>
                  <p>Eligible for Free Delivery across India (Orders &gt; ₹999)</p>
                </div>
              </div>

              <div className="assurance-item">
                <RotateCcw size={20} className="icon-amber" />
                <div>
                  <strong>7-Day Replacement</strong>
                  <p>Hassle-free replacement for transit or technical damage</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section: Specifications, Description & Reviews */}
        <div className="product-tabs-wrapper" id="product-tabs-section">
          <div className="tabs-header-strip">
            <button
              className={`tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
              onClick={() => setActiveTab('specs')}
            >
              Technical Specifications
            </button>
            <button
              className={`tab-btn ${activeTab === 'desc' ? 'active' : ''}`}
              onClick={() => setActiveTab('desc')}
            >
              Product Description
            </button>
            <button
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Customer Reviews ({product.ratingCount || 0})
            </button>
          </div>

          <div className="tab-pane-content">
            {/* 1. Specifications Tab */}
            {activeTab === 'specs' && (
              <div className="specs-table-container">
                <h3 className="tab-section-heading">Detailed Technical Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    <tr>
                      <td className="spec-key">Brand</td>
                      <td className="spec-val">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="spec-key">Category</td>
                      <td className="spec-val">{product.category?.name || 'Consumer Electronics'}</td>
                    </tr>
                    {Object.entries(specificationsList).map(([key, val]) => (
                      <tr key={key}>
                        <td className="spec-key">{key}</td>
                        <td className="spec-val">{val}</td>
                      </tr>
                    ))}
                    <tr>
                      <td className="spec-key">Price (INR)</td>
                      <td className="spec-val">₹{product.price?.toLocaleString('en-IN')} (Inclusive of GST)</td>
                    </tr>
                    <tr>
                      <td className="spec-key">Stock Availability</td>
                      <td className="spec-val">{product.stock > 0 ? `${product.stock} units in stock` : 'Out of stock'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* 2. Description Tab */}
            {activeTab === 'desc' && (
              <div className="desc-pane">
                <h3 className="tab-section-heading">About This Product</h3>
                <p className="product-long-description">{product.description}</p>
                <div className="desc-features-box">
                  <h4>Key Highlights</h4>
                  <ul>
                    <li>100% Genuine electronics with verified serial numbers and official brand seal.</li>
                    <li>Packaged in specialized shock-resistant multi-layered electronics cartons.</li>
                    <li>Accompanied by GST Tax Invoice for easy warranty claims at authorized service centers across India.</li>
                  </ul>
                </div>
              </div>
            )}

            {/* 3. Customer Reviews Tab */}
            {activeTab === 'reviews' && (
              <ReviewSection productId={product._id} onRatingUpdated={fetchProductDetails} />
            )}
          </div>
        </div>

        {/* Related Electronics Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title">Similar Devices in {product.category?.name}</h2>
            <div className="product-grid">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsPage;
