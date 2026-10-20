import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Banknote,
  CheckCircle,
  Plus,
  ShieldCheck,
  Truck,
  ArrowRight
} from 'lucide-react';
import OrderSummary from '../../components/cart/OrderSummary';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/currency';
import api from '../../services/api';

const CheckoutPage = () => {
  const { user, addAddress } = useAuth();
  const { cartItems, total, coupon, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'ONLINE_DEMO'
  const [submittingOrder, setSubmittingOrder] = useState(false);

  // New address form state
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  // If user has saved addresses, default to the default one
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultIdx = user.addresses.findIndex((a) => a.isDefault);
      setSelectedAddressIndex(defaultIdx > -1 ? defaultIdx : 0);
      setIsAddingNewAddress(false);
    } else {
      setIsAddingNewAddress(true);
    }
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleNewAddressChange = (e) => {
    setNewAddress({ ...newAddress, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.postalCode) {
      showToast('Please complete all required address fields', 'error');
      return;
    }

    const res = await addAddress(newAddress);
    if (res?.success) {
      setIsAddingNewAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    // 1. Validate delivery address
    let activeAddress = null;
    if (isAddingNewAddress) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.postalCode) {
        showToast('Please provide a complete shipping address', 'error');
        return;
      }
      activeAddress = newAddress;
    } else {
      if (!user?.addresses || user.addresses.length === 0) {
        showToast('Please add a delivery address', 'error');
        return;
      }
      activeAddress = user.addresses[selectedAddressIndex];
    }

    try {
      setSubmittingOrder(true);

      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: {
          fullName: activeAddress.fullName,
          phone: activeAddress.phone,
          street: activeAddress.street,
          city: activeAddress.city,
          state: activeAddress.state,
          postalCode: activeAddress.postalCode,
          country: activeAddress.country || 'India'
        },
        paymentMethod,
        couponCode: coupon?.code || null
      };

      const { data } = await api.post('/orders', orderPayload);

      if (data.success && data.order) {
        showToast('Order confirmed successfully!', 'success');
        clearCart();
        navigate(`/order-confirmation/${data.order.orderNumber}`, {
          state: { order: data.order }
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please check stock and try again.';
      showToast(msg, 'error');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div className="checkout-page-container">
      <div className="container">
        <div className="checkout-header text-center">
          <h1 className="checkout-title">Secure Checkout</h1>
          <p className="checkout-subtitle">Complete your electronics purchase in 3 easy steps</p>
        </div>

        <div className="checkout-layout-grid">
          {/* Left Column: Checkout Steps */}
          <div className="checkout-steps-column">
            {/* Step 1: Delivery Address */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-number-circle">1</div>
                <div>
                  <h3 className="step-title">Select Delivery Address</h3>
                  <p className="step-subtitle">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="step-card-body">
                {/* Existing saved addresses list */}
                {user?.addresses && user.addresses.length > 0 && !isAddingNewAddress && (
                  <div className="saved-addresses-grid">
                    {user.addresses.map((addr, idx) => (
                      <label
                        key={addr._id || idx}
                        className={`address-option-card ${selectedAddressIndex === idx ? 'selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressIndex === idx}
                          onChange={() => setSelectedAddressIndex(idx)}
                        />
                        <div className="address-card-info">
                          <div className="address-header-line">
                            <strong>{addr.fullName}</strong>
                            {addr.isDefault && <span className="default-pill">Default</span>}
                          </div>
                          <p className="address-text-street">{addr.street}</p>
                          <p className="address-text-city">
                            {addr.city}, {addr.state} - {addr.postalCode}
                          </p>
                          <p className="address-text-phone">Phone: {addr.phone}</p>
                        </div>
                      </label>
                    ))}

                    <button
                      type="button"
                      className="btn-add-address-card"
                      onClick={() => setIsAddingNewAddress(true)}
                    >
                      <Plus size={20} />
                      <span>Add New Delivery Address</span>
                    </button>
                  </div>
                )}

                {/* Form to enter new address */}
                {isAddingNewAddress && (
                  <form onSubmit={handleSaveAddress} className="new-address-form">
                    <div className="form-row-2">
                      <div className="form-group">
                        <label className="form-label">Full Name *</label>
                        <input
                          name="fullName"
                          type="text"
                          value={newAddress.fullName}
                          onChange={handleNewAddressChange}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Mobile Number *</label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="+91"
                          value={newAddress.phone}
                          onChange={handleNewAddressChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Street Address / Flat / Building *</label>
                      <input
                        name="street"
                        type="text"
                        placeholder="House/Flat No., Road, Landmark"
                        value={newAddress.street}
                        onChange={handleNewAddressChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-row-3">
                      <div className="form-group">
                        <label className="form-label">City *</label>
                        <input
                          name="city"
                          type="text"
                          value={newAddress.city}
                          onChange={handleNewAddressChange}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">State *</label>
                        <input
                          name="state"
                          type="text"
                          value={newAddress.state}
                          onChange={handleNewAddressChange}
                          className="form-input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">PIN Code *</label>
                        <input
                          name="postalCode"
                          type="text"
                          value={newAddress.postalCode}
                          onChange={handleNewAddressChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="address-form-actions">
                      {user?.addresses && user.addresses.length > 0 && (
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setIsAddingNewAddress(false)}
                        >
                          Cancel
                        </button>
                      )}
                      <button type="submit" className="btn btn-primary">
                        Save and Deliver Here
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-number-circle">2</div>
                <div>
                  <h3 className="step-title">Select Payment Mode</h3>
                  <p className="step-subtitle">All transactions are processed in Indian Rupees (₹)</p>
                </div>
              </div>

              <div className="step-card-body">
                <div className="payment-modes-stack">
                  {/* Mode 1: Cash on Delivery */}
                  <label className={`payment-mode-item ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <div className="payment-mode-icon">
                      <Banknote size={26} className="text-success" />
                    </div>
                    <div className="payment-mode-details">
                      <div className="payment-mode-title-row">
                        <strong>Cash on Delivery (COD)</strong>
                        <span className="badge-pill pill-recommended">Recommended for Viva</span>
                      </div>
                      <p className="payment-mode-desc">
                        Pay with cash or UPI to the delivery agent upon receiving your electronic package. No upfront payment required.
                      </p>
                    </div>
                  </label>

                  {/* Mode 2: Demo Online Payment */}
                  <label className={`payment-mode-item ${paymentMethod === 'ONLINE_DEMO' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE_DEMO"
                      checked={paymentMethod === 'ONLINE_DEMO'}
                      onChange={() => setPaymentMethod('ONLINE_DEMO')}
                    />
                    <div className="payment-mode-icon">
                      <CreditCard size={26} className="text-primary" />
                    </div>
                    <div className="payment-mode-details">
                      <div className="payment-mode-title-row">
                        <strong>Instant Demo Online Payment (Cards / UPI)</strong>
                        <span className="badge-pill pill-demo">Simulation</span>
                      </div>
                      <p className="payment-mode-desc">
                        Simulates instant online payment authorization for demonstration purposes without charging real funds.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Order Items Review */}
            <div className="checkout-step-card">
              <div className="step-card-header">
                <div className="step-number-circle">3</div>
                <div>
                  <h3 className="step-title">Review Items in Order</h3>
                  <p className="step-subtitle">{cartItems.length} electronic products</p>
                </div>
              </div>

              <div className="step-card-body">
                <div className="checkout-items-preview-list">
                  {cartItems.map((item) => (
                    <div key={item.product._id} className="preview-item-row">
                      <img
                        src={item.product.images?.[0] || '/placeholder-electronics.svg'}
                        alt={item.product.name}
                        className="preview-item-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-electronics.svg';
                        }}
                      />
                      <div className="preview-item-info">
                        <h5>{item.product.name}</h5>
                        <span className="preview-brand">{item.product.brand}</span>
                      </div>
                      <div className="preview-item-qty">Qty: {item.quantity}</div>
                      <div className="preview-item-price">
                        {formatINR((item.product.price || 0) * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Final CTA */}
          <div className="checkout-summary-column">
            <OrderSummary showCheckoutBtn={false} checkoutStep={true} />

            <div className="final-place-order-box mt-3">
              <button
                type="button"
                className="btn btn-primary btn-block btn-lg btn-place-order"
                disabled={submittingOrder}
                onClick={handlePlaceOrder}
              >
                <span>{submittingOrder ? 'Processing Order...' : `Place Order • ${formatINR(total)}`}</span>
                <ArrowRight size={18} />
              </button>

              <div className="checkout-guarantees">
                <div className="guarantee-line">
                  <ShieldCheck size={16} />
                  <span>Verified 256-Bit SSL Encrypted Checkout</span>
                </div>
                <div className="guarantee-line">
                  <Truck size={16} />
                  <span>Insured Electronics Shockproof Transit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
