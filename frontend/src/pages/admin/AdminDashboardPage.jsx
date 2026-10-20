import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { formatINR } from '../../utils/currency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsRes, chartRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/dashboard/sales')
        ]);

        if (statsRes.data?.success && statsRes.data.stats) {
          setStats(statsRes.data.stats);
        }
        if (chartRes.data?.success && chartRes.data.chartData) {
          setChartData(chartRes.data.chartData);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Aggregating store metrics & analytics..." size="lg" />;
  }

  const customTooltipFormatter = (value, name) => {
    if (name === 'sales') return [formatINR(value), 'Revenue'];
    return [value, 'Orders'];
  };

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Executive Dashboard</h1>
          <p className="admin-page-subtitle">Real-time performance, inventory alerts, and revenue metrics</p>
        </div>
      </div>

      {/* 4 Metric Overview Cards */}
      <div className="admin-stats-grid">
        <div className="metric-card metric-sales">
          <div className="metric-icon-box">
            <span className="inr-symbol-icon">₹</span>
          </div>
          <div className="metric-text-box">
            <span className="metric-label">Total Revenue</span>
            <h3 className="metric-value">{formatINR(stats?.totalSales || 0)}</h3>
            <span className="metric-trend text-success">
              <TrendingUp size={13} /> Active orders (Delivered / Confirmed)
            </span>
          </div>
        </div>

        <div className="metric-card metric-orders">
          <div className="metric-icon-box">
            <ShoppingBag size={24} />
          </div>
          <div className="metric-text-box">
            <span className="metric-label">Total Orders</span>
            <h3 className="metric-value">{stats?.totalOrders || 0}</h3>
            <span className="metric-trend text-primary">All registered purchases</span>
          </div>
        </div>

        <div className="metric-card metric-products">
          <div className="metric-icon-box">
            <Package size={24} />
          </div>
          <div className="metric-text-box">
            <span className="metric-label">Active Products</span>
            <h3 className="metric-value">{stats?.totalProducts || 0}</h3>
            <span className="metric-trend">Across 12 electronic categories</span>
          </div>
        </div>

        <div className="metric-card metric-users">
          <div className="metric-icon-box">
            <Users size={24} />
          </div>
          <div className="metric-text-box">
            <span className="metric-label">Registered Customers</span>
            <h3 className="metric-value">{stats?.totalUsers || 0}</h3>
            <span className="metric-trend">Verified customer accounts</span>
          </div>
        </div>
      </div>

      {/* Sales Analytics Chart */}
      <div className="admin-chart-card">
        <div className="chart-header-row">
          <div>
            <h3 className="chart-title">Revenue &amp; Sales Trajectory</h3>
            <p className="chart-subtitle">Order volume and sales revenue in Indian Rupees (₹)</p>
          </div>
          <span className="chart-badge">Live Analytics</span>
        </div>

        <div className="chart-render-area" style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" stroke="#64748B" fontSize={12} />
              <YAxis
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(val) => `₹${val >= 1000 ? `${Math.round(val / 1000)}k` : val}`}
              />
              <Tooltip formatter={customTooltipFormatter} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#2563EB"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column Tables: Recent Orders & Low Stock Alerts */}
      <div className="admin-dashboard-two-col">
        {/* Left: Recent Orders Table */}
        <div className="admin-card-section">
          <div className="section-title-line">
            <div className="title-with-icon">
              <ShoppingBag size={18} />
              <h3>Recent Customer Orders</h3>
            </div>
            <Link to="/admin/orders" className="btn-link-action">
              View All Orders <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentOrders?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-muted">
                      No customer orders yet.
                    </td>
                  </tr>
                ) : (
                  stats?.recentOrders?.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <Link to={`/admin/orders`} className="order-link-code">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td>
                        <strong>{ord.user?.name || ord.shippingAddress?.fullName}</strong>
                      </td>
                      <td>{formatINR(ord.totalAmount)}</td>
                      <td>
                        <span className={`status-pill pill-${ord.orderStatus.toLowerCase()}`}>
                          {ord.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Low Stock Alert Table */}
        <div className="admin-card-section">
          <div className="section-title-line">
            <div className="title-with-icon">
              <AlertTriangle size={18} className="text-warning" />
              <h3>Low Stock Inventory Alerts</h3>
            </div>
            <Link to="/admin/products" className="btn-link-action">
              Manage Products <ArrowRight size={14} />
            </Link>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Brand</th>
                  <th>Stock</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {stats?.lowStockProducts?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-success">
                      All products currently have healthy inventory levels!
                    </td>
                  </tr>
                ) : (
                  stats?.lowStockProducts?.map((prod) => (
                    <tr key={prod._id}>
                      <td>
                        <div className="table-product-cell">
                          <img
                            src={prod.images?.[0] || '/placeholder-electronics.svg'}
                            alt={prod.name}
                            className="table-mini-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-electronics.svg';
                            }}
                          />
                          <span className="prod-cell-name" title={prod.name}>
                            {prod.name}
                          </span>
                        </div>
                      </td>
                      <td>{prod.brand}</td>
                      <td>
                        <span className={`stock-count-badge ${prod.stock === 0 ? 'zero' : 'low'}`}>
                          {prod.stock} unit(s)
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/products/edit/${prod._id}`} className="btn btn-outline btn-xs">
                          Restock
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
