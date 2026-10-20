import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SortDropdown = ({ value, onChange, totalProducts = 0 }) => {
  return (
    <div className="sort-bar-container">
      <div className="total-products-counter">
        Showing <strong>{totalProducts}</strong> products
      </div>
      <div className="sort-select-wrapper">
        <ArrowUpDown size={15} className="sort-icon" />
        <label htmlFor="sort-select" className="sort-label">Sort by:</label>
        <select
          id="sort-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sort-dropdown-element"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Highest Customer Rated</option>
          <option value="popular">Popular &amp; Best Selling</option>
        </select>
      </div>
    </div>
  );
};

export default SortDropdown;
