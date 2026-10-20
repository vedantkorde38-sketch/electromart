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
  ArrowRight,
  QrCode,
  Copy,
  Check,
  X,
  Smartphone
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

  const UPI_ID = 'vedantkorde38@okaxis';
  const PAYEE_NAME = 'ElectroMart';

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('ONLINE_UPI'); // 'ONLINE_UPI' | 'COD'
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Dynamic UPI URL and QR Code image
  const upiUri = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${total}&cu=INR&tn=ElectroMart%20Order`;
  const upiQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}&margin=10`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

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

  const getActiveAddress = () => {
    if (isAddingNewAddress) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.city || !newAddress.postalCode) {
        showToast('Please provide a complete shipping address', 'error');
        return null;
      }
      return newAddress;
    } else {
      if (!user?.addresses || user.addresses.length === 0) {
        showToast('Please add a delivery address', 'error');
        return null;
      }
      return user.addresses[selectedAddressIndex];
    }
  };

  const handlePlaceOrderClick = () => {
    const activeAddress = getActiveAddress();
    if (!activeAddress) return;

    if (paymentMethod === 'ONLINE_UPI') {
      setShowUpiModal(true);
    } else {
      executePlaceOrder('COD', '');
    }
  };

  const executePlaceOrder = async (methodToUse = paymentMethod, utr = transactionId) => {
    const activeAddress = getActiveAddress();
    if (!activeAddress) return;

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
        paymentMethod: methodToUse,
        transactionId: utr ? String(utr).trim() : '',
        couponCode: coupon?.code || null
      };

      const { data } = await api.post('/orders', orderPayload);

      if (data.success && data.order) {
        showToast(
          methodToUse === 'ONLINE_UPI'
            ? 'UPI Payment Verified! Order confirmed successfully!'
            : 'Order confirmed successfully!',
          'success'
        );
        setShowUpiModal(false);
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
                  {/* Mode 1: Instant UPI QR Code */}
                  <label className={`payment-mode-item ${paymentMethod === 'ONLINE_UPI' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="ONLINE_UPI"
                      checked={paymentMethod === 'ONLINE_UPI'}
                      onChange={() => setPaymentMethod('ONLINE_UPI')}
                    />
                    <div className="payment-mode-icon">
                      <QrCode size={26} className="text-primary" />
                    </div>
                    <div className="payment-mode-details">
                      <div className="payment-mode-title-row">
                        <strong>Instant UPI QR Code (GPay / PhonePe / Paytm)</strong>
                        <span className="badge-pill pill-recommended">Instant Confirmation</span>
                      </div>
                      <p className="payment-mode-desc">
                        Scan the dynamic UPI QR code generated for your order using any UPI app. Zero convenience fees.
                      </p>
                    </div>
                  </label>

                  {/* Mode 2: Cash on Delivery */}
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
                      </div>
                      <p className="payment-mode-desc">
                        Pay with cash or UPI to the delivery courier upon receiving your electronic package at your doorstep.
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
                onClick={handlePlaceOrderClick}
              >
                <span>
                  {submittingOrder
                    ? 'Processing Order...'
                    : paymentMethod === 'ONLINE_UPI'
                    ? `Pay with UPI QR • ${formatINR(total)}`
                    : `Place COD Order • ${formatINR(total)}`}
                </span>
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

      {/* UPI QR Payment Modal */}
      {showUpiModal && (
        <div className="modal-backdrop-overlay" onClick={() => !submittingOrder && setShowUpiModal(false)}>
          <div className="upi-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="upi-modal-header">
              <div>
                <h3 className="upi-modal-title">
                  <QrCode size={22} />
                  Scan & Pay via UPI
                </h3>
                <p className="upi-modal-subtitle">Pay securely using any UPI app</p>
              </div>
              <button
                type="button"
                className="upi-modal-close"
                onClick={() => !submittingOrder && setShowUpiModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="upi-modal-body">
              {/* Amount Display */}
              <div className="upi-amount-card">
                <div>
                  <div className="upi-amount-label">Total Payable Amount</div>
                  <small style={{ color: '#475569' }}>Inclusive of all taxes & delivery</small>
                </div>
                <div className="upi-amount-val">{formatINR(total)}</div>
              </div>

              {/* QR Code Container */}
              <div className="upi-qr-card-wrapper">
                <img
                  src={upiQrCodeUrl}
                  alt="ElectroMart UPI QR Code"
                  className="upi-qr-image"
                  loading="eager"
                />
                <div className="upi-qr-hint">
                  <Smartphone size={16} />
                  <span>Scan using GPay, PhonePe, Paytm or BHIM</span>
                </div>
                <div className="upi-apps-row">
                  <span className="upi-app-pill">Google Pay</span>
                  <span className="upi-app-pill">PhonePe</span>
                  <span className="upi-app-pill">Paytm</span>
                  <span className="upi-app-pill">BHIM</span>
                  <span className="upi-app-pill">CRED</span>
                </div>
              </div>

              {/* UPI ID Box with Copy Button */}
              <div className="upi-id-copy-box">
                <div>
                  <div className="upi-id-label">Payee UPI ID ({PAYEE_NAME})</div>
                  <div className="upi-id-value">{UPI_ID}</div>
                </div>
                <button
                  type="button"
                  className={`btn-copy-upi ${copiedUpi ? 'copied' : ''}`}
                  onClick={handleCopyUpi}
                >
                  {copiedUpi ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedUpi ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>

              {/* Optional UTR / Reference No */}
              <div className="upi-utr-group">
                <label className="upi-utr-label">
                  <span>UPI Reference / UTR Number</span>
                  <span className="upi-utr-optional">Optional</span>
                </label>
                <input
                  type="text"
                  className="upi-utr-input"
                  placeholder="e.g. 423849102938 (from UPI payment receipt)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  maxLength={30}
                />
              </div>

              {/* Confirmation CTA */}
              <div className="upi-modal-actions">
                <button
                  type="button"
                  className="btn-confirm-upi"
                  disabled={submittingOrder}
                  onClick={() => executePlaceOrder('ONLINE_UPI', transactionId)}
                >
                  {submittingOrder ? (
                    <span>Verifying & Placing Order...</span>
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      <span>I Have Paid • Confirm Order</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className="btn-cancel-upi"
                  disabled={submittingOrder}
                  onClick={() => setShowUpiModal(false)}
                >
                  Cancel / Choose another payment method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
