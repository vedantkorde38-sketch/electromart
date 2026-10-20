import React, { useState, useEffect, useMemo } from 'react';
import { Tag, Sparkles, Copy, Check, Flame, ArrowRight, Percent, ShieldCheck } from 'lucide-react';
import ProductGrid from '../../components/products/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import FlashDealsTimer from '../../components/home/FlashDealsTimer';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const DealsPage = () => {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/products?discountOnly=true&limit=36&sort=price_desc');
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
    showToast(`Coupon code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const couponPromos = [
    {
      code: 'WELCOME10',
      title: 'Flat 10% Discount',
      desc: 'Applicable on your first order above ₹999. Max discount ₹1,000.',
      tag: 'New Customer Special'
    },
    {
      code: 'ELECTRO200',
      title: 'Instant ₹200 OFF',
      desc: 'Valid on any electronics bag total of ₹1,499 or higher.',
      tag: 'Instant Cart Savings'
    },
    {
      code: 'FESTIVE500',
      title: 'Mega ₹500 Savings',
      desc: 'Applicable on 4K TVs, laptops, and smart inverter appliances.',
      tag: 'High Value Flagships'
    }
  ];

  // Category filtering
  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return dealProducts;
    return dealProducts.filter((p) => {
      const slug = p.categorySlug || p.category?.slug || '';
      if (selectedCategory === 'smartphones') return slug === 'smartphones';
      if (selectedCategory === 'laptops') return slug.includes('laptop') || slug.includes('computer');
      if (selectedCategory === 'tvs') return slug.includes('television') || slug.includes('tv');
      if (selectedCategory === 'appliances') {
        return slug.includes('conditioner') || slug.includes('refrigerator') || slug.includes('washing') || slug.includes('kitchen');
      }
      return true;
    });
  }, [dealProducts, selectedCategory]);

  return (
    <div className="deals-page-container ios-deals-page">
      <div className="container">
        {/* Apple Style Deals Hero */}
        <div className="apple-deals-hero">
          <div className="deals-hero-inner">
            <div className="apple-hero-pill-badge" style={{ margin: '0 auto 1rem auto' }}>
              <Flame size={14} className="flame-icon-pulse text-warning" />
              <span>Limited-Time Clearance &amp; Flash Savings</span>
            </div>
            <h1 className="deals-main-heading">Exclusive Deals &amp; Offers</h1>
            <p className="deals-subtext">
              Save up to 65% on authentic flagship smartphones, M3 MacBooks, 4K Smart TVs, and inverter air conditioners.
            </p>
          </div>
        </div>

        {/* Live Flash Deals Countdown Timer */}
        <FlashDealsTimer />

        {/* Coupons Voucher Strip */}
        <div className="deals-coupons-section">
          <div className="coupons-section-header">
            <span className="section-eyebrow">Instant Discounts</span>
            <h3 className="coupons-section-title">Apply Coupons at Checkout</h3>
          </div>

          <div className="deals-coupons-grid">
            {couponPromos.map((cp) => (
              <div key={cp.code} className="deal-coupon-card ios-coupon-card">
                <div className="coupon-card-header">
                  <div className="coupon-tag-badge">
                    <Tag size={13} />
                    <span>{cp.tag}</span>
                  </div>
                  <div className="coupon-code-pill">{cp.code}</div>
                </div>
                <h4 className="coupon-title">{cp.title}</h4>
                <p className="coupon-desc">{cp.desc}</p>
                <button
                  type="button"
                  className={`btn-copy-coupon-ios ${copiedCode === cp.code ? 'copied' : ''}`}
                  onClick={() => copyCoupon(cp.code)}
                >
                  {copiedCode === cp.code ? (
                    <>
                      <Check size={15} /> <span>Code Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} /> <span>Tap to Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Category Deal Tabs */}
        <div className="deals-filter-strip">
          <button
            type="button"
            className={`deal-filter-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Discounted Deals ({dealProducts.length})
          </button>
          <button
            type="button"
            className={`deal-filter-pill ${selectedCategory === 'smartphones' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('smartphones')}
          >
            📱 Smartphones
          </button>
          <button
            type="button"
            className={`deal-filter-pill ${selectedCategory === 'laptops' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('laptops')}
          >
            💻 Laptops &amp; Macs
          </button>
          <button
            type="button"
            className={`deal-filter-pill ${selectedCategory === 'tvs' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('tvs')}
          >
            📺 4K Smart TVs
          </button>
          <button
            type="button"
            className={`deal-filter-pill ${selectedCategory === 'appliances' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('appliances')}
          >
            ❄️ Inverter Appliances
          </button>
        </div>

        {/* Discounted Product Grid */}
        <div className="deals-products-wrapper">
          {loading ? (
            <LoadingSpinner text="Loading verified electronics deals..." />
          ) : filteredProducts.length === 0 ? (
            <div className="empty-deals-box text-center">
              <Percent size={48} className="text-muted" />
              <h3>No deals in this category right now</h3>
              <p>Check back shortly or view all discounted electronics deals.</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSelectedCategory('all')}
              >
                View All Deals
              </button>
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DealsPage;
