import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserX, UserCheck, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminUsersPage = () => {
  const { user: currentAdmin } = useAuth();
  const { showToast } = useToast();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/admin/users');
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      showToast('Could not load user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    if (user._id === currentAdmin._id) {
      showToast('You cannot deactivate your own administrator account', 'error');
      return;
    }

    const actionName = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${actionName} account for ${user.name}?`)) {
      return;
    }

    try {
      setTogglingId(user._id);
      const { data } = await api.patch(`/admin/users/${user._id}/toggle-status`);
      if (data.success) {
        showToast(data.message, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: data.isActive } : u))
        );
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update account status';
      showToast(msg, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      u.name?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.phone?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Registered Customers &amp; Accounts</h1>
          <p className="admin-page-subtitle">
            Manage {users.length} registered accounts across ElectroMart
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="admin-filter-bar">
        <div className="admin-search-input-box full-width">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search users by name, email, or phone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card-section">
        {loading ? (
          <div className="py-5 text-center">
            <LoadingSpinner text="Fetching user directory..." />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-5 text-center text-muted">
            <Users size={36} className="mb-2" />
            <h4>No user accounts match your search</h4>
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Orders Placed</th>
                  <th>Account Status</th>
                  <th>Registration Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isSelf = u._id === currentAdmin._id;
                  return (
                    <tr key={u._id} className={!u.isActive ? 'table-row-disabled' : ''}>
                      <td>
                        <div className="table-user-cell">
                          <div className="table-user-avatar">
                            {u.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <strong>{u.name}</strong>
                            {isSelf && <span className="self-tag">(You)</span>}
                            {u.phone && <span className="table-user-phone">{u.phone}</span>}
                          </div>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role}`}>
                          {u.role === 'admin' ? 'Administrator' : 'Customer'}
                        </span>
                      </td>
                      <td>
                        <strong>{u.orderCount || 0} order(s)</strong>
                      </td>
                      <td>
                        <span className={`account-status-pill ${u.isActive ? 'active' : 'inactive'}`}>
                          {u.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>
                        {new Date(u.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td>
                        {!isSelf && (
                          <button
                            type="button"
                            className={`btn btn-xs ${u.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                            disabled={togglingId === u._id}
                            onClick={() => handleToggleStatus(u)}
                          >
                            {u.isActive ? (
                              <>
                                <UserX size={13} /> Deactivate
                              </>
                            ) : (
                              <>
                                <UserCheck size={13} /> Activate
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
