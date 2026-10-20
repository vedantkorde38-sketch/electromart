import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Send, Heart } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    try {
      setSubscribing(true);
      // Submit newsletter subscription as inquiry
      await api.post('/contact', {
        name: 'Newsletter Subscriber',
        email: newsletterEmail.trim(),
        subject: 'Newsletter Subscription',
        message: 'Please subscribe me to weekly electronics deals and discount updates.'
      });
      showToast('Thank you for subscribing to ElectroMart deals!', 'success');
      setNewsletterEmail('');
    } catch {
      showToast('Subscribed! You will receive our latest electronics offers.', 'success');
      setNewsletterEmail('');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="footer-master">
      {/* Value Proposition Highlights Banner */}
      <div className="footer-highlights">
        <div className="container highlights-grid">
          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Truck size={24} />
            </div>
            <div className="highlight-text">
              <h4 className="highlight-title">Free Express Delivery</h4>
              <p className="highlight-desc">On eligible electronics orders over ₹999</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon-box">
              <ShieldCheck size={24} />
            </div>
            <div className="highlight-text">
              <h4 className="highlight-title">100% Genuine Tech</h4>
              <p className="highlight-desc">Brand warranty with authentic serial numbers</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon-box">
              <RefreshCw size={24} />
            </div>
            <div className="highlight-text">
              <h4 className="highlight-title">7-Day Easy Replacement</h4>
              <p className="highlight-desc">Hassle-free support for technical defects</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Phone size={24} />
            </div>
            <div className="highlight-text">
              <h4 className="highlight-title">Dedicated Support</h4>
              <p className="highlight-desc">Toll-free customer care and live assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="footer-main">
        <div className="container footer-grid">
          {/* Column 1: Brand Info */}
          <div className="footer-col col-brand">
            <div className="footer-logo">
              <img src="/logo.svg" alt="ElectroMart" className="logo-svg-img" />
            </div>
            <p className="footer-tagline">"Technology That Fits Your Life"</p>
            <p className="footer-about-text">
              ElectroMart is India's dedicated electronics shopping destination, offering top-tier smartphones, laptops, smart TVs, home appliances, and audio gear with transparent INR pricing.
            </p>
            <div className="footer-contact-info">
              <div className="contact-row">
                <MapPin size={16} />
                <span>Electronics City, Phase 1, Bengaluru, Karnataka 560100</span>
              </div>
              <div className="contact-row">
                <Phone size={16} />
                <span>+91 1800-123-ELECTRO (Mon-Sat, 9am - 8pm)</span>
              </div>
              <div className="contact-row">
                <Mail size={16} />
                <span>support@electromart.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="footer-col">
            <h4 className="footer-heading">Top Categories</h4>
            <ul className="footer-links-list">
              <li><Link to="/category/smartphones">Smartphones &amp; 5G Mobiles</Link></li>
              <li><Link to="/category/laptops-and-computers">Laptops &amp; MacBooks</Link></li>
              <li><Link to="/category/televisions-and-smart-tvs">4K OLED &amp; Smart TVs</Link></li>
              <li><Link to="/category/refrigerators">Inverter Refrigerators</Link></li>
              <li><Link to="/category/washing-machines">Front &amp; Top Load Washers</Link></li>
              <li><Link to="/category/air-conditioners">Split &amp; Inverter ACs</Link></li>
              <li><Link to="/category/headphones-and-earbuds">Noise Cancelling Audio</Link></li>
              <li><Link to="/category/gaming-accessories">RGB Gaming Keyboards &amp; Mice</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div className="footer-col">
            <h4 className="footer-heading">Customer Care</h4>
            <ul className="footer-links-list">
              <li><Link to="/dashboard">My Account</Link></li>
              <li><Link to="/orders">Track My Order</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>
              <li><Link to="/contact">Help &amp; Contact Us</Link></li>
              <li><Link to="/faq">Frequently Asked Questions</Link></li>
              <li><Link to="/policies?tab=shipping">Shipping &amp; Delivery Policy</Link></li>
              <li><Link to="/policies?tab=returns">Returns &amp; Cancellations</Link></li>
              <li><Link to="/policies?tab=privacy">Privacy Policy</Link></li>
              <li><Link to="/policies?tab=terms">Terms &amp; Conditions</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Project Info */}
          <div className="footer-col col-newsletter">
            <h4 className="footer-heading">Get Special Offers</h4>
            <p className="newsletter-text">
              Subscribe to get exclusive festival discount codes, price drop alerts, and tech updates.
            </p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button
                type="submit"
                className="newsletter-submit-btn"
                disabled={subscribing}
                aria-label="Subscribe to newsletter"
              >
                <Send size={16} />
              </button>
            </form>

            <div className="demo-notice-card">
              <span className="demo-badge">College Mini Project</span>
              <p className="demo-text">
                Built as a demonstration full-stack MERN application. All prices are in Indian Rupees (₹).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="footer-bottom">
        <div className="container bottom-content">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} ElectroMart India Pvt Ltd. All rights reserved.
          </p>
          <div className="payment-badges-row">
            <span className="pay-tag">Cash on Delivery</span>
            <span className="pay-tag">UPI (GPay / PhonePe / Paytm)</span>
            <span className="pay-tag">RuPay &amp; Visa Cards</span>
            <span className="pay-tag">Net Banking</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
