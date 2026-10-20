import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Star,
  Check,
  X
} from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/categories');
      if (data.success) setCategories(data.categories || []);
    } catch (err) {
      console.error('Error fetching categories in admin:', err);
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('keyword', searchTerm.trim());
      if (selectedCategory) params.set('category', selectedCategory);
      params.set('page', page.toString());
      params.set('limit', '15');

      const { data } = await api.get(`/products?${params.toString()}`);
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
        setTotalProducts(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching admin products:', err);
      showToast('Could not load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, page, showToast]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the product "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { data } = await api.delete(`/products/${id}`);
      if (data.success) {
        showToast('Product deleted successfully', 'success');
        fetchProducts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Product Inventory Management</h1>
          <p className="admin-page-subtitle">
            Manage {totalProducts} electronic devices, pricing, stock levels, and technical specs
          </p>
        </div>
        <Link to="/admin/products/add" className="btn btn-primary">
          <Plus size={16} />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="admin-category-select-box">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c._id || c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card-section">
        {loading ? (
          <div className="py-5 text-center">
            <LoadingSpinner text="Loading electronic catalogue..." />
          </div>
        ) : products.length === 0 ? (
          <div className="py-5 text-center text-muted">
            <Package size={36} className="mb-2" />
            <h4>No products found matching criteria</h4>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Device / Model</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price (INR)</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const isOutOfStock = p.stock <= 0;
                  const isLowStock = p.stock > 0 && p.stock <= 5;
                  return (
                    <tr key={p._id}>
                      <td>
                        <div className="table-product-cell">
                          <img
                            src={p.images?.[0] || '/placeholder-electronics.svg'}
                            alt={p.name}
                            className="table-mini-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-electronics.svg';
                            }}
                          />
                          <div>
                            <Link
                              to={`/product/${p.slug || p._id}`}
                              target="_blank"
                              className="prod-cell-name font-bold"
                              title="View on store"
                            >
                              {p.name} <ExternalLink size={12} className="inline-icon" />
                            </Link>
                            <span className="prod-cell-sku">ID: {p._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td>{p.category?.name || 'Uncategorized'}</td>
                      <td><strong>{p.brand}</strong></td>
                      <td>
                        <div className="table-price-cell">
                          <strong>{formatINR(p.price)}</strong>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="table-orig-price">{formatINR(p.originalPrice)}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`stock-badge ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'ok'}`}>
                          {isOutOfStock ? 'Out of Stock' : `${p.stock} in stock`}
                        </span>
                      </td>
                      <td>
                        {p.isFeatured ? (
                          <span className="featured-tag yes"><Star size={12} /> Yes</span>
                        ) : (
                          <span className="featured-tag no">No</span>
                        )}
                      </td>
                      <td>
                        <div className="table-action-btns">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="btn-action-icon edit"
                            title="Edit Product"
                          >
                            <Edit2 size={15} />
                          </Link>
                          <button
                            type="button"
                            className="btn-action-icon delete"
                            onClick={() => handleDelete(p._id, p.name)}
                            title="Delete Product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="pagination-bar admin-pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages} ({totalProducts} total items)
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
