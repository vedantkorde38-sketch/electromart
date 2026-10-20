import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      if (data.success && data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        const { data } = await api.put(`/categories/${editingId}`, formData);
        if (data.success) {
          showToast('Category updated successfully', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const { data } = await api.post('/categories', formData);
        if (data.success) {
          showToast('Category created successfully', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Operation failed';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;

    try {
      const { data } = await api.delete(`/categories/${id}`);
      if (data.success) {
        showToast('Category deleted successfully', 'success');
        fetchCategories();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Category Management</h1>
          <p className="admin-page-subtitle">Organize electronics products across major categories</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="admin-card-section">
        {loading ? (
          <div className="py-5 text-center">
            <LoadingSpinner text="Loading categories..." />
          </div>
        ) : (
          <div className="admin-table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id}>
                    <td>
                      <div className="table-product-cell">
                        <img
                          src={cat.image || '/placeholder-electronics.svg'}
                          alt={cat.name}
                          className="table-mini-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/placeholder-electronics.svg';
                          }}
                        />
                        <strong className="prod-cell-name">{cat.name}</strong>
                      </div>
                    </td>
                    <td>
                      <code>{cat.slug}</code>
                    </td>
                    <td className="text-muted">{cat.description || 'No description provided'}</td>
                    <td>
                      <div className="table-action-btns">
                        <button
                          type="button"
                          className="btn-action-icon edit"
                          onClick={() => openEditModal(cat)}
                          title="Edit Category"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          className="btn-action-icon delete"
                          onClick={() => handleDelete(cat._id, cat.name)}
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-dialog-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Category' : 'Create New Category'}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body-form">
              <div className="form-group">
                <label className="form-label">Category Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Smartwatches and Wearables"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief description of the electronics included in this category..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                ></textarea>
              </div>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategoriesPage;
