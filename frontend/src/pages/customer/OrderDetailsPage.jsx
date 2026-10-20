import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  XCircle,
  Printer
} from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error('Error fetching order details:', err);
      showToast('Could not load order details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const handleCancelOrder = async () => {
    const reason = window.prompt('Please provide a reason for cancelling this order:');
    if (reason === null) return;

    try {
      setCancelling(true);
      const { data } = await api.patch(`/orders/${order._id}/cancel`, {
        reason: reason || 'Customer requested self-service cancellation'
      });
      if (data.success) {
        showToast('Order has been cancelled successfully', 'info');
        fetchOrderDetails();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order';
      showToast(msg, 'error');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading order information..." size="lg" />;
  }

  if (!order) {
    return (
      <div className="container py-5 text-center">
        <h2>Order Not Found</h2>
        <p>The order you are trying to view does not exist or you do not have permission.</p>
        <Link to="/orders" className="btn btn-primary mt-3">Back to My Orders</Link>
      </div>
    );
  }

  const orderStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];
  const isCancelled = order.orderStatus === 'Cancelled';
  const currentStatusIdx = orderStatuses.indexOf(order.orderStatus);
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <div className="order-details-container">
      <div className="container">
        {/* Back Link & Header */}
        <div className="order-details-header">
          <Link to="/orders" className="btn-back-link">
            <ArrowLeft size={16} />
            <span>Back to All Orders</span>
          </Link>
          <div className="header-meta-flex">
            <div>
              <h1 className="order-details-title">Order #{order.orderNumber}</h1>
              <p className="order-details-date">
                Placed on{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="header-actions-flex">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => window.print()}>
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>
              {canCancel && (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  disabled={cancelling}
                  onClick={handleCancelOrder}
                >
                  <XCircle size={15} />
                  <span>{cancelling ? 'Cancelling...' : 'Cancel Order'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Progress Tracker */}
        <div className="order-tracker-card">
          <h3 className="tracker-heading">Order Status Tracker</h3>
          {isCancelled ? (
            <div className="cancelled-alert-banner">
              <XCircle size={24} className="text-danger" />
              <div>
                <h4>This order was cancelled</h4>
                <p>
                  Reason: {order.cancellationReason || 'Cancelled by customer'} • Cancelled on{' '}
                  {order.cancelledAt ? new Date(order.cancelledAt).toLocaleDateString('en-IN') : 'N/A'}
                </p>
              </div>
            </div>
          ) : (
            <div className="status-timeline-track">
              {orderStatuses.map((st, idx) => {
                const isPassed = idx <= currentStatusIdx;
                const isCurrent = idx === currentStatusIdx;
                return (
                  <div key={st} className={`timeline-step ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="step-circle">
                      {isPassed ? <CheckCircle size={16} /> : <span>{idx + 1}</span>}
                    </div>
                    <span className="step-label">{st}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2-Column Info Grid */}
        <div className="order-details-grid">
          {/* Left Column: Items List */}
          <div className="order-details-items-card">
            <div className="card-header-line">
              <Package size={20} />
              <h3>Items in this Shipment ({order.items.length})</h3>
            </div>
            <div className="order-items-detailed-list">
              {order.items.map((item, idx) => (
                <div key={idx} className="item-detail-row">
                  <img
                    src={item.image || '/placeholder-electronics.svg'}
                    alt={item.name}
                    className="item-detail-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-electronics.svg';
                    }}
                  />
                  <div className="item-detail-desc">
                    <h4 className="item-name">{item.name}</h4>
                    <span className="item-unit-rate">
                      {formatINR(item.price)} per unit
                    </span>
                  </div>
                  <div className="item-detail-qty">Qty: {item.quantity}</div>
                  <div className="item-detail-subtotal">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="order-breakdown-box">
              <div className="calc-row">
                <span>Items Subtotal:</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="calc-row">
                <span>Shipping &amp; Handling:</span>
                <span>{order.shippingFee === 0 ? 'FREE' : formatINR(order.shippingFee)}</span>
              </div>
              {order.discount > 0 && (
                <div className="calc-row text-success">
                  <span>Coupon Discount ({order.couponCode}):</span>
                  <span>- {formatINR(order.discount)}</span>
                </div>
              )}
              <div className="calc-divider"></div>
              <div className="calc-row row-grand-total">
                <strong>Grand Total (Incl. GST):</strong>
                <strong className="text-primary">{formatINR(order.totalAmount)}</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Address and Payment Details */}
          <div className="order-details-side-column">
            {/* Delivery Address Snapshot */}
            <div className="side-detail-card">
              <div className="side-card-header">
                <MapPin size={18} />
                <h4>Delivery Address</h4>
              </div>
              <div className="side-card-body">
                <strong className="customer-full-name">{order.shippingAddress?.fullName}</strong>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.postalCode}
                </p>
                <p>Country: {order.shippingAddress?.country || 'India'}</p>
                <p className="customer-phone-meta">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Snapshot */}
            <div className="side-detail-card">
              <div className="side-card-header">
                <ShieldCheck size={18} />
                <h4>Payment Details</h4>
              </div>
              <div className="side-card-body">
                <div className="payment-meta-row">
                  <span className="meta-label">Payment Mode:</span>
                  <strong>{order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Demo Online Payment'}</strong>
                </div>
                <div className="payment-meta-row">
                  <span className="meta-label">Payment Status:</span>
                  <span className={`status-pill pill-${order.paymentStatus?.toLowerCase()}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="payment-meta-row">
                  <span className="meta-label">Order Reference:</span>
                  <code>{order.orderNumber}</code>
                </div>
              </div>
            </div>

            {/* Support Box */}
            <div className="side-support-card">
              <h4>Need help with this order?</h4>
              <p>For return assistance or technical queries, contact our support team quoting your order number.</p>
              <Link to="/contact" className="btn btn-outline btn-block btn-sm">
                Contact ElectroMart Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
