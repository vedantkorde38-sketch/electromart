import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, PackageOpen } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="not-found-page-container">
      <div className="container py-5 text-center">
        <div className="not-found-card">
          <div className="not-found-code">404</div>
          <PackageOpen size={64} className="not-found-icon text-muted" />
          <h1 className="not-found-title">Page or Device Not Found</h1>
          <p className="not-found-desc">
            We couldn't find the electronic device, page, or category you were looking for. It may have moved or been discontinued.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary btn-lg">
              <Home size={18} />
              <span>Back to Home</span>
            </Link>
            <Link to="/shop" className="btn btn-outline btn-lg">
              <Search size={18} />
              <span>Browse All Electronics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
