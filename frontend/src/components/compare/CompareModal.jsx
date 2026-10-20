import React from 'react';
import { X, ShoppingCart, Trash2, Sliders, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import RatingStars from '../common/RatingStars';

const CompareModal = () => {
  const { compareItems, isCompareModalOpen, closeCompareModal, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!isCompareModalOpen || compareItems.length === 0) return null;

  // Extract all unique specification keys across all compared products
  const allSpecKeys = Array.from(
    new Set(
      compareItems.flatMap((item) =>
        item.specifications ? Object.keys(item.specifications) : []
      )
    )
  );

  return (
    <div className="modal-backdrop-overlay" onClick={closeCompareModal}>
      <div
        className="modal-dialog-box modal-lg compare-modal-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header compare-modal-header">
          <div className="compare-modal-title-box">
            <Sliders size={22} className="text-primary" />
            <div>
              <h3 className="modal-title">Side-by-Side Electronics Comparison</h3>
              <p className="modal-subtitle">
                Comparing {compareItems.length} electronic device(s)
              </p>
            </div>
          </div>
          <div className="compare-modal-header-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={clearCompare}
              title="Clear comparison list"
            >
              <Trash2 size={14} /> Clear All
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeCompareModal}
              title="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body / Table Matrix */}
        <div className="compare-modal-body">
          <div className="compare-table-wrapper">
            <table className="compare-matrix-table">
              <thead>
                <tr>
                  <th className="compare-feature-label-col">Device Details</th>
                  {compareItems.map((product) => (
                    <th key={product._id} className="compare-product-col">
                      <div className="compare-product-header-cell">
                        <button
                          type="button"
                          className="compare-cell-remove-btn"
                          onClick={() => removeFromCompare(product._id)}
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                        <Link
                          to={`/product/${product.slug || product._id}`}
                          onClick={closeCompareModal}
                          className="compare-product-img-link"
                        >
                          <img
                            src={product.images?.[0] || '/placeholder-electronics.svg'}
                            alt={product.name}
                            className="compare-product-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-electronics.svg';
                            }}
                          />
                        </Link>
                        <h4 className="compare-product-name">
                          <Link
                            to={`/product/${product.slug || product._id}`}
                            onClick={closeCompareModal}
                          >
                            {product.name}
                          </Link>
                        </h4>
                        <div className="compare-brand-pill">{product.brand}</div>
                        <div className="compare-price-val">{formatINR(product.price)}</div>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm btn-block mt-2"
                          disabled={product.stock <= 0}
                          onClick={() => addToCart(product, 1)}
                        >
                          <ShoppingCart size={14} />
                          <span>{product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic Attributes */}
                <tr>
                  <td className="compare-feature-label">Customer Rating</td>
                  {compareItems.map((p) => (
                    <td key={p._id}>
                      <RatingStars rating={p.ratingAverage || 0} count={p.ratingCount || 0} size={13} />
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-feature-label">Stock Status</td>
                  {compareItems.map((p) => (
                    <td key={p._id}>
                      {p.stock > 0 ? (
                        <span className="text-success font-weight-bold">
                          In Stock ({p.stock} units)
                        </span>
                      ) : (
                        <span className="text-danger font-weight-bold">Out of Stock</span>
                      )}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="compare-feature-label">Warranty</td>
                  {compareItems.map((p) => (
                    <td key={p._id}>
                      {p.warranty || '1 Year Manufacturer Warranty'}
                    </td>
                  ))}
                </tr>

                {/* Section Divider: Technical Specifications */}
                {allSpecKeys.length > 0 && (
                  <tr className="compare-section-header-row">
                    <td colSpan={compareItems.length + 1}>
                      Technical Specifications Matrix
                    </td>
                  </tr>
                )}

                {/* Dynamic Spec Rows */}
                {allSpecKeys.map((specKey) => (
                  <tr key={specKey}>
                    <td className="compare-feature-label">{specKey}</td>
                    {compareItems.map((p) => (
                      <td key={p._id}>
                        {p.specifications && p.specifications[specKey] ? (
                          <span className="spec-val-badge">
                            {p.specifications[specKey]}
                          </span>
                        ) : (
                          <span className="spec-val-empty">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareModal;
