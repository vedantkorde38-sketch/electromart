import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Read redirect path if redirected from protected route
  const searchParams = new URLSearchParams(location.search);
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  // Quick One-Click Demo Logins for Viva & Evaluation
  const fillCustomerDemo = () => {
    setEmail('customer@electromart.com');
    setPassword('Customer@12345');
  };

  const fillAdminDemo = () => {
    setEmail('admin@electromart.com');
    setPassword('Admin@12345');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header-row text-center">
          <Link to="/" className="auth-brand-logo">
            <img src="/logo.svg" alt="ElectroMart" className="logo-svg-img" />
          </Link>
          <h2 className="auth-heading">Sign In to Your Account</h2>
          <p className="auth-subheading">Access your orders, saved addresses, and wishlist</p>
        </div>

        {/* Demo Login Quick Fill Strip */}
        <div className="demo-credentials-strip">
          <span className="demo-strip-label">Instant 1-Click Access:</span>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn btn-outline btn-sm demo-btn"
              onClick={fillCustomerDemo}
            >
              <UserCheck size={14} /> Quick Customer Login
            </button>
            <button
              type="button"
              className="btn btn-outline btn-sm demo-btn admin-demo-btn"
              onClick={fillAdminDemo}
            >
              <ShieldCheck size={14} /> Quick Admin Login
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form-body">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input with-left-icon"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label-row">
              <label htmlFor="login-password" className="form-label">Password *</label>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg btn-auth-submit"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer-prompt text-center">
          <p>
            Don't have an ElectroMart account?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="auth-accent-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
