import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  Sliders,
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import api from '../../services/api';

const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareCount, openCompareModal } = useCompare();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartBouncing, setCartBouncing] = useState(false);

  const prevCountRef = useRef(itemCount);

  useEffect(() => {
    if (itemCount > prevCountRef.current) {
      setCartBouncing(true);
      const timer = setTimeout(() => setCartBouncing(false), 900);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = itemCount;
  }, [itemCount]);

  const categoriesRef = useRef(null);
  const userMenuRef = useRef(null);

  // Sync search input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const kw = params.get('keyword');
    if (kw) {
      setSearchTerm(kw);
    } else if (!location.pathname.includes('/shop')) {
      setSearchTerm('');
    }
  }, [location]);

  // Fetch categories for dropdown
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const { data } = await api.get('/categories');
        if (data.success && data.categories) {
          setCategories(data.categories);
        }
      } catch {
        // Fallback categories list
        setCategories([
          { name: 'Smartphones', slug: 'smartphones' },
          { name: 'Laptops and Computers', slug: 'laptops-and-computers' },
          { name: 'Televisions and Smart TVs', slug: 'televisions-and-smart-tvs' },
          { name: 'Refrigerators', slug: 'refrigerators' },
          { name: 'Washing Machines', slug: 'washing-machines' },
          { name: 'Air Conditioners', slug: 'air-conditioners' },
          { name: 'Kitchen Appliances', slug: 'kitchen-appliances' },
          { name: 'Headphones and Earbuds', slug: 'headphones-and-earbuds' },
          { name: 'Speakers and Soundbars', slug: 'speakers-and-soundbars' },
          { name: 'Cameras and Accessories', slug: 'cameras-and-accessories' },
          { name: 'Smartwatches and Wearables', slug: 'smartwatches-and-wearables' },
          { name: 'Gaming Accessories', slug: 'gaming-accessories' }
        ]);
      }
    };
    fetchCats();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoriesRef.current && !categoriesRef.current.contains(e.target)) {
        setIsCategoriesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsCategoriesOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/shop');
    }
  };

  return (
    <header className="header-master">
      {/* 1. Promotional Top Bar */}
      <div className="promo-topbar">
        <div className="container promo-content">
          <div className="promo-text">
            <Sparkles size={14} className="promo-sparkle" />
            <span>Special Electronics Deals | Free Express Delivery on Orders Over ₹999</span>
          </div>
          <div className="promo-links">
            <Link to="/deals" className="promo-link">Today's Deals</Link>
            <span className="promo-divider">|</span>
            <Link to="/contact" className="promo-link">24/7 Support</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="main-navbar">
        <div className="container nav-content">
          {/* Logo */}
          <Link to="/" className="brand-logo" aria-label="ElectroMart Home">
            <img src="/logo.svg" alt="ElectroMart" className="logo-svg-img" />
          </Link>

          {/* Search Bar */}
          <form className="nav-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search smartphones, laptops, smart TVs, appliances..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="nav-search-input"
              aria-label="Search products"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                &times;
              </button>
            )}
            <button type="submit" className="nav-search-btn" aria-label="Submit search">
              <Search size={18} />
            </button>
          </form>

          {/* User Actions */}
          <div className="nav-actions">
            {/* Compare */}
            <button
              type="button"
              className="action-item compare-header-trigger-btn"
              onClick={openCompareModal}
              aria-label="View Product Comparison"
              title="Compare Electronics"
            >
              <div className="icon-badge-box">
                <Sliders size={22} />
                {compareCount > 0 && <span className="badge-pill count-compare">{compareCount}</span>}
              </div>
              <span className="action-label">Compare</span>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="action-item" aria-label="View Wishlist">
              <div className="icon-badge-box">
                <Heart size={22} />
                {wishlistCount > 0 && <span className="badge-pill">{wishlistCount}</span>}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart with Bounce Micro-Interaction */}
            <Link to="/cart" className={`action-item ${cartBouncing ? 'cart-bouncing' : ''}`} aria-label="View Cart">
              <div className="icon-badge-box">
                <ShoppingCart size={22} className={cartBouncing ? 'icon-wiggle' : ''} />
                {itemCount > 0 && (
                  <span className={`badge-pill count-cart ${cartBouncing ? 'badge-pulse-pop' : ''}`}>
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* User Account Dropdown */}
            <div className="user-dropdown-container" ref={userMenuRef}>
              <button
                className="action-item user-btn"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User Account Menu"
              >
                <div className="user-avatar-circle">
                  <User size={20} />
                </div>
                <div className="user-label-stack">
                  <span className="user-subtext">
                    {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Sign In'}
                  </span>
                  <span className="user-maintext">Account</span>
                </div>
                <ChevronDown size={14} className={`chevron-icon ${isUserMenuOpen ? 'open' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="dropdown-panel user-dropdown-menu">
                  {isAuthenticated ? (
                    <>
                      <div className="dropdown-user-header">
                        <p className="dropdown-user-name">{user?.name}</p>
                        <p className="dropdown-user-email">{user?.email}</p>
                        {isAdmin && <span className="admin-chip">Administrator</span>}
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link to="/dashboard" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                        <User size={16} /> My Profile &amp; Addresses
                      </Link>
                      <Link to="/orders" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                        <Package size={16} /> My Orders
                      </Link>
                      <Link to="/wishlist" className="dropdown-link" onClick={() => setIsUserMenuOpen(false)}>
                        <Heart size={16} /> My Wishlist
                      </Link>
                      {isAdmin && (
                        <>
                          <div className="dropdown-divider"></div>
                          <Link to="/admin" className="dropdown-link admin-link" onClick={() => setIsUserMenuOpen(false)}>
                            <ShieldCheck size={16} /> Admin Portal
                          </Link>
                        </>
                      )}
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-link logout-btn"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <div className="dropdown-guest-box">
                      <p className="guest-welcome-msg">Welcome to ElectroMart!</p>
                      <Link to="/login" className="btn btn-primary btn-block mb-2" onClick={() => setIsUserMenuOpen(false)}>
                        Sign In
                      </Link>
                      <p className="guest-register-hint">
                        New customer? <Link to="/register" onClick={() => setIsUserMenuOpen(false)}>Start here</Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Category Links & Secondary Navigation Bar */}
      <nav className="secondary-navbar">
        <div className="container secondary-content">
          {/* Categories Dropdown Trigger */}
          <div className="categories-dropdown-wrapper" ref={categoriesRef}>
            <button
              className="categories-menu-btn"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              aria-expanded={isCategoriesOpen}
            >
              <Layers size={18} />
              <span>All Categories</span>
              <ChevronDown size={15} className={`chevron-icon ${isCategoriesOpen ? 'open' : ''}`} />
            </button>

            {isCategoriesOpen && (
              <div className="categories-flyout-menu">
                <div className="categories-grid-flyout">
                  {categories.map((cat) => (
                    <Link
                      key={cat._id || cat.slug}
                      to={`/category/${cat.slug}`}
                      className="category-flyout-item"
                      onClick={() => setIsCategoriesOpen(false)}
                    >
                      <span className="cat-bullet"></span>
                      <span className="cat-name">{cat.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Nav Links */}
          <div className="quick-links">
            <Link to="/" className={`quick-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            <Link to="/shop" className={`quick-link ${location.pathname === '/shop' ? 'active' : ''}`}>Shop All</Link>
            <Link to="/deals" className={`quick-link ${location.pathname === '/deals' ? 'active' : ''}`}>
              <Sparkles size={14} className="link-sparkle" /> Deals &amp; Offers
            </Link>
            <Link to="/about" className={`quick-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
            <Link to="/contact" className={`quick-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
            <Link to="/faq" className={`quick-link ${location.pathname === '/faq' ? 'active' : ''}`}>FAQ</Link>
          </div>

          <div className="header-tagline-badge">
            Technology That Fits Your Life
          </div>
        </div>
      </nav>

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <img src="/logo.svg" alt="ElectroMart" className="logo-svg-img" />
              <button
                className="close-drawer-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Search */}
            <form className="mobile-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search electronics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mobile-search-input"
              />
              <button type="submit" className="mobile-search-btn">
                <Search size={16} />
              </button>
            </form>

            <div className="mobile-drawer-links">
              <Link to="/" className="mobile-link">Home</Link>
              <Link to="/shop" className="mobile-link">Shop All Electronics</Link>
              <Link to="/deals" className="mobile-link text-deal">Hot Deals &amp; Discounts</Link>
              <Link to="/about" className="mobile-link">About Us</Link>
              <Link to="/contact" className="mobile-link">Contact Support</Link>
              <Link to="/faq" className="mobile-link">Help &amp; FAQ</Link>
            </div>

            <div className="mobile-section-heading">Categories</div>
            <div className="mobile-categories-list">
              {categories.map((cat) => (
                <Link
                  key={cat._id || cat.slug}
                  to={`/category/${cat.slug}`}
                  className="mobile-cat-link"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="mobile-drawer-footer">
              {isAuthenticated ? (
                <>
                  <div className="mobile-user-greeting">Signed in as {user?.name}</div>
                  <Link to="/dashboard" className="btn btn-secondary btn-block mb-2">My Account</Link>
                  {isAdmin && (
                    <Link to="/admin" className="btn btn-primary btn-block mb-2">Admin Dashboard</Link>
                  )}
                  <button onClick={logout} className="btn btn-outline btn-block">Sign Out</button>
                </>
              ) : (
                <div className="mobile-auth-actions">
                  <Link to="/login" className="btn btn-primary btn-block mb-2">Sign In</Link>
                  <Link to="/register" className="btn btn-outline btn-block">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
