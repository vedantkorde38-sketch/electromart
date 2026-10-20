import React from 'react';
import { Sliders, X, ArrowRight, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const CompareFloatingDock = () => {
  const { compareItems, compareCount, removeFromCompare, clearCompare, openCompareModal } = useCompare();

  if (compareCount === 0) return null;

  return (
    <div className="compare-floating-dock-container">
      <div className="compare-dock-card">
        {/* Left Side: Badge & Label */}
        <div className="compare-dock-header">
          <div className="compare-dock-icon">
            <Sliders size={18} />
          </div>
          <div>
            <div className="compare-dock-title">
              Compare Electronics ({compareCount}/4)
            </div>
            <div className="compare-dock-subtitle">
              {compareCount < 2 ? 'Add 1 more to compare specs' : 'Side-by-side specs ready'}
            </div>
          </div>
        </div>

        {/* Center: Product Thumbnails */}
        <div className="compare-dock-items-row">
          {compareItems.map((item) => (
            <div key={item._id} className="compare-dock-thumb-box" title={item.name}>
              <img
                src={item.images?.[0] || '/placeholder-electronics.svg'}
                alt={item.name}
                className="compare-dock-thumb-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/placeholder-electronics.svg';
                }}
              />
              <span className="compare-dock-thumb-name">
                {item.name.length > 18 ? item.name.substring(0, 18) + '...' : item.name}
              </span>
              <button
                type="button"
                className="compare-dock-remove-btn"
                onClick={() => removeFromCompare(item._id)}
                title="Remove from comparison"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {/* Placeholder slots if less than 4 */}
          {Array.from({ length: Math.max(0, 2 - compareCount) }).map((_, idx) => (
            <div key={`empty-${idx}`} className="compare-dock-empty-slot">
              <span>+ Add product</span>
            </div>
          ))}
        </div>

        {/* Right Side: Action Buttons */}
        <div className="compare-dock-actions">
          <button
            type="button"
            className="btn btn-primary btn-compare-now"
            onClick={openCompareModal}
            disabled={compareCount < 2}
          >
            <span>Compare Now</span>
            <ArrowRight size={16} />
          </button>
          <button
            type="button"
            className="btn-clear-compare"
            onClick={clearCompare}
            title="Clear all comparison items"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompareFloatingDock;
