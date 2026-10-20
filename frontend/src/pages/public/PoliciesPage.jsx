import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ShieldCheck, FileText, Truck, RotateCcw, AlertTriangle } from 'lucide-react';

const PoliciesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || 'shipping';
  const [activeTab, setActiveTab] = useState(tabParam);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['shipping', 'returns', 'privacy', 'terms'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="policies-page-container">
      <div className="container">
        {/* Header */}
        <div className="policies-hero text-center">
          <span className="section-eyebrow">Customer Policies &amp; Terms</span>
          <h1 className="policies-hero-title">ElectroMart Store Policies</h1>
          <p className="policies-hero-desc">
            Learn about our shipping procedures, 7-day replacement guarantee, privacy commitments, and terms of service.
          </p>
        </div>

        {/* Academic Demo Disclaimer Banner */}
        <div className="policy-disclaimer-alert">
          <AlertTriangle size={24} className="alert-icon" />
          <div className="alert-text">
            <strong>Demonstration Policy Notice (College Mini Project)</strong>
            <p>
              These policies are formulated for academic demonstration and evaluation purposes to show compliance with Indian e-commerce standards, consumer protection norms, and IT security best practices.
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="policies-tabs-nav">
          <button
            type="button"
            className={`policy-tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => handleTabChange('shipping')}
          >
            <Truck size={18} />
            <span>Shipping &amp; Delivery</span>
          </button>

          <button
            type="button"
            className={`policy-tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
            onClick={() => handleTabChange('returns')}
          >
            <RotateCcw size={18} />
            <span>Returns &amp; Cancellations</span>
          </button>

          <button
            type="button"
            className={`policy-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => handleTabChange('privacy')}
          >
            <ShieldCheck size={18} />
            <span>Privacy Policy</span>
          </button>

          <button
            type="button"
            className={`policy-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => handleTabChange('terms')}
          >
            <FileText size={18} />
            <span>Terms of Service</span>
          </button>
        </div>

        {/* Policy Content Body */}
        <div className="policy-document-card">
          {/* 1. Shipping & Delivery Policy */}
          {activeTab === 'shipping' && (
            <div className="policy-pane">
              <h2>Shipping and Delivery Policy</h2>
              <p className="last-updated">Last Updated: October 2026</p>

              <h3>1. Delivery Coverage &amp; Logistics Partners</h3>
              <p>
                ElectroMart delivers consumer electronic goods across all states and union territories of India through verified logistics partners with specialized electronics handling capabilities.
              </p>

              <h3>2. Shipping Rates</h3>
              <ul>
                <li><strong>Orders with Subtotal ₹999 and above:</strong> 100% FREE Delivery across India.</li>
                <li><strong>Orders under ₹999:</strong> A nominal flat shipping charge of ₹99 is added at checkout.</li>
              </ul>

              <h3>3. Delivery Timelines</h3>
              <ul>
                <li><strong>Tier 1 Metro Hubs (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai, Kolkata):</strong> 24 to 48 business hours.</li>
                <li><strong>Tier 2 and Tier 3 Indian Cities:</strong> 3 to 5 business days.</li>
                <li><strong>Remote and Island Regions:</strong> 5 to 7 business days.</li>
              </ul>

              <h3>4. Order Tracking</h3>
              <p>
                Upon order confirmation, a unique order tracking identifier (e.g. <code>EM-20261017-XXXXX</code>) is generated and accessible under the customer's <Link to="/orders">My Orders</Link> dashboard with real-time status updates.
              </p>
            </div>
          )}

          {/* 2. Returns & Cancellations Policy */}
          {activeTab === 'returns' && (
            <div className="policy-pane">
              <h2>Returns and Cancellations Policy</h2>
              <p className="last-updated">Last Updated: October 2026</p>

              <h3>1. Order Cancellation Policy</h3>
              <p>
                Customers may cancel an order directly from their account dashboard as long as the order status is in <strong>"Pending"</strong> or <strong>"Confirmed"</strong> state. Once an order enters "Shipped" or "Delivered", it cannot be cancelled via the self-service dashboard.
              </p>
              <p>
                Upon successful cancellation, any stock reserved for that order is immediately credited back to inventory on our backend.
              </p>

              <h3>2. 7-Day Replacement for Defective Units</h3>
              <p>
                All electronic appliances and devices are eligible for a free 7-day replacement in the event of:
              </p>
              <ul>
                <li>Out-of-the-box hardware failure or dead-on-arrival (DOA) units.</li>
                <li>Physical damage sustained during transit (must be reported within 48 hours).</li>
                <li>Wrong model or missing accessories.</li>
              </ul>

              <h3>3. Manufacturer Warranty Claims</h3>
              <p>
                Beyond the 7-day replacement window, all devices are covered under their respective Official Brand Warranty (1 to 2 years) across authorized service centers nationwide.
              </p>
            </div>
          )}

          {/* 3. Privacy Policy */}
          {activeTab === 'privacy' && (
            <div className="policy-pane">
              <h2>Privacy Policy</h2>
              <p className="last-updated">Last Updated: October 2026</p>

              <h3>1. Information We Collect</h3>
              <p>
                When you create an account, purchase products, or contact us, we collect:
              </p>
              <ul>
                <li>Your name, email address, and optional phone number.</li>
                <li>Shipping and delivery addresses (city, state, postal code).</li>
                <li>Order history and wishlist selections.</li>
              </ul>

              <h3>2. Data Security &amp; Password Storage</h3>
              <p>
                We prioritize user privacy and cybersecurity:
              </p>
              <ul>
                <li>Passwords are securely hashed using <strong>bcryptjs</strong> with salt rounds before database storage. Plaintext passwords are never stored or logged.</li>
                <li>Session security is maintained using stateless JSON Web Tokens (JWT).</li>
                <li>Payment credential data (card numbers, CVVs) is NEVER stored on our servers.</li>
              </ul>

              <h3>3. No Third-Party Data Selling</h3>
              <p>
                ElectroMart does not sell, trade, or monetize customer data. Your information is used strictly for order fulfillment, account authentication, and customer service.
              </p>
            </div>
          )}

          {/* 4. Terms of Service */}
          {activeTab === 'terms' && (
            <div className="policy-pane">
              <h2>Terms and Conditions of Service</h2>
              <p className="last-updated">Last Updated: October 2026</p>

              <h3>1. Use of the Platform</h3>
              <p>
                By accessing or using ElectroMart, you agree to comply with all applicable Indian laws, the Information Technology Act 2000, and consumer e-commerce rules.
              </p>

              <h3>2. Pricing &amp; Stock Availability</h3>
              <p>
                All prices are stated in Indian Rupees (₹). While we strive for absolute accuracy, prices and stock availability are subject to real-time verification at checkout. ElectroMart reserves the right to reject orders in cases of stock exhaustion or system error.
              </p>

              <h3>3. User Accounts</h3>
              <p>
                Users are responsible for maintaining the confidentiality of their account credentials. Creating accounts with false identities or attempting unauthorized administrative access is strictly prohibited.
              </p>

              <h3>4. Academic Project Context</h3>
              <p>
                This website is built as an educational full-stack engineering mini project. Demonstration transactions (including test payments and mock orders) do not constitute legally binding commercial deliveries unless deployed in production with licensed payment gateways.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;
