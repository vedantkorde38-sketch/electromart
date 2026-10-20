import React from 'react';
import { Filter, X, RotateCcw, Star } from 'lucide-react';
import { formatINR } from '../../utils/currency';

const FilterSidebar = ({
  categories = [],
  brands = [],
  selectedCategory,
  onSelectCategory,
  selectedBrand,
  onSelectBrand,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  inStockOnly,
  onToggleInStock,
  discountOnly,
  onToggleDiscount,
  onClearFilters,
  isOpen,
  onClose
}) => {
  return (
    <aside className={`filter-sidebar-card ${isOpen ? 'mobile-open' : ''}`}>
      <div className="filter-header-bar">
        <div className="filter-title-box">
          <Filter size={18} />
          <h3>Filters</h3>
        </div>
        <div className="filter-header-actions">
          <button
            type="button"
            className="filter-reset-btn"
            onClick={onClearFilters}
            title="Reset all filters"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          {onClose && (
            <button
              type="button"
              className="filter-close-btn"
              onClick={onClose}
              aria-label="Close filters"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="filter-sections-scroll">
        {/* Category Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Categories</h4>
          <div className="filter-options-list">
            <button
              type="button"
              className={`filter-option-btn ${!selectedCategory ? 'active' : ''}`}
              onClick={() => onSelectCategory('')}
            >
              All Electronics
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id || cat.slug}
                type="button"
                className={`filter-option-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.slug)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Filter */}
        {brands && brands.length > 0 && (
          <div className="filter-group">
            <h4 className="filter-group-title">Brand</h4>
            <div className="filter-options-list brands-scroll">
              <label className="filter-checkbox-item">
                <input
                  type="radio"
                  name="brand"
                  checked={!selectedBrand}
                  onChange={() => onSelectBrand('')}
                />
                <span>All Brands</span>
              </label>
              {brands.map((b) => (
                <label key={b} className="filter-checkbox-item">
                  <input
                    type="radio"
                    name="brand"
                    checked={selectedBrand === b}
                    onChange={() => onSelectBrand(b)}
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Price Range (₹)</h4>
          <div className="filter-price-inputs">
            <div className="price-input-box">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => onPriceChange('min', e.target.value)}
                min="0"
                className="input-price-field"
              />
            </div>
            <span className="price-dash">—</span>
            <div className="price-input-box">
              <span className="currency-prefix">₹</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => onPriceChange('max', e.target.value)}
                min="0"
                className="input-price-field"
              />
            </div>
          </div>

          <div className="price-presets-row">
            <button type="button" onClick={() => { onPriceChange('min', 0); onPriceChange('max', 5000); }}>
              Under ₹5K
            </button>
            <button type="button" onClick={() => { onPriceChange('min', 5000); onPriceChange('max', 25000); }}>
              ₹5K-₹25K
            </button>
            <button type="button" onClick={() => { onPriceChange('min', 25000); onPriceChange('max', 75000); }}>
              ₹25K-₹75K
            </button>
            <button type="button" onClick={() => { onPriceChange('min', 75000); onPriceChange('max', ''); }}>
              Above ₹75K
            </button>
          </div>
        </div>

        {/* Customer Rating Filter */}
        <div className="filter-group">
          <h4 className="filter-group-title">Customer Rating</h4>
          <div className="filter-rating-options">
            {[4, 3, 2].map((stars) => (
              <label key={stars} className="filter-rating-label">
                <input
                  type="radio"
                  name="rating"
                  checked={Number(minRating) === stars}
                  onChange={() => onRatingChange(stars)}
                />
                <div className="rating-row-stars">
                  <span className="stars-cluster">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        fill={s <= stars ? '#F59E0B' : 'transparent'}
                        color={s <= stars ? '#F59E0B' : '#CBD5E1'}
                      />
                    ))}
                  </span>
                  <span className="rating-desc-text">&amp; Up</span>
                </div>
              </label>
            ))}
            {minRating && (
              <button
                type="button"
                className="btn-link-reset"
                onClick={() => onRatingChange('')}
              >
                Clear rating filter
              </button>
            )}
          </div>
        </div>

        {/* Availability & Offers */}
        <div className="filter-group">
          <h4 className="filter-group-title">Availability &amp; Offers</h4>
          <label className="filter-switch-item">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => onToggleInStock(e.target.checked)}
            />
            <span className="switch-text">In Stock Only</span>
          </label>

          <label className="filter-switch-item">
            <input
              type="checkbox"
              checked={discountOnly}
              onChange={(e) => onToggleDiscount(e.target.checked)}
            />
            <span className="switch-text">Discounted Deals Only</span>
          </label>
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
