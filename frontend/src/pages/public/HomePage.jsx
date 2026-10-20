import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Zap,
  Sparkles,
  Award,
  Star,
  Quote
} from 'lucide-react';
import ProductCard from '../../components/products/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AppleHeroSlider from '../../components/home/AppleHeroSlider';
import IosCategoryBar from '../../components/home/IosCategoryBar';
import BrandShowcase from '../../components/home/BrandShowcase';
import FlashDealsTimer from '../../components/home/FlashDealsTimer';
import api from '../../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catsRes, featRes, dealsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products/featured'),
          api.get('/products/deals')
        ]);

        if (catsRes.data?.success) setCategories(catsRes.data.categories);
        if (featRes.data?.success) setFeaturedProducts(featRes.data.products);
        if (dealsRes.data?.success) setDealProducts(dealsRes.data.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const testimonials = [
    {
      id: 1,
      name: 'Aditya Verma',
      location: 'Bengaluru, Karnataka',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'Ordered the Samsung S24 Ultra. Delivered in Bengaluru within 24 hours in pristine tamper-evident packaging. Genuine Indian warranty activated instantly!'
    },
    {
      id: 2,
      name: 'Pooja Iyer',
      location: 'Chennai, Tamil Nadu',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'Super seamless checkout. Applied the WELCOME10 coupon and saved ₹1,000 on my Apple AirPods Pro. Cash on delivery option gave me complete peace of mind.'
    },
    {
      id: 3,
      name: 'Vikram Sengupta',
      location: 'Kolkata, West Bengal',
      role: 'Verified Buyer',
      rating: 5,
      comment: 'The Sony Bravia 55" TV arrived safely with free wall mounting assistance. Transparent Indian Rupee pricing and crystal clear specs made choosing so easy.'
    }
  ];

  return (
    <div className="home-page-container ios-styled-home">
      {/* 1. Apple Keynote Style Hero Slider */}
      <AppleHeroSlider />

      {/* 2. iOS Segmented Horizontal Category Bar */}
      <IosCategoryBar />

      {/* 3. Authorized Brand Showcase Strip */}
      <BrandShowcase />

      {/* 2. Popular Electronics Categories */}
      <section className="section-categories">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Browse by Category</span>
              <h2 className="section-main-title">Explore Electronics That Fit Your Life</h2>
            </div>
            <Link to="/shop" className="btn-link-action">
              View All Categories <ArrowRight size={16} />
            </Link>
          </div>

          <div className="categories-cards-grid">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat._id || cat.slug}
                to={`/category/${cat.slug}`}
                className="category-card"
              >
                <div className="category-img-box">
                  <img
                    src={cat.image || '/placeholder-electronics.svg'}
                    alt={cat.name}
                    className="category-thumb-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-electronics.svg';
                    }}
                  />
                </div>
                <div className="category-info-box">
                  <h3 className="category-title">{cat.name}</h3>
                  <span className="category-explore-link">
                    Explore <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Featured Products */}
      <section className="section-featured">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Handpicked Flagships</span>
              <h2 className="section-main-title">Featured Electronic Devices</h2>
            </div>
            <Link to="/shop?sort=popular" className="btn-link-action">
              View All Featured <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Loading featured devices..." />
          ) : (
            <div className="product-grid">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Special Promotional Banner (Deals Callout) */}
      <section className="banner-deal-highlight">
        <div className="container banner-inner">
          <div className="banner-content">
            <span className="banner-badge">Limited Time Offer</span>
            <h2 className="banner-title">Exclusive Smart Appliances &amp; Gadgets</h2>
            <p className="banner-text">
              Use coupon code <strong className="code-highlight">WELCOME10</strong> at checkout to claim an instant 10% discount on your first order.
            </p>
            <div className="banner-actions">
              <Link to="/deals" className="btn btn-warning btn-lg">
                Grab Deals Today
              </Link>
              <Link to="/shop" className="btn btn-outline-white btn-lg">
                Browse Full Catalog
              </Link>
            </div>
          </div>
          <div className="banner-art-box">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
              alt="Deals Electronics"
              className="banner-art-img"
            />
          </div>
        </div>
      </section>

      {/* 5. Today's Deals with Discount Badges */}
      <section className="section-deals">
        <div className="container">
          <div className="section-header-row">
            <div>
              <span className="section-eyebrow">Top Savings</span>
              <h2 className="section-main-title">Today's Best Electronics Deals</h2>
            </div>
            <Link to="/deals" className="btn-link-action">
              See All Deals <ArrowRight size={16} />
            </Link>
          </div>

          <FlashDealsTimer />

          {loading ? (
            <LoadingSpinner text="Fetching discounted deals..." />
          ) : (
            <div className="product-grid">
              {dealProducts.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Why Shop With Us */}
      <section className="section-features">
        <div className="container">
          <div className="features-header text-center">
            <span className="section-eyebrow">The ElectroMart Difference</span>
            <h2 className="section-main-title">Why Indian Shoppers Trust ElectroMart</h2>
            <p className="section-subtext">
              We exclusively sell genuine consumer electronics backed by official brand warranty and authorized customer service.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-circle icon-blue">
                <ShieldCheck size={28} />
              </div>
              <h3 className="feature-heading">100% Genuine Products</h3>
              <p className="feature-body">
                Sourced directly from verified distributors with authorized manufacturer warranty cards and tax invoices.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle icon-green">
                <Truck size={28} />
              </div>
              <h3 className="feature-heading">Free Express Delivery</h3>
              <p className="feature-body">
                Fast, insured delivery on orders over ₹999 with careful multi-layer shockproof electronics packaging.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle icon-amber">
                <RotateCcw size={28} />
              </div>
              <h3 className="feature-heading">7-Day Replacement</h3>
              <p className="feature-body">
                Peace of mind with our no-hassle technical defect replacement policy and prompt customer support.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-circle icon-purple">
                <Headphones size={28} />
              </div>
              <h3 className="feature-heading">Dedicated Support</h3>
              <p className="feature-body">
                Expert technical support team ready to assist with device specifications, order status, and setup queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="section-testimonials">
        <div className="container">
          <div className="text-center mb-5">
            <span className="section-eyebrow">Customer Feedback</span>
            <h2 className="section-main-title">What Our Customers Say</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((test) => (
              <div key={test.id} className="testimonial-card">
                <Quote size={28} className="quote-icon" />
                <div className="testimonial-stars">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="testimonial-comment">"{test.comment}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{test.name.charAt(0)}</div>
                  <div>
                    <h4 className="author-name">{test.name}</h4>
                    <span className="author-meta">{test.location} • {test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
