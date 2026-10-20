import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '../../components/products/FilterSidebar';
import SortDropdown from '../../components/products/SortDropdown';
import ProductGrid from '../../components/products/ProductGrid';
import api from '../../services/api';

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters state from URL query parameters
  const currentKeyword = searchParams.get('keyword') || '';
  const currentCategory = searchParams.get('category') || '';
  const currentBrand = searchParams.get('brand') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentRating = searchParams.get('minRating') || '';
  const currentInStock = searchParams.get('inStock') === 'true';
  const currentDiscount = searchParams.get('discountOnly') === 'true';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch categories list
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories in shop:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products matching filters
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (currentKeyword) params.set('keyword', currentKeyword);
      if (currentCategory) params.set('category', currentCategory);
      if (currentBrand) params.set('brand', currentBrand);
      if (currentMinPrice) params.set('minPrice', currentMinPrice);
      if (currentMaxPrice) params.set('maxPrice', currentMaxPrice);
      if (currentRating) params.set('minRating', currentRating);
      if (currentInStock) params.set('inStock', 'true');
      if (currentDiscount) params.set('discountOnly', 'true');
      if (currentSort) params.set('sort', currentSort);
      params.set('page', currentPage.toString());
      params.set('limit', '12');

      const { data } = await api.get(`/products?${params.toString()}`);
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalCount(data.total || 0);
        if (data.availableBrands) {
          setAvailableBrands(data.availableBrands);
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [
    currentKeyword,
    currentCategory,
    currentBrand,
    currentMinPrice,
    currentMaxPrice,
    currentRating,
    currentInStock,
    currentDiscount,
    currentSort,
    currentPage
  ]);

  useEffect(() => {
    fetchProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [fetchProducts]);

  // URL update helper
  const updateQueryParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== null && value !== '') {
      newParams.set(key, value.toString());
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handlePriceChange = (type, val) => {
    const key = type === 'min' ? 'minPrice' : 'maxPrice';
    updateQueryParam(key, val);
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount = [
    currentKeyword,
    currentCategory,
    currentBrand,
    currentMinPrice,
    currentMaxPrice,
    currentRating,
    currentInStock,
    currentDiscount
  ].filter(Boolean).length;

  return (
    <div className="shop-page-wrapper">
      <div className="container">
        {/* Breadcrumb & Header Title */}
        <div className="shop-header-banner">
          <div>
            <h1 className="shop-main-title">
              {currentCategory
                ? categories.find((c) => c.slug === currentCategory)?.name || 'Category'
                : currentKeyword
                ? `Search results for "${currentKeyword}"`
                : 'All Electronics & Appliances'}
            </h1>
            <p className="shop-subtitle">
              Explore {totalCount} authentic electronics with official Indian brand warranty.
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            className="btn btn-secondary mobile-filter-btn"
            onClick={() => setIsMobileFilterOpen(true)}
          >
            <SlidersHorizontal size={18} />
            <span>Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="active-filters-chips-bar">
            <span className="chips-title">Active Filters:</span>
            {currentCategory && (
              <span className="filter-chip">
                Category: {currentCategory}
                <button onClick={() => updateQueryParam('category', '')}><X size={13} /></button>
              </span>
            )}
            {currentBrand && (
              <span className="filter-chip">
                Brand: {currentBrand}
                <button onClick={() => updateQueryParam('brand', '')}><X size={13} /></button>
              </span>
            )}
            {currentKeyword && (
              <span className="filter-chip">
                Search: {currentKeyword}
                <button onClick={() => updateQueryParam('keyword', '')}><X size={13} /></button>
              </span>
            )}
            {(currentMinPrice || currentMaxPrice) && (
              <span className="filter-chip">
                Price: ₹{currentMinPrice || '0'} - ₹{currentMaxPrice || 'Max'}
                <button onClick={() => { updateQueryParam('minPrice', ''); updateQueryParam('maxPrice', ''); }}><X size={13} /></button>
              </span>
            )}
            {currentRating && (
              <span className="filter-chip">
                Rating: {currentRating}★ &amp; above
                <button onClick={() => updateQueryParam('minRating', '')}><X size={13} /></button>
              </span>
            )}
            {currentInStock && (
              <span className="filter-chip">
                In Stock Only
                <button onClick={() => updateQueryParam('inStock', '')}><X size={13} /></button>
              </span>
            )}
            {currentDiscount && (
              <span className="filter-chip">
                Discount Deals Only
                <button onClick={() => updateQueryParam('discountOnly', '')}><X size={13} /></button>
              </span>
            )}
            <button className="clear-all-chips-btn" onClick={handleClearFilters}>
              Clear All
            </button>
          </div>
        )}

        {/* Layout Grid: Sidebar + Products */}
        <div className="shop-layout-grid">
          {/* Desktop Filter Sidebar */}
          <FilterSidebar
            categories={categories}
            brands={availableBrands}
            selectedCategory={currentCategory}
            onSelectCategory={(cat) => updateQueryParam('category', cat)}
            selectedBrand={currentBrand}
            onSelectBrand={(b) => updateQueryParam('brand', b)}
            minPrice={currentMinPrice}
            maxPrice={currentMaxPrice}
            onPriceChange={handlePriceChange}
            minRating={currentRating}
            onRatingChange={(r) => updateQueryParam('minRating', r)}
            inStockOnly={currentInStock}
            onToggleInStock={(val) => updateQueryParam('inStock', val ? 'true' : '')}
            discountOnly={currentDiscount}
            onToggleDiscount={(val) => updateQueryParam('discountOnly', val ? 'true' : '')}
            onClearFilters={handleClearFilters}
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
          />

          {/* Main Products Area */}
          <main className="shop-products-column">
            {/* Sort & Count Bar */}
            <SortDropdown
              value={currentSort}
              onChange={(s) => updateQueryParam('sort', s)}
              totalProducts={totalCount}
            />

            {/* Products Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              emptyTitle="No electronic products matched your filters"
              emptyDescription="Try broadening your price range, clearing specific brands, or searching for a different keyword."
              onClearFilters={handleClearFilters}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && !loading && (
              <div className="pagination-bar">
                <button
                  className="btn btn-secondary pagination-btn"
                  disabled={currentPage <= 1}
                  onClick={() => updateQueryParam('page', currentPage - 1)}
                >
                  Previous
                </button>

                <div className="pagination-pages-list">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`pagination-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => updateQueryParam('page', pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-secondary pagination-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => updateQueryParam('page', currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
