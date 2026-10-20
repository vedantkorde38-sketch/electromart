import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No items found',
  description = 'Try adjusting your search or filters to find what you are looking for.',
  actionText = 'Browse All Products',
  actionLink = '/shop',
  onAction = null
}) => {
  return (
    <div className="empty-state-card">
      <div className="empty-state-icon-box">
        <Icon size={48} className="empty-state-icon" />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {onAction ? (
        <button onClick={onAction} className="btn btn-primary empty-state-btn">
          {actionText}
        </button>
      ) : actionLink ? (
        <Link to={actionLink} className="btn btn-primary empty-state-btn">
          {actionText}
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
