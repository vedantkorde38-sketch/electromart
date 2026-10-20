import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Layers,
  ShoppingBag,
  Users,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'All Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/add', icon: PlusCircle },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Registered Users', path: '/admin/users', icon: Users },
    { label: 'Customer Inquiries', path: '/admin/messages', icon: MessageSquare }
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-portal-wrapper">
      {/* Top Header */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            type="button"
            className="admin-menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/admin" className="admin-brand-link">
            <ShieldCheck size={24} className="shield-icon" />
            <span className="admin-title">ElectroMart <strong>Admin Portal</strong></span>
          </Link>
        </div>

        <div className="admin-topbar-right">
          <Link to="/" className="btn btn-outline btn-sm store-link-btn">
            <ArrowLeft size={15} />
            <span>Storefront</span>
          </Link>
          <div className="admin-user-pill">
            <div className="admin-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <span className="admin-name">{user?.name}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-icon-only text-danger"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="admin-main-container">
        {/* Sidebar Nav */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`admin-nav-link ${active ? 'active' : ''}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="admin-sidebar-footer">
            <div className="admin-system-note">
              <span>ElectroMart Operations</span>
              <strong>Enterprise Retail v1.0</strong>
            </div>
          </div>
        </aside>

        {/* Content View */}
        <main className="admin-content-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
