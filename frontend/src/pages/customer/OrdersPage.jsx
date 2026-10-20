import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, XCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders/my-orders');
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error('Failed to load user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt('Please enter a brief reason for cancellation:');
    if (reason === null) return; // User clicked Cancel in prompt

    try {
      setCancellingId(orderId);
      const { data } = await api.patch(`/orders/${orderId}/cancel`, {
        reason: reason || 'Customer requested self-service cancellation'
      });
      if (data.success) {
        showToast('Order cancelled successfully. Stock has been restored.', 'info');
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not cancel order';
      showToast(msg, 'error');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching your order history..." size="lg" />;
  }

  if (orders.length === 0) {
    return (
      <div className="container py-5">
        <EmptyState
          icon={ShoppingBag}
          title="No Orders Placed Yet"
          description="You haven't purchased any electronic devices yet. Explore our latest flagship deals!"
          actionText="Browse Electronics"
          actionLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="orders-page-container">
      <div className="container">
        <div className="orders-header-row">
          <div>
            <h1 className="orders-title">My Order History</h1>
            <p className="orders-subtitle">Track, view details, and manage your electronic orders</p>
          </div>
        </div>

        <div className="orders-cards-stack">
          {orders.map((order) => {
            const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

            return (
              <div key={order._id} className="customer-order-card">
                {/* Order Top Meta */}
                <div className="order-top-banner">
                  <div className="order-meta-cluster">
                    <span className="order-number-tag">
                      Order: <strong>{order.orderNumber}</strong>
                    </span>
                    <span className="order-date-tag">
                      Placed on{' '}
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="order-total-tag">
                      Total: <strong>{formatINR(order.totalAmount)}</strong>
                    </span>
                  </div>

                  <div className="order-status-pill-box">
                    <span className={`status-pill pill-${order.orderStatus.toLowerCase()}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="order-items-preview-strip">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item-inline">
                      <img
                        src={item.image || '/placeholder-electronics.svg'}
                        alt={item.name}
                        className="order-inline-thumb"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-electronics.svg';
                        }}
                      />
                      <div className="order-inline-details">
                        <h4 className="order-inline-name">{item.name}</h4>
                        <span className="order-inline-price">
                          {formatINR(item.price)} &times; {item.quantity} unit(s)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer Actions */}
                <div className="order-card-footer">
                  <div className="footer-left-info">
                    <span className="order-shipping-hint">
                      Delivering to: {order.shippingAddress?.fullName}, {order.shippingAddress?.city}
                    </span>
                  </div>

                  <div className="footer-actions-group">
                    {canCancel && (
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        disabled={cancellingId === order._id}
                        onClick={() => handleCancelOrder(order._id)}
                      >
                        <XCircle size={15} />
                        <span>{cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}</span>
                      </button>
                    )}

                    <Link to={`/order/${order._id}`} className="btn btn-primary btn-sm">
                      <span>View Order Details</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
