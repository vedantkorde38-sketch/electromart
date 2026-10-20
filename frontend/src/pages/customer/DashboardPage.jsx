import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  MapPin,
  Package,
  Heart,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Save,
  LogOut,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const DashboardPage = () => {
  const { user, updateProfile, addAddress, updateAddress, deleteAddress, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses'

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Address modal/form state
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false
  });

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      showToast('Name is required', 'error');
      return;
    }

    try {
      setSavingProfile(true);
      const res = await updateProfile(profileData);
      if (res?.success) {
        setProfileData({ ...profileData, currentPassword: '', newPassword: '' });
      }
    } finally {
      setSavingProfile(false);
    }
  };

  const openAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: user?.addresses?.length === 0
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddress = (addr) => {
    setEditingAddressId(addr._id);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
      isDefault: addr.isDefault
    });
    setIsAddressModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.postalCode) {
      showToast('Please fill out all address fields', 'error');
      return;
    }

    if (editingAddressId) {
      await updateAddress(editingAddressId, addressForm);
    } else {
      await addAddress(addressForm);
    }
    setIsAddressModalOpen(false);
  };

  return (
    <div className="dashboard-page-container">
      <div className="container">
        {/* User Greeting Bar */}
        <div className="dashboard-greeting-banner">
          <div className="greeting-avatar-circle">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="greeting-text">
            <h2>Welcome, {user?.name}!</h2>
            <p>
              {user?.email} • {user?.phone || 'No phone added'}
              {isAdmin && <span className="admin-status-badge ml-2">Administrator</span>}
            </p>
          </div>
          <div className="greeting-actions">
            {isAdmin && (
              <Link to="/admin" className="btn btn-warning btn-sm mr-2">
                <ShieldCheck size={16} /> Admin Portal
              </Link>
            )}
            <button type="button" className="btn btn-outline btn-sm" onClick={logout}>
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="dashboard-stats-strip">
          <Link to="/orders" className="dash-stat-card">
            <Package size={26} className="text-primary" />
            <div>
              <h4>My Orders</h4>
              <span>View purchase history &amp; track orders</span>
            </div>
          </Link>

          <Link to="/wishlist" className="dash-stat-card">
            <Heart size={26} className="text-danger" />
            <div>
              <h4>My Wishlist</h4>
              <span>{user?.wishlist?.length || 0} items saved</span>
            </div>
          </Link>

          <button
            type="button"
            className={`dash-stat-card ${activeTab === 'addresses' ? 'active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            <MapPin size={26} className="text-success" />
            <div>
              <h4>Saved Addresses</h4>
              <span>{user?.addresses?.length || 0} delivery locations</span>
            </div>
          </button>
        </div>

        {/* Tabs & Content */}
        <div className="dashboard-content-layout">
          <div className="dashboard-tabs-sidebar">
            <button
              className={`dash-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              <span>Profile Settings</span>
            </button>

            <button
              className={`dash-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <MapPin size={18} />
              <span>Delivery Addresses</span>
            </button>

            <Link to="/orders" className="dash-tab-btn">
              <Package size={18} />
              <span>My Orders</span>
            </Link>

            <Link to="/wishlist" className="dash-tab-btn">
              <Heart size={18} />
              <span>Wishlist</span>
            </Link>
          </div>

          <div className="dashboard-main-panel">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="dash-panel-card">
                <h3 className="panel-title">Personal Profile Information</h3>
                <form onSubmit={handleProfileSubmit} className="profile-edit-form">
                  <div className="form-row-2">
                    <div className="form-group">
                      <label htmlFor="user-name" className="form-label">Full Name *</label>
                      <input
                        id="user-name"
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="user-email" className="form-label">Email Address (Read Only)</label>
                      <input
                        id="user-email"
                        type="email"
                        value={user?.email || ''}
                        className="form-input disabled-input"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="user-phone" className="form-label">Mobile Number</label>
                    <input
                      id="user-phone"
                      name="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      className="form-input"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="password-update-section">
                    <h4>Change Password (Optional)</h4>
                    <p className="section-hint">Leave blank if you do not wish to change your password.</p>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label htmlFor="curr-password" className="form-label">Current Password</label>
                        <input
                          id="curr-password"
                          name="currentPassword"
                          type="password"
                          value={profileData.currentPassword}
                          onChange={handleProfileChange}
                          className="form-input"
                          placeholder="Required to set new password"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="new-password" className="form-label">New Password (Min. 6 chars)</label>
                        <input
                          id="new-password"
                          name="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={handleProfileChange}
                          className="form-input"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-save-profile"
                    disabled={savingProfile}
                  >
                    <Save size={16} />
                    <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </form>
              </div>
            )}

            {/* 2. Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="dash-panel-card">
                <div className="panel-header-with-btn">
                  <div>
                    <h3 className="panel-title">Saved Delivery Addresses</h3>
                    <p className="panel-desc">Manage shipping locations for quick 1-click checkout</p>
                  </div>
                  <button type="button" className="btn btn-primary btn-sm" onClick={openAddAddress}>
                    <Plus size={16} />
                    <span>Add New Address</span>
                  </button>
                </div>

                {(!user?.addresses || user.addresses.length === 0) ? (
                  <div className="no-address-box text-center py-4">
                    <MapPin size={36} className="text-muted" />
                    <h4>No Addresses Saved</h4>
                    <p>Add a shipping address so you can breeze through checkout.</p>
                    <button type="button" className="btn btn-secondary mt-2" onClick={openAddAddress}>
                      Add Address Now
                    </button>
                  </div>
                ) : (
                  <div className="addresses-cards-grid">
                    {user.addresses.map((addr) => (
                      <div key={addr._id} className={`address-display-box ${addr.isDefault ? 'default' : ''}`}>
                        <div className="address-box-top">
                          <strong className="addr-recipient">{addr.fullName}</strong>
                          {addr.isDefault && <span className="default-chip">Default Address</span>}
                        </div>
                        <p className="addr-street">{addr.street}</p>
                        <p className="addr-location">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="addr-phone">Phone: {addr.phone}</p>

                        <div className="addr-actions-row">
                          <button
                            type="button"
                            className="btn-text-action"
                            onClick={() => openEditAddress(addr)}
                          >
                            <Edit2 size={14} /> Edit
                          </button>
                          <button
                            type="button"
                            className="btn-text-action text-danger"
                            onClick={() => deleteAddress(addr._id)}
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Add/Edit Address Modal */}
        {isAddressModalOpen && (
          <div className="modal-backdrop-overlay" onClick={() => setIsAddressModalOpen(false)}>
            <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsAddressModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleAddressSubmit} className="modal-body-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street / House / Colony *</label>
                  <input
                    type="text"
                    value={addressForm.street}
                    onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input
                      type="text"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input
                      type="text"
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">PIN Code *</label>
                    <input
                      type="text"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  />
                  <span>Make this my default shipping address</span>
                </label>

                <div className="modal-actions-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAddressModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingAddressId ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
