import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Zap, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const IosBottomTabBar = () => {
  const { itemCount } = useCart();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="ios-bottom-tabbar" aria-label="Mobile Navigation">
      <div className="ios-tabbar-blur-bg"></div>
      <div className="ios-tabbar-items">
        <NavLink
          to="/"
          className={({ isActive }) => `ios-tab-item ${isActive ? 'active' : ''}`}
          end
        >
          <div className="ios-tab-icon-wrapper">
            <Home size={22} strokeWidth={2.2} />
          </div>
          <span className="ios-tab-label">Home</span>
        </NavLink>

        <NavLink
          to="/shop"
          className={({ isActive }) => `ios-tab-item ${isActive ? 'active' : ''}`}
        >
          <div className="ios-tab-icon-wrapper">
            <Compass size={22} strokeWidth={2.2} />
          </div>
          <span className="ios-tab-label">Browse</span>
        </NavLink>

        <NavLink
          to="/deals"
          className={({ isActive }) => `ios-tab-item ${isActive ? 'active' : ''}`}
        >
          <div className="ios-tab-icon-wrapper">
            <Zap size={22} strokeWidth={2.2} />
            <span className="ios-tab-badge-dot"></span>
          </div>
          <span className="ios-tab-label">Deals</span>
        </NavLink>

        <NavLink
          to="/cart"
          className={({ isActive }) => `ios-tab-item ${isActive ? 'active' : ''}`}
        >
          <div className="ios-tab-icon-wrapper">
            <ShoppingBag size={22} strokeWidth={2.2} />
            {itemCount > 0 && (
              <span className="ios-tab-cart-badge">{itemCount > 9 ? '9+' : itemCount}</span>
            )}
          </div>
          <span className="ios-tab-label">Bag</span>
        </NavLink>

        <NavLink
          to={isAuthenticated ? '/dashboard' : '/login'}
          className={({ isActive }) => `ios-tab-item ${isActive ? 'active' : ''}`}
        >
          <div className="ios-tab-icon-wrapper">
            <User size={22} strokeWidth={2.2} />
          </div>
          <span className="ios-tab-label">{isAuthenticated ? 'Account' : 'Sign In'}</span>
        </NavLink>
      </div>
      <div className="ios-home-indicator"></div>
    </nav>
  );
};

export default IosBottomTabBar;
