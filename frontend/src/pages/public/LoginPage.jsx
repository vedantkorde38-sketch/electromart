import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Sparkles, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null); // 'customer' | 'admin' | null

  // Read redirect path if redirected from protected route
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'error');
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      showToast(`Welcome back${res.user?.name ? ', ' + res.user.name : ''}!`, 'success');
      if (res.user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      showToast(res.message || 'Invalid email or password', 'error');
    }
  };

  // Quick One-Click Demo Logins for Viva & Evaluation
  const fillCustomerDemo = () => {
    setEmail('customer@electromart.com');
    setPassword('Customer@12345');
    setActiveDemo('customer');
    showToast('Customer demo credentials filled! Click Sign In below.', 'info');
  };

  const fillAdminDemo = () => {
    setEmail('admin@electromart.com');
    setPassword('Admin@12345');
    setActiveDemo('admin');
    showToast('Admin demo credentials filled! Click Sign In below.', 'info');
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
              <div className="ios-auth-icon-bubble">
                <ShieldCheck size={28} className="ios-lock-icon" />
              </div>
            </Link>

            <h1 className="ios-auth-title">Sign In to ElectroMart</h1>
            <p className="ios-auth-subtitle">
              Manage your orders, Apple & premium electronics warranties, and express checkout.
            </p>
          </div>

          {/* Quick One-Click Demo Strip (Curated for Viva Examiner & Quick Tests) */}
          <div className="ios-demo-pills-box">
            <div className="ios-demo-header">
              <Sparkles size={13} className="text-amber-500" />
              <span>1-CLICK QUICK ACCESS DEMO</span>
            </div>
            <div className="ios-demo-pills-grid">
              <button
                type="button"
                className={`ios-demo-pill ${activeDemo === 'customer' ? 'active-customer' : ''}`}
                onClick={fillCustomerDemo}
              >
                <UserCheck size={15} />
                <div className="demo-pill-text">
                  <span className="demo-role-title">Customer Demo</span>
                  <span className="demo-email-sub">customer@electromart.com</span>
                </div>
                {activeDemo === 'customer' && <CheckCircle2 size={14} className="active-check-icon" />}
              </button>

              <button
                type="button"
                className={`ios-demo-pill ${activeDemo === 'admin' ? 'active-admin' : ''}`}
                onClick={fillAdminDemo}
              >
                <Shield size={15} />
                <div className="demo-pill-text">
                  <span className="demo-role-title">Admin Console</span>
                  <span className="demo-email-sub">admin@electromart.com</span>
                </div>
                {activeDemo === 'admin' && <CheckCircle2 size={14} className="active-check-icon" />}
              </button>
            </div>
          </div>

          <div className="ios-auth-divider">
            <span>or sign in with credentials</span>
          </div>

          {/* Main Credentials Form */}
          <form onSubmit={handleSubmit} className="ios-auth-form">
            <div className="ios-field-group">
              <label htmlFor="login-email" className="ios-field-label">
                Email Address
              </label>
              <div className="ios-input-wrapper">
                <Mail size={18} className="ios-input-lead-icon" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (activeDemo) setActiveDemo(null);
                  }}
                  className="ios-text-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="ios-field-group">
              <div className="ios-field-header-row">
                <label htmlFor="login-password" className="ios-field-label">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => showToast('For demo: Customer@12345 or Admin@12345', 'info')}
                  className="ios-forgot-link"
                >
                  Forgot password?
                </button>
              </div>
              <div className="ios-input-wrapper">
                <Lock size={18} className="ios-input-lead-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your account password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (activeDemo) setActiveDemo(null);
                  }}
                  className="ios-text-input"
                  required
                  autoComplete="current-password"
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
            </div>

            {/* Apple Blue Submit Button */}
            <button
              type="submit"
              className="ios-submit-btn"
              disabled={loading}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Create Account Link */}
          <div className="ios-auth-footer-nav text-center">
            <p>
              New to ElectroMart?{' '}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="ios-signup-link"
              >
                Create your account now
              </Link>
            </p>
          </div>

          {/* Bank-Grade Security Trust Ribbon */}
          <div className="ios-auth-security-ribbon">
            <div className="security-ribbon-content">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>256-Bit SSL Encrypted • Mumbai BKC Authorized Server</span>
            </div>
          </div>
        </div>

        {/* Apple-style bottom micro footer */}
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

export default LoginPage;
