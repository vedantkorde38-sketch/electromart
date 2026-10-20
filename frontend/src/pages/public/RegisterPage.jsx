import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, CheckCircle2, Shield } from 'lucide-react';
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

  // Password strength calculation
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return { score: 0, label: '', color: '' };
    if (p.length < 6) return { score: 1, label: 'Too short (min 6)', color: '#ef4444' };
    let score = 1;
    if (p.length >= 8) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score === 2) return { score: 2, label: 'Moderate', color: '#f59e0b' };
    if (score === 3) return { score: 3, label: 'Strong', color: '#10b981' };
    return { score: 4, label: 'Very Strong', color: '#059669' };
  };

  const strength = getPasswordStrength();

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
      showToast('Account created successfully! Welcome to ElectroMart.', 'success');
      navigate(redirect);
    } else {
      showToast(res.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <div className="ios-auth-page">
      {/* Ambient background glows */}
      <div className="ios-auth-ambient-blob blob-1"></div>
      <div className="ios-auth-ambient-blob blob-2"></div>

      <div className="ios-auth-wrapper">
        <div className="ios-auth-card">
          {/* Top Brand & Apple-style Icon Header */}
          <div className="ios-auth-header text-center">
            <Link to="/" className="ios-auth-logo-badge" title="ElectroMart Home">
              <div className="ios-auth-icon-bubble register-bubble">
                <Shield size={28} className="ios-lock-icon" />
              </div>
            </Link>

            <h1 className="ios-auth-title">Create ElectroMart ID</h1>
            <p className="ios-auth-subtitle">
              One account for all your gadgets, doorstep deliveries, and express Apple warranties.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="ios-auth-form">
            <div className="ios-field-group">
              <label htmlFor="reg-name" className="ios-field-label">
                Full Legal Name *
              </label>
              <div className="ios-input-wrapper">
                <User size={18} className="ios-input-lead-icon" />
                <input
                  id="reg-name"
                  name="name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  className="ios-text-input"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="ios-field-group">
              <label htmlFor="reg-email" className="ios-field-label">
                Email Address *
              </label>
              <div className="ios-input-wrapper">
                <Mail size={18} className="ios-input-lead-icon" />
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="ios-text-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="ios-field-group">
              <label htmlFor="reg-phone" className="ios-field-label">
                Mobile Number <span className="field-optional">(For SMS order tracking)</span>
              </label>
              <div className="ios-input-wrapper">
                <Phone size={18} className="ios-input-lead-icon" />
                <input
                  id="reg-phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="ios-text-input"
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="ios-field-group">
              <label htmlFor="reg-password" className="ios-field-label">
                Password *
              </label>
              <div className="ios-input-wrapper">
                <Lock size={18} className="ios-input-lead-icon" />
                <input
                  id="reg-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="ios-text-input"
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="ios-password-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div className="ios-strength-meter">
                  <div className="meter-track">
                    <div
                      className="meter-bar"
                      style={{
                        width: `${(strength.score / 4) * 100}%`,
                        backgroundColor: strength.color
                      }}
                    ></div>
                  </div>
                  <span className="meter-label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="ios-field-group">
              <label htmlFor="reg-confirm" className="ios-field-label">
                Confirm Password *
              </label>
              <div className="ios-input-wrapper">
                <Lock size={18} className="ios-input-lead-icon" />
                <input
                  id="reg-confirm"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="ios-text-input"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Apple style Terms agreement */}
            <div className="ios-terms-box">
              <p>
                By creating an account, you agree to ElectroMart's{' '}
                <Link to="/policies?tab=terms">Terms of Service</Link> and{' '}
                <Link to="/policies?tab=privacy">Privacy Policy</Link>.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="ios-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Creating ElectroMart ID...' : 'Create Account'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Already have an account link */}
          <div className="ios-auth-footer-nav text-center">
            <p>
              Already have an ElectroMart account?{' '}
              <Link
                to={`/login?redirect=${encodeURIComponent(redirect)}`}
                className="ios-signup-link"
              >
                Sign In here
              </Link>
            </p>
          </div>

          {/* Security ribbon */}
          <div className="ios-auth-security-ribbon">
            <div className="security-ribbon-content">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>Certified 256-Bit SSL Protection • Mumbai BKC Hub</span>
            </div>
          </div>
        </div>

        {/* Micro footer */}
        <div className="ios-auth-subfooter">
          <p>© {new Date().getFullYear()} ElectroMart India Ltd. All rights reserved.</p>
          <div className="subfooter-links">
            <Link to="/policies?tab=privacy">Privacy Policy</Link>
            <span>•</span>
            <Link to="/policies?tab=terms">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact">Support Center</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
