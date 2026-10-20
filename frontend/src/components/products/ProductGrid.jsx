import React from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';
import { PackageSearch } from 'lucide-react';

const ProductGrid = ({
  products = [],
  loading = false,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters, category, or search keywords.',
  onClearFilters = null
}) => {
  if (loading) {
    return (
      <div className="product-grid-loading-box">
        <LoadingSpinner text="Loading electronic products..." size="lg" />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyTitle}
        description={emptyDescription}
        actionText={onClearFilters ? 'Clear All Filters' : 'Browse All Electronics'}
        actionLink={onClearFilters ? null : '/shop'}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
