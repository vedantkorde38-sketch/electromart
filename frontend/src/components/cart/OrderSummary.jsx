import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Tag, X, ArrowRight, Truck } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useCart } from '../../context/CartContext';

const OrderSummary = ({ showCheckoutBtn = true, checkoutStep = false }) => {
  const {
    cartItems,
    itemCount,
    subtotal,
    shippingFee,
    discount,
    total,
    coupon,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplying(true);
    const success = await applyCoupon(couponCode.trim());
    if (success) {
      setCouponCode('');
    }
    setApplying(false);
  };

  const amountNeededForFreeDelivery = Math.max(0, 999 - subtotal);

  return (
    <div className="order-summary-card">
      <h3 className="summary-title">Order Summary</h3>

      {/* Free Shipping Alert Bar */}
      {subtotal > 0 && (
        <div className={`free-shipping-banner ${shippingFee === 0 ? 'achieved' : ''}`}>
          <Truck size={16} />
          {shippingFee === 0 ? (
            <span>You have unlocked <strong>FREE Express Delivery</strong>!</span>
          ) : (
            <span>Add <strong>{formatINR(amountNeededForFreeDelivery)}</strong> more for FREE delivery</span>
          )}
        </div>
      )}

      {/* Price Breakdown */}
      <div className="summary-rows-stack">
        <div className="summary-row">
          <span className="summary-label">Items Subtotal ({itemCount} items)</span>
          <span className="summary-val">{formatINR(subtotal)}</span>
        </div>

        <div className="summary-row">
          <span className="summary-label">Delivery Charges</span>
          <span className="summary-val">
            {shippingFee === 0 ? (
              <span className="text-free">FREE</span>
            ) : (
              formatINR(shippingFee)
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="summary-row row-discount">
            <span className="summary-label">
              Coupon Discount ({coupon?.code})
            </span>
            <span className="summary-val">- {formatINR(discount)}</span>
          </div>
        )}

        <div className="summary-divider"></div>

        <div className="summary-row row-total">
          <span className="total-title">Total Amount</span>
          <span className="total-price-inr">{formatINR(total)}</span>
        </div>
        <p className="inclusive-taxes-note">(Inclusive of all applicable GST)</p>
      </div>

      {/* Coupon Application Box */}
      {!checkoutStep && (
        <div className="coupon-box-section">
          {coupon ? (
            <div className="applied-coupon-pill">
              <div className="pill-left">
                <Tag size={16} />
                <span className="pill-code">{coupon.code}</span>
                <span className="pill-savings">Saved {formatINR(discount)}</span>
              </div>
              <button
                type="button"
                className="remove-coupon-btn"
                onClick={removeCoupon}
                aria-label="Remove coupon"
              >
                <X size={15} />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="coupon-input-form">
              <input
                type="text"
                placeholder="Enter Coupon Code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="coupon-field"
              />
              <button
                type="submit"
                className="btn btn-secondary btn-apply-coupon"
                disabled={applying || !couponCode.trim()}
              >
                {applying ? '...' : 'Apply'}
              </button>
            </form>
          )}

          {/* Quick Demo Coupons Chips */}
          <div className="demo-coupons-hint">
            <span className="hint-label">Available Coupons:</span>
            <div className="coupons-chips-row">
              <button
                type="button"
                className="chip-code"
                onClick={() => applyCoupon('WELCOME10')}
              >
                WELCOME10 (10% OFF)
              </button>
              <button
                type="button"
                className="chip-code"
                onClick={() => applyCoupon('ELECTRO200')}
              >
                ELECTRO200 (₹200 OFF)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout CTA */}
      {showCheckoutBtn && (
        <div className="summary-cta-box">
          <Link
            to="/checkout"
            className={`btn btn-primary btn-block btn-lg btn-checkout ${cartItems.length === 0 ? 'disabled' : ''}`}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </Link>
          <div className="secure-badge-row">
            <ShieldCheck size={16} />
            <span>100% Safe &amp; Secure Indian Checkout</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
