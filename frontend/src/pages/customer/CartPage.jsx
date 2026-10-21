import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2, ShieldCheck } from 'lucide-react';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import TradeInCard from '../../components/tradeIn/TradeInCard';
import EmptyState from '../../components/common/EmptyState';
import { useCart } from '../../context/CartContext';

const CartPage = () => {
  const { cartItems, itemCount, clearCart } = useCart();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page-empty-wrapper">
        <div className="container py-5">
          <EmptyState
            icon={ShoppingCart}
            title="Your Shopping Cart is Empty"
            description="Looks like you haven't added any electronic appliances or gadgets to your cart yet."
            actionText="Start Shopping"
            actionLink="/shop"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <div className="container">
        {/* Cart Page Title Bar */}
        <div className="cart-header-row">
          <div>
            <h1 className="cart-page-title">Shopping Cart</h1>
            <p className="cart-page-subtext">You have <strong>{itemCount}</strong> items in your cart</p>
          </div>
          <button
            type="button"
            className="btn btn-outline btn-sm clear-cart-btn"
            onClick={clearCart}
          >
            <Trash2 size={15} />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* 2-Column Layout: Items List & Order Summary */}
        <div className="cart-layout-grid">
          {/* Left Column: Cart Items Table */}
          <div className="cart-items-column">
            <div className="cart-items-card">
              <div className="cart-table-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
                <span>Action</span>
              </div>
              <div className="cart-items-list-body">
                {cartItems.map((item) => (
                  <CartItem key={item.product._id} item={item} />
                ))}
              </div>
            </div>

            <div className="cart-bottom-actions">
              <Link to="/shop" className="btn btn-outline btn-continue-shopping">
                <ArrowLeft size={16} />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="cart-summary-column">
            <TradeInCard compact={true} />
            <OrderSummary showCheckoutBtn={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
