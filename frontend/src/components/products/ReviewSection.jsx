import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const ReviewSection = ({ productId, onRatingUpdated }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/reviews/products/${productId}/reviews`);
      if (data.success && data.reviews) {
        setReviews(data.reviews);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId, fetchReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      showToast('Please provide a review comment', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        const { data } = await api.put(`/reviews/reviews/${editingId}`, {
          rating,
          title: title.trim(),
          comment: comment.trim()
        });
        if (data.success) {
          showToast('Review updated successfully!', 'success');
          setEditingId(null);
        }
      } else {
        const { data } = await api.post(`/reviews/products/${productId}/reviews`, {
          rating,
          title: title.trim(),
          comment: comment.trim()
        });
        if (data.success) {
          showToast('Thank you! Your review has been submitted.', 'success');
        }
      }

      setTitle('');
      setComment('');
      setRating(5);
      fetchReviews();
      if (onRatingUpdated) onRatingUpdated();
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not submit review';
      showToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rev) => {
    setEditingId(rev._id);
    setRating(rev.rating);
    setTitle(rev.title || '');
    setComment(rev.comment || '');
    window.scrollTo({ top: document.getElementById('review-form-anchor')?.offsetTop - 100, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      const { data } = await api.delete(`/reviews/reviews/${id}`);
      if (data.success) {
        showToast('Review deleted', 'info');
        setReviews((prev) => prev.filter((r) => r._id !== id));
        if (onRatingUpdated) onRatingUpdated();
      }
    } catch (err) {
      showToast('Failed to delete review', 'error');
    }
  };

  const myExistingReview = user ? reviews.find((r) => r.user?._id === user._id) : null;

  return (
    <div className="product-reviews-container">
      <div className="reviews-section-header">
        <h3 className="section-title">
          <MessageSquare size={22} />
          Customer Ratings &amp; Reviews ({reviews.length})
        </h3>
      </div>

      <div className="reviews-layout-grid">
        {/* Left Column: Review Form */}
        <div className="review-form-column" id="review-form-anchor">
          <div className="review-form-card">
            <h4 className="form-card-title">
              {editingId ? 'Edit Your Review' : myExistingReview ? 'Your Product Review' : 'Write a Review'}
            </h4>

            {!isAuthenticated ? (
              <div className="login-to-review-box">
                <p>Have you used this product? Share your thoughts with fellow Indian shoppers.</p>
                <Link to="/login" className="btn btn-primary btn-block">
                  Sign In to Write a Review
                </Link>
              </div>
            ) : myExistingReview && !editingId ? (
              <div className="already-reviewed-card">
                <CheckCircle2 size={24} className="text-success" />
                <p>You have already submitted a review for this electronics product.</p>
                <button
                  type="button"
                  onClick={() => handleEdit(myExistingReview)}
                  className="btn btn-outline btn-sm"
                >
                  <Edit2 size={14} /> Edit Your Review
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="review-submission-form">
                {/* Interactive Star Picker */}
                <div className="form-group">
                  <label className="form-label">Your Overall Rating</label>
                  <div className="interactive-stars-picker">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="star-pick-btn"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        aria-label={`Rate ${star} star`}
                      >
                        <Star
                          size={28}
                          fill={(hoverRating || rating) >= star ? '#F59E0B' : 'transparent'}
                          color={(hoverRating || rating) >= star ? '#F59E0B' : '#CBD5E1'}
                        />
                      </button>
                    ))}
                    <span className="rating-desc-pill">
                      {['Terrible', 'Poor', 'Average', 'Very Good', 'Excellent!'][rating - 1]}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="review-title" className="form-label">Review Headline (optional)</label>
                  <input
                    id="review-title"
                    type="text"
                    placeholder="e.g. Outstanding battery and display!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review-comment" className="form-label">Your Detailed Review *</label>
                  <textarea
                    id="review-comment"
                    rows="4"
                    placeholder="What did you like or dislike? How does it perform in daily usage?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="form-textarea"
                    required
                  ></textarea>
                </div>

                <div className="form-actions-row">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : editingId ? 'Update Review' : 'Submit Review'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setEditingId(null);
                        setTitle('');
                        setComment('');
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Reviews List */}
        <div className="reviews-list-column">
          {loading ? (
            <div className="loading-reviews-text">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="no-reviews-box">
              <Star size={36} className="no-reviews-icon" />
              <h4>No Reviews Yet</h4>
              <p>Be the first customer to review this electronic device!</p>
            </div>
          ) : (
            <div className="reviews-cards-stack">
              {reviews.map((rev) => {
                const isOwner = user && rev.user?._id === user._id;
                const canDelete = isOwner || isAdmin;
                return (
                  <div key={rev._id} className="single-review-card">
                    <div className="review-card-header">
                      <div className="reviewer-info-cluster">
                        <div className="reviewer-avatar-mini">
                          {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="reviewer-name-row">
                            <span className="reviewer-name">{rev.user?.name || 'Verified Buyer'}</span>
                            <span className="verified-badge">Verified Purchase</span>
                          </div>
                          <span className="review-date">
                            {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {canDelete && (
                        <div className="review-owner-actions">
                          {isOwner && (
                            <button
                              type="button"
                              className="btn-icon-subtle"
                              onClick={() => handleEdit(rev)}
                              title="Edit review"
                            >
                              <Edit2 size={15} />
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-icon-subtle text-danger"
                            onClick={() => handleDelete(rev._id)}
                            title="Delete review"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="review-rating-line">
                      <RatingStars rating={rev.rating} size={14} showNumber={false} />
                      {rev.title && <h5 className="review-item-headline">{rev.title}</h5>}
                    </div>

                    <p className="review-body-text">{rev.comment}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
