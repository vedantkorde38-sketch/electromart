import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const AdminMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/contact');
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error('Failed to load inquiries:', err);
      showToast('Could not load customer messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/contact/${id}/status`, { status });
      if (data.success) {
        showToast('Message status updated', 'success');
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, status } : m))
        );
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Customer Inquiries &amp; Messages</h1>
          <p className="admin-page-subtitle">
            Manage inquiries submitted via the Contact page and support forms ({messages.length})
          </p>
        </div>
      </div>

      <div className="admin-card-section">
        {loading ? (
          <div className="py-5 text-center">
            <LoadingSpinner text="Loading customer messages..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="py-5 text-center text-muted">
            <MessageSquare size={36} className="mb-2" />
            <h4>No customer messages currently in database</h4>
          </div>
        ) : (
          <div className="inquiries-stack">
            {messages.map((msg) => (
              <div key={msg._id} className={`inquiry-card status-${msg.status}`}>
                <div className="inquiry-header-row">
                  <div className="inquiry-sender-meta">
                    <strong>{msg.name}</strong>
                    <span className="sender-email">({msg.email})</span>
                  </div>
                  <div className="inquiry-date-status">
                    <span className="inquiry-date">
                      {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <select
                      value={msg.status}
                      onChange={(e) => handleUpdateStatus(msg._id, e.target.value)}
                      className={`status-select-pill pill-${msg.status}`}
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                    </select>
                  </div>
                </div>

                <h4 className="inquiry-subject">{msg.subject}</h4>
                <p className="inquiry-body-text">{msg.message}</p>

                <div className="inquiry-footer">
                  <a
                    href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject)} - ElectroMart Support`}
                    className="btn btn-outline btn-xs"
                  >
                    <Mail size={13} /> Reply via Email
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessagesPage;
