import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminProductFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditMode = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    discountPercentage: '',
    stock: 10,
    isFeatured: false,
    images: ['']
  });

  // Dynamic specifications key-value list
  const [specs, setSpecs] = useState([
    { key: 'Warranty', value: '1 Year Manufacturer Warranty' }
  ]);

  // Load categories and product data if edit mode
  useEffect(() => {
    const initData = async () => {
      try {
        const catRes = await api.get('/categories');
        if (catRes.data?.success) {
          setCategories(catRes.data.categories || []);
          if (!isEditMode && catRes.data.categories.length > 0) {
            setFormData((prev) => ({ ...prev, category: catRes.data.categories[0]._id }));
          }
        }

        if (isEditMode) {
          const prodRes = await api.get(`/products/${id}`);
          if (prodRes.data?.success && prodRes.data.product) {
            const p = prodRes.data.product;
            setFormData({
              name: p.name || '',
              brand: p.brand || '',
              category: p.category?._id || p.category || '',
              description: p.description || '',
              price: p.price || '',
              originalPrice: p.originalPrice || '',
              discountPercentage: p.discountPercentage || '',
              stock: p.stock !== undefined ? p.stock : 10,
              isFeatured: !!p.isFeatured,
              images: p.images?.length > 0 ? p.images : ['']
            });

            // Convert specs Map or Object to array of {key, value}
            const specsObj = p.specifications || {};
            const specsArr = Object.entries(specsObj).map(([k, v]) => ({ key: k, value: String(v) }));
            setSpecs(specsArr.length > 0 ? specsArr : [{ key: 'Warranty', value: '1 Year Brand Warranty' }]);
          }
        }
      } catch (err) {
        console.error('Error loading product form data:', err);
        showToast('Failed to load data', 'error');
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [id, isEditMode, showToast]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Specs helpers
  const handleSpecChange = (index, field, value) => {
    const updated = [...specs];
    updated[index][field] = value;
    setSpecs(updated);
  };

  const addSpecRow = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const removeSpecRow = (index) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  // Images helpers
  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImageField = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  // Image file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('image', file);

    try {
      setUploadingImage(true);
      const { data } = await api.post('/products/upload-image', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (data.success && data.imageUrl) {
        showToast('Image uploaded successfully!', 'success');
        setFormData((prev) => ({
          ...prev,
          images: [data.imageUrl, ...prev.images.filter(Boolean)]
        }));
      }
    } catch (err) {
      showToast('Image upload failed', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.category || !formData.description || !formData.price) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    // Build specs object from key-value pairs
    const specificationsObj = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specificationsObj[s.key.trim()] = s.value.trim();
      }
    });

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
      discountPercentage: formData.discountPercentage ? Number(formData.discountPercentage) : 0,
      stock: Number(formData.stock),
      specifications: specificationsObj,
      images: formData.images.filter((img) => img && img.trim())
    };

    try {
      setSubmitting(true);
      if (isEditMode) {
        const { data } = await api.put(`/products/${id}`, payload);
        if (data.success) {
          showToast('Product updated successfully!', 'success');
          navigate('/admin/products');
        }
      } else {
        const { data } = await api.post('/products', payload);
        if (data.success) {
          showToast('Product created successfully!', 'success');
          navigate('/admin/products');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading product form..." size="lg" />;
  }

  return (
    <div className="admin-page-container">
      {/* Top Header */}
      <div className="admin-page-header">
        <Link to="/admin/products" className="btn-back-link">
          <ArrowLeft size={16} />
          <span>Back to Products</span>
        </Link>
        <h1 className="admin-page-title">
          {isEditMode ? `Edit Product: ${formData.name}` : 'Add New Electronics Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="admin-product-form-card">
        {/* Basic Information */}
        <div className="form-section-block">
          <h3 className="section-block-title">Basic Information</h3>

          <div className="form-group">
            <label htmlFor="prod-name" className="form-label">Product Name / Title *</label>
            <input
              id="prod-name"
              name="name"
              type="text"
              placeholder="e.g. Sony Bravia 55-inch 4K Google TV"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label htmlFor="prod-brand" className="form-label">Brand *</label>
              <input
                id="prod-brand"
                name="brand"
                type="text"
                placeholder="e.g. Sony, Apple, Samsung, LG"
                value={formData.brand}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-category" className="form-label">Category *</label>
              <select
                id="prod-category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="prod-desc" className="form-label">Full Product Description *</label>
            <textarea
              id="prod-desc"
              name="description"
              rows="4"
              placeholder="Provide a comprehensive description of the device features, performance, and highlights..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              required
            ></textarea>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="form-section-block">
          <h3 className="section-block-title">Pricing &amp; Inventory (Indian Rupees ₹)</h3>

          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="prod-price" className="form-label">Selling Price (₹) *</label>
              <input
                id="prod-price"
                name="price"
                type="number"
                placeholder="e.g. 54990"
                value={formData.price}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-orig-price" className="form-label">Original / MRP Price (₹)</label>
              <input
                id="prod-orig-price"
                name="originalPrice"
                type="number"
                placeholder="e.g. 69990"
                value={formData.originalPrice}
                onChange={handleChange}
                className="form-input"
                min="0"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prod-stock" className="form-label">Available Stock Quantity *</label>
              <input
                id="prod-stock"
                name="stock"
                type="number"
                placeholder="e.g. 15"
                value={formData.stock}
                onChange={handleChange}
                className="form-input"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
              />
              <span>Mark as Featured Product on Homepage</span>
            </label>
          </div>
        </div>

        {/* Technical Specifications Key-Value Builder */}
        <div className="form-section-block">
          <div className="section-header-flex">
            <div>
              <h3 className="section-block-title">Technical Specifications</h3>
              <p className="section-block-hint">
                Add realistic device specs (e.g., Processor, RAM, Storage, Screen Size, Battery, Compressor, Capacity)
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addSpecRow}
            >
              <Plus size={14} /> Add Spec Row
            </button>
          </div>

          <div className="specs-builder-table">
            {specs.map((s, idx) => (
              <div key={idx} className="spec-input-row">
                <input
                  type="text"
                  placeholder="Feature / Key (e.g. RAM, Screen)"
                  value={s.key}
                  onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                  className="form-input spec-key-field"
                />
                <input
                  type="text"
                  placeholder="Specification Value (e.g. 16 GB LPDDR5X)"
                  value={s.value}
                  onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                  className="form-input spec-val-field"
                />
                <button
                  type="button"
                  className="btn-icon-danger"
                  onClick={() => removeSpecRow(idx)}
                  title="Remove spec"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Product Images */}
        <div className="form-section-block">
          <div className="section-header-flex">
            <div>
              <h3 className="section-block-title">Product Image URLs &amp; Upload</h3>
              <p className="section-block-hint">Specify web image URLs or upload local demonstration images</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={addImageField}
            >
              <Plus size={14} /> Add Image URL
            </button>
          </div>

          {/* Local file upload input */}
          <div className="image-upload-dropzone mb-3">
            <Upload size={20} className="upload-icon" />
            <div>
              <label htmlFor="file-upload-input" className="file-upload-label">
                {uploadingImage ? 'Uploading Image...' : 'Click to Upload Product Image from Computer'}
              </label>
              <input
                id="file-upload-input"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                style={{ display: 'none' }}
              />
              <span className="upload-types-hint">Supports JPG, PNG, WEBP, SVG (Max 5MB)</span>
            </div>
          </div>

          <div className="image-urls-list">
            {formData.images.map((img, idx) => (
              <div key={idx} className="image-url-row">
                <div className="url-input-cluster">
                  <ImageIcon size={16} className="text-muted" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="form-input"
                  />
                </div>
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    className="btn-icon-danger"
                    onClick={() => removeImageField(idx)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="form-submit-footer">
          <Link to="/admin/products" className="btn btn-secondary">
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            <Save size={18} />
            <span>{submitting ? 'Saving Product...' : isEditMode ? 'Update Product' : 'Create Product'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductFormPage;
