import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  Search,
  MessageCircle,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQS_DATA = [
  {
    category: 'Placing an Order',
    categoryKey: 'orders',
    icon: ShoppingBag,
    items: [
      {
        q: 'How do I place an order on ElectroMart?',
        a: 'Browse our electronics catalog or use the top search bar. Click "Add to Cart" or "Buy Now" on the product details page. In your shopping bag, review your selected items, apply any available discount coupons (e.g. WELCOME10), and click "Proceed to Checkout". Enter or select your delivery address, choose your payment mode (Cash on Delivery or Instant UPI QR), and confirm your order.'
      },
      {
        q: 'Do I need an account to browse and add items to cart?',
        a: 'No! You can browse, search, compare specifications, and add items to your cart as a guest. When you are ready to complete your checkout, you can quickly log in or create an account, and your cart items will automatically sync.'
      },
      {
        q: 'Can I order multiple quantities of an electronic item?',
        a: 'Yes, provided the requested quantity is within our available inventory. Our backend automatically checks real-time warehouse stock levels and reserves your units immediately upon order placement.'
      }
    ]
  },
  {
    category: 'Payments & Pricing',
    categoryKey: 'payments',
    icon: CreditCard,
    items: [
      {
        q: 'What payment methods are supported on ElectroMart?',
        a: 'We support Cash on Delivery (COD) nationwide with zero advance charges, as well as Instant UPI QR Scan & Pay (Google Pay, PhonePe, Paytm, BHIM, CRED) with automated 12-digit UTR banking switch verification.'
      },
      {
        q: 'Are the prices shown in Indian Rupees (₹) and do they include GST?',
        a: 'Yes, all prices displayed across ElectroMart are strictly in Indian Rupees (₹) using official Indian currency formatting and are fully inclusive of all applicable Indian taxes, GST, and electronics customs duties.'
      },
      {
        q: 'How do discount coupons work?',
        a: 'Enter a valid coupon code in the shopping cart (such as WELCOME10 for 10% off or ELECTRO200 for ₹200 off) and click Apply. The discount is calculated against verified coupon rules and subtracted directly from your order total.'
      }
    ]
  },
  {
    category: 'Shipping & Delivery',
    categoryKey: 'shipping',
    icon: Truck,
    items: [
      {
        q: 'What are the delivery charges?',
        a: 'Delivery is 100% FREE on all electronics orders with a subtotal of ₹999 or higher! For orders below ₹999, a nominal express handling fee of ₹99 is applied.'
      },
      {
        q: 'How long does delivery take across India?',
        a: 'From our primary Mumbai corporate fulfillment center, metro cities (Mumbai, Pune, Delhi-NCR, Bengaluru, Hyderabad, Chennai, Kolkata) typically receive deliveries within 24 to 48 hours. Other Indian cities and tier-2 towns receive shipments in 3 to 4 business days.'
      },
      {
        q: 'How is delicate electronic equipment packaged?',
        a: 'All consumer electronics (flagship smartphones, OLED TVs, MacBooks, inverter appliances) are shipped in multi-layer shockproof bubble chambers with tamper-evident security tape to ensure zero transit damage.'
      }
    ]
  },
  {
    category: 'Warranty & Returns',
    categoryKey: 'warranty',
    icon: RotateCcw,
    items: [
      {
        q: 'Do products come with an official manufacturer warranty?',
        a: 'Yes! Every device sold on ElectroMart is brand new, sealed with official manufacturer retail seals, and backed by a minimum 1-Year Brand Warranty valid at all authorized service centers across India. Your order invoice serves as valid proof of purchase.'
      },
      {
        q: 'Can I cancel an order after placing it?',
        a: 'Yes. You can cancel your order directly from your "My Orders" dashboard as long as the status is "Pending" or "Confirmed". Once cancelled, allocated warehouse stock is immediately restored.'
      },
      {
        q: 'What is the 7-day replacement policy?',
        a: 'If your product arrives damaged or exhibits any out-of-the-box hardware defect within 7 days of delivery, contact our technical support team with your order number for an immediate priority replacement.'
      }
    ]
  }
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState('0-0');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter FAQs based on search input and category selection
  const filteredFaqs = useMemo(() => {
    return FAQS_DATA.map((group) => {
      if (selectedCategory !== 'all' && group.categoryKey !== selectedCategory) {
        return null;
      }
      const matchingItems = group.items.filter((item) => {
        if (!searchQuery.trim()) return true;
        const qMatch = item.q.toLowerCase().includes(searchQuery.toLowerCase());
        const aMatch = item.a.toLowerCase().includes(searchQuery.toLowerCase());
        return qMatch || aMatch;
      });
      if (matchingItems.length === 0) return null;
      return { ...group, items: matchingItems };
    }).filter(Boolean);
  }, [searchQuery, selectedCategory]);

  return (
    <div className="faq-page-container ios-faq-page">
      <div className="container">
        {/* Header */}
        <div className="faq-hero text-center">
          <div className="apple-hero-pill-badge" style={{ margin: '0 auto 0.75rem auto' }}>
            <Sparkles size={14} />
            <span>Support Knowledgebase</span>
          </div>
          <h1 className="faq-hero-heading">Frequently Asked Questions</h1>
          <p className="faq-hero-subtext">
            Everything you need to know about purchasing, authentic brand warranties, Mumbai fulfillment, and nationwide express shipping.
          </p>

          {/* iOS Style Search Bar */}
          <div className="faq-search-wrapper">
            <Search size={18} className="faq-search-icon" />
            <input
              type="text"
              placeholder="Search questions (e.g. warranty, delivery, UPI payment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="faq-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="faq-search-clear"
                onClick={() => setSearchQuery('')}
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="faq-category-pills-row">
            <button
              type="button"
              className={`faq-pill-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Topics
            </button>
            <button
              type="button"
              className={`faq-pill-btn ${selectedCategory === 'orders' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('orders')}
            >
              Ordering
            </button>
            <button
              type="button"
              className={`faq-pill-btn ${selectedCategory === 'payments' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('payments')}
            >
              Payments
            </button>
            <button
              type="button"
              className={`faq-pill-btn ${selectedCategory === 'shipping' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('shipping')}
            >
              Shipping
            </button>
            <button
              type="button"
              className={`faq-pill-btn ${selectedCategory === 'warranty' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('warranty')}
            >
              Warranty &amp; Returns
            </button>
          </div>
        </div>

        {/* Categories of FAQs */}
        <div className="faq-groups-stack">
          {filteredFaqs.length === 0 ? (
            <div className="faq-empty-search text-center">
              <HelpCircle size={48} className="text-muted" />
              <h3>No matching questions found</h3>
              <p>Try searching with different keywords or browse all categories.</p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((group, gIdx) => {
              const Icon = group.icon;
              return (
                <div key={group.categoryKey || gIdx} className="faq-category-card">
                  <div className="faq-category-header">
                    <div className="category-icon-box">
                      <Icon size={20} />
                    </div>
                    <h2 className="faq-category-title">{group.category}</h2>
                    <span className="faq-count-badge">{group.items.length} answers</span>
                  </div>

                  <div className="faq-accordion-list">
                    {group.items.map((item, iIdx) => {
                      const uniqueIndex = `${gIdx}-${iIdx}`;
                      const isOpen = openIndex === uniqueIndex;
                      return (
                        <div key={iIdx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                          <button
                            type="button"
                            className="faq-question-btn"
                            onClick={() => setOpenIndex(isOpen ? null : uniqueIndex)}
                            aria-expanded={isOpen}
                          >
                            <span className="question-text">{item.q}</span>
                            <div className="faq-chevron-bubble">
                              <ChevronDown size={16} className={`chevron-faq ${isOpen ? 'rotated' : ''}`} />
                            </div>
                          </button>
                          {isOpen && (
                            <div className="faq-answer-panel">
                              <p>{item.a}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions Apple-style Card */}
        <div className="faq-contact-callout ios-support-card">
          <div className="support-card-left">
            <div className="support-icon-bubble">
              <MessageCircle size={28} />
            </div>
            <div>
              <h3>Still Have Questions?</h3>
              <p>Our dedicated customer support team in Mumbai is available Monday through Saturday (9 AM – 8 PM IST).</p>
            </div>
          </div>
          <div className="support-card-actions">
            <Link to="/contact" className="apple-btn-primary">
              <MessageCircle size={16} />
              <span>Contact Support</span>
            </Link>
            <a href="tel:18001233532" className="apple-btn-secondary">
              <PhoneCall size={16} />
              <span>1800-123-ELECTRO</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
