import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Package, Printer, ArrowRight, ShieldCheck, Truck, Home } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { triggerConfetti } from '../../utils/confetti';
import OrderTrackingStepper from '../../components/orders/OrderTrackingStepper';
import api from '../../services/api';

const OrderConfirmationPage = () => {
  const { orderNumber } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  // Trigger celebration confetti upon arriving on confirmation page
  useEffect(() => {
    triggerConfetti(4000);
  }, []);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          setLoading(true);
          const { data } = await api.get(`/orders/${orderNumber}`);
          if (data.success && data.order) {
            setOrder(data.order);
          }
        } catch (err) {
          console.error('Error fetching order confirmation:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="confirmation-page-container">
      <div className="container">
        {/* Celebration Header Card */}
        <div className="confirmation-banner-card text-center">
          <div className="success-icon-bubble">
            <CheckCircle2 size={56} className="icon-success" />
          </div>
          <h1 className="confirmation-title">Thank You For Your Order!</h1>
          <p className="confirmation-subtext">
            Your electronics order has been placed successfully and sent to our Mumbai corporate fulfillment center.
          </p>
          <div className="order-number-badge">
            <span>Order Reference:</span>
            <strong>{order?.orderNumber || orderNumber}</strong>
          </div>
        </div>

        {/* Live Delivery Tracking Stepper */}
        <div className="mt-4 mb-4">
          <OrderTrackingStepper
            orderStatus={order?.orderStatus || 'Confirmed'}
            orderDate={order?.createdAt}
          />
        </div>

        {/* Order Details Grid */}
        <div className="confirmation-details-grid">
          {/* Left Column: Items Receipt */}
          <div className="confirmation-receipt-card">
            <div className="receipt-card-header">
              <Package size={20} />
              <h3>Purchased Electronics ({order?.items?.length || 0})</h3>
            </div>

            <div className="receipt-items-list">
              {order?.items?.map((item, idx) => (
                <div key={idx} className="receipt-item-row">
                  <img
                    src={item.image || '/placeholder-electronics.svg'}
                    alt={item.name}
                    className="receipt-item-thumb"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-electronics.svg';
                    }}
                  />
                  <div className="receipt-item-info">
                    <h4>{item.name}</h4>
                    <span className="receipt-item-unit">
                      {formatINR(item.price)} &times; {item.quantity} unit(s)
                    </span>
                  </div>
                  <div className="receipt-item-total">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="receipt-totals-box">
              <div className="totals-row">
                <span>Items Subtotal:</span>
                <span>{formatINR(order?.subtotal || 0)}</span>
              </div>
              <div className="totals-row">
                <span>Delivery Charges:</span>
                <span>{order?.shippingFee === 0 ? 'FREE' : formatINR(order?.shippingFee || 0)}</span>
              </div>
              {order?.discount > 0 && (
                <div className="totals-row text-success">
                  <span>Coupon Discount ({order?.couponCode}):</span>
                  <span>- {formatINR(order.discount)}</span>
                </div>
              )}
              <div className="totals-divider"></div>
              <div className="totals-row row-grand">
                <strong>Grand Total (Inclusive of GST):</strong>
                <strong className="text-primary">{formatINR(order?.totalAmount || 0)}</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery Address & Summary Meta */}
          <div className="confirmation-meta-column">
            {/* Delivery Address Snapshot */}
            <div className="confirmation-info-box">
              <div className="box-header">
                <Truck size={18} />
                <h4>Shipping Address</h4>
              </div>
              <div className="box-body">
                <strong>{order?.shippingAddress?.fullName}</strong>
                <p>{order?.shippingAddress?.street}</p>
                <p>
                  {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.postalCode}
                </p>
                <p>Contact Phone: {order?.shippingAddress?.phone}</p>
                <div className="delivery-estimate-badge">
                  Estimated Delivery: 2 to 4 Business Days
                </div>
              </div>
            </div>

            {/* Payment Snapshot */}
            <div className="confirmation-info-box">
              <div className="box-header">
                <ShieldCheck size={18} />
                <h4>Payment Information</h4>
              </div>
              <div className="box-body">
                <p>
                  Method:{' '}
                  <strong>
                    {order?.paymentMethod === 'COD'
                      ? 'Cash on Delivery (Pay on Receipt)'
                      : order?.paymentMethod === 'ONLINE_UPI'
                      ? 'UPI QR Code Payment'
                      : 'Online Payment (Verified)'}
                  </strong>
                </p>
                {order?.transactionId && (
                  <p>
                    UPI Ref / UTR:{' '}
                    <strong style={{ fontFamily: 'monospace' }}>{order.transactionId}</strong>
                  </p>
                )}
                <p>
                  Status:{' '}
                  <span className={`status-chip chip-${order?.paymentStatus?.toLowerCase()}`}>
                    {order?.paymentStatus}
                  </span>
                </p>
                <p>
                  Order Status:{' '}
                  <span className="status-chip chip-confirmed">{order?.orderStatus}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="confirmation-action-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={handlePrint}
              >
                <Printer size={16} />
                <span>Print Tax Invoice</span>
              </button>

              <Link to="/orders" className="btn btn-outline btn-block">
                <span>View Order History</span>
                <ArrowRight size={16} />
              </Link>

              <Link to="/" className="btn btn-primary btn-block">
                <Home size={16} />
                <span>Return to Home</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
