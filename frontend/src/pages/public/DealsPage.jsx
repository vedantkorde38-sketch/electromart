import React, { useState, useEffect } from 'react';
import { Tag, Sparkles, Copy, Check } from 'lucide-react';
import ProductGrid from '../../components/products/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const DealsPage = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products?discountOnly=true&limit=24&sort=price_desc');
        if (data.success && data.products) {
          setDealProducts(data.products);
        }
      } catch (err) {
        console.error('Failed to fetch deals:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Copied code "${code}" to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const couponPromos = [
    {
      code: 'WELCOME10',
      title: '10% Flat Discount',
      desc: 'Applicable on first order above ₹999. Max discount ₹1,000.'
    },
    {
      code: 'ELECTRO200',
      title: 'Instant ₹200 OFF',
      desc: 'Valid on electronics cart total of ₹1,499 or higher.'
    },
    {
      code: 'FESTIVE500',
      title: 'Mega ₹500 Savings',
      desc: 'Valid on smart TVs, laptops, and appliances above ₹4,999.'
    }
  ];

  return (
    <div className="deals-page-container">
      <div className="container">
        {/* Deals Hero */}
        <div className="deals-hero-banner">
          <div className="deals-hero-content">
            <span className="deals-badge">
              <Sparkles size={16} /> Exclusive Offers &amp; Clearance
            </span>
            <h1 className="deals-main-heading">Today's Hottest Electronics Deals</h1>
            <p className="deals-subtext">
              Save up to 65% on smartphones, laptops, smart TVs, soundbars, and home appliances.
            </p>
          </div>
        </div>

        {/* Coupons Banner Strip */}
        <div className="deals-coupons-grid">
          {couponPromos.map((cp) => (
            <div key={cp.code} className="deal-coupon-card">
              <div className="coupon-card-header">
                <Tag size={18} className="tag-icon" />
                <span className="coupon-code-bold">{cp.code}</span>
              </div>
              <h4 className="coupon-title">{cp.title}</h4>
              <p className="coupon-desc">{cp.desc}</p>
              <button
                type="button"
                className="btn btn-outline btn-sm btn-copy-coupon"
                onClick={() => copyCoupon(cp.code)}
              >
                {copiedCode === cp.code ? (
                  <>
                    <Check size={14} /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Code
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Discounted Products Grid */}
        <div className="deals-products-wrapper">
          <div className="section-header-compact">
            <h2>Discounted Electronics ({dealProducts.length} items)</h2>
            <span className="deals-stock-note">Hurry! Limited quantities available at discounted rates</span>
          </div>

          <ProductGrid
            products={dealProducts}
            loading={loading}
            emptyTitle="No deals currently live"
            emptyDescription="All deals have been claimed. Check back shortly for new promotions!"
          />
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
