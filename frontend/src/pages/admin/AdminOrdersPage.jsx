import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingBag, Search, Eye, Filter, CheckCircle, Clock } from 'lucide-react';
import { formatINR } from '../../utils/currency';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const { showToast } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter && statusFilter !== 'All') params.set('status', statusFilter);
      params.set('page', page.toString());
      params.set('limit', '15');

      const { data } = await api.get(`/admin/orders?${params.toString()}`);
      if (data.success) {
        setOrders(data.orders || []);
        setTotalPages(data.pages || 1);
        setTotalOrders(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, showToast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    try {
      setUpdatingStatus(true);
      const { data } = await api.patch(`/admin/orders/${selectedOrder._id}/status`, {
        status: newStatus
      });
      if (data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update order status';
      showToast(msg, 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Orders Management</h1>
          <p className="admin-page-subtitle">
            Track and process {totalOrders} electronics orders placed across India
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by order number (e.g. EM-2026...)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="admin-category-select-box">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="admin-card-section">
        {loading ? (
          <div className="py-5 text-center">
            <LoadingSpinner text="Fetching customer orders..." />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-5 text-center text-muted">
            <ShoppingBag size={36} className="mb-2" />
            <h4>No orders match your filter criteria</h4>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order Ref #</th>
                  <th>Customer Info</th>
                  <th>Items</th>
                  <th>Total Amount</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord._id}>
                    <td>
                      <strong className="order-link-code">{ord.orderNumber}</strong>
                      <span className="order-time-mini">
                        {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong>{ord.shippingAddress?.fullName}</strong>
                        <span className="order-city-mini">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.state}
                        </span>
                        <span className="order-phone-mini">{ord.shippingAddress?.phone}</span>
                      </div>
                    </td>
                    <td>{ord.items?.length || 0} device(s)</td>
                    <td>
                      <strong>{formatINR(ord.totalAmount)}</strong>
                    </td>
                    <td>
                      <span className="pay-method-badge">
                        {ord.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Demo'}
                      </span>
                      <span className={`status-pill pill-${ord.paymentStatus?.toLowerCase()}`}>
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-pill pill-${ord.orderStatus.toLowerCase()}`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        onClick={() => handleOpenStatusModal(ord)}
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="pagination-bar admin-pagination">
            <button
              className="btn btn-secondary btn-sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary btn-sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Order Status & Details Modal */}
      {selectedOrder && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-dialog-box modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Manage Order #{selectedOrder.orderNumber}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body-scroll">
              {/* Order Status Update Controls */}
              <div className="modal-status-update-card">
                <h4>Update Order Fulfillment Status</h4>
                <form onSubmit={handleUpdateStatus} className="status-update-inline-form">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="form-select status-select-field"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing (Packaging in Bengaluru)</option>
                    <option value="Shipped">Shipped (Dispatched to Courier)</option>
                    <option value="Delivered">Delivered (Completed)</option>
                    <option value="Cancelled">Cancelled (Restore Stock)</option>
                  </select>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updatingStatus || newStatus === selectedOrder.orderStatus}
                  >
                    {updatingStatus ? 'Updating...' : 'Update Status'}
                  </button>
                </form>
              </div>

              {/* Items List */}
              <div className="modal-order-items-preview">
                <h4>Purchased Items</h4>
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="modal-item-line">
                    <img
                      src={item.image || '/placeholder-electronics.svg'}
                      alt={item.name}
                      className="modal-item-thumb"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-electronics.svg';
                      }}
                    />
                    <div className="modal-item-text">
                      <strong>{item.name}</strong>
                      <span>{formatINR(item.price)} &times; {item.quantity} unit(s)</span>
                    </div>
                    <div className="modal-item-total">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer and Shipping Details */}
              <div className="modal-details-grid">
                <div className="detail-col">
                  <h4>Delivery Address</h4>
                  <p><strong>{selectedOrder.shippingAddress?.fullName}</strong></p>
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.postalCode}
                  </p>
                  <p>Phone: {selectedOrder.shippingAddress?.phone}</p>
                </div>
                <div className="detail-col">
                  <h4>Financial Breakdown</h4>
                  <p>Subtotal: {formatINR(selectedOrder.subtotal)}</p>
                  <p>Shipping Fee: {selectedOrder.shippingFee === 0 ? 'FREE' : formatINR(selectedOrder.shippingFee)}</p>
                  {selectedOrder.discount > 0 && (
                    <p className="text-success">Discount: -{formatINR(selectedOrder.discount)}</p>
                  )}
                  <p><strong>Total Amount: {formatINR(selectedOrder.totalAmount)}</strong></p>
                </div>
              </div>
            </div>

            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
