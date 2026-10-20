import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductGrid from '../../components/products/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          api.get(`/categories/${slug}`),
          api.get(`/products?category=${slug}&limit=24`)
        ]);

        if (catRes.data?.success) setCategory(catRes.data.category);
        if (prodRes.data?.success) setProducts(prodRes.data.products);
      } catch (err) {
        console.error('Error fetching category page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Loading category products..." />;
  }

  return (
    <div className="category-page-wrapper">
      <div className="container">
        {/* Category Header Banner */}
        <div className="category-hero-card">
          <div className="category-hero-text">
            <span className="category-breadcrumb">
              <Link to="/">Home</Link> &gt; <Link to="/shop">Categories</Link> &gt; {category?.name || slug}
            </span>
            <h1 className="category-hero-title">{category?.name || 'Electronics Category'}</h1>
            <p className="category-hero-desc">
              {category?.description || 'Browse our premium selection of electronic appliances with authentic Indian warranty.'}
            </p>
          </div>
          {category?.image && (
            <div className="category-hero-img-box">
              <img src={category.image} alt={category.name} className="category-hero-img" />
            </div>
          )}
        </div>

        {/* Category Products Grid */}
        <div className="category-products-section">
          <div className="section-header-compact">
            <h2>Available in {category?.name} ({products.length})</h2>
            <Link to={`/shop?category=${slug}`} className="btn-link-action">
              Filter this category &gt;
            </Link>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            emptyTitle={`No products currently in ${category?.name || 'this category'}`}
            emptyDescription="We are restocking new models soon. Check back shortly!"
          />
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
