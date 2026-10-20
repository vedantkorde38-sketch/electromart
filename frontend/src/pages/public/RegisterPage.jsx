import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters long', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate(redirect);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header-row text-center">
          <Link to="/" className="auth-brand-logo">
            <img src="/logo.svg" alt="ElectroMart" className="logo-svg-img" />
          </Link>
          <h2 className="auth-heading">Create ElectroMart Account</h2>
          <p className="auth-subheading">Join thousands of Indian electronics shoppers today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group">
            <label htmlFor="reg-name" className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="reg-name"
                name="name"
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                className="form-input with-left-icon"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="reg-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="form-input with-left-icon"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-phone" className="form-label">Mobile Number (Optional)</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                id="reg-phone"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="form-input with-left-icon"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">Password (Min. 6 chars) *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className="form-input with-left-icon with-right-btn"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm" className="form-label">Confirm Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input with-left-icon"
                required
              />
            </div>
          </div>

          <div className="terms-agreement-note">
            By registering, you agree to ElectroMart's{' '}
            <Link to="/policies?tab=terms">Terms of Service</Link> and{' '}
            <Link to="/policies?tab=privacy">Privacy Policy</Link>.
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg btn-auth-submit"
            disabled={loading}
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-prompt text-center">
          <p>
            Already have an account?{' '}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="auth-accent-link">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
