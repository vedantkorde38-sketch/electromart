import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const ContactPage = () => {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await api.post('/contact', formData);
      if (data.success) {
        setSubmitted(true);
        showToast('Your message has been sent successfully!', 'success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send message. Please try again.';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container">
      <div className="container">
        {/* Header */}
        <div className="contact-hero-header text-center">
          <span className="section-eyebrow">Customer Support &amp; Enquiries</span>
          <h1 className="contact-hero-title">Get in Touch with ElectroMart</h1>
          <p className="contact-hero-subtitle">
            Have questions about a smartphone, TV specs, shipping status, or warranties? Our technical support team is here to assist you.
          </p>
        </div>

        <div className="contact-layout-grid">
          {/* Left Column: Contact Details Cards */}
          <div className="contact-info-cards-stack">
            <div className="info-card">
              <div className="info-icon-box">
                <Phone size={24} />
              </div>
              <div>
                <h4>Customer Helpline</h4>
                <p>Toll Free: 1800-123-ELECTRO (3532)</p>
                <p>Support Hours: Mon - Sat, 9:00 AM - 8:00 PM IST</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-box">
                <Mail size={24} />
              </div>
              <div>
                <h4>Email Support</h4>
                <p>General Inquiries: support@electromart.com</p>
                <p>Orders &amp; Warranty: orders@electromart.com</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon-box">
                <MapPin size={24} />
              </div>
              <div>
                <h4>Headquarters &amp; Experience Center</h4>
                <p>ElectroMart India Corporate Tower</p>
                <p>One BKC, G-Block, Bandra Kurla Complex</p>
                <p>Bandra (East), Mumbai, Maharashtra 400051, India</p>
              </div>
            </div>

            <div className="support-commitment-card">
              <h4>Average Response Time</h4>
              <p>Online contact inquiries submitted through this form are logged in our database and addressed within 2 to 4 business hours.</p>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="contact-form-column">
            <div className="contact-form-card">
              <h3 className="card-heading">
                <MessageSquare size={20} /> Send Us an Inquiry
              </h3>

              {submitted ? (
                <div className="submission-success-banner">
                  <CheckCircle2 size={42} className="text-success" />
                  <h4>Message Sent Successfully!</h4>
                  <p>
                    Thank you for reaching out. Your inquiry has been registered in our database. Our customer executive will reply to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary mt-3"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-actual-form">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">Full Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">Email Address *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-subject" className="form-label">Subject *</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      placeholder="e.g. Query regarding TV installation / Order tracking"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">Message *</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows="5"
                      placeholder="Describe your inquiry, device model, or order number in detail..."
                      value={formData.message}
                      onChange={handleChange}
                      className="form-textarea"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block btn-lg"
                    disabled={submitting}
                  >
                    <Send size={18} />
                    <span>{submitting ? 'Sending Message...' : 'Submit Inquiry'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
