import React from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Laptop,
  Tv,
  Wind,
  Layers,
  Headphones,
  Watch,
  Gamepad2,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

const CATEGORIES = [
  { name: 'All Products', slug: 'all', icon: Sparkles, isAll: true },
  { name: 'Smartphones', slug: 'smartphones', icon: Smartphone },
  { name: 'Laptops', slug: 'laptops-and-computers', icon: Laptop },
  { name: 'Smart TVs', slug: 'televisions-and-smart-tvs', icon: Tv },
  { name: 'Air Conditioners', slug: 'air-conditioners', icon: Wind },
  { name: 'Refrigerators', slug: 'refrigerators', icon: Layers },
  { name: 'Audio & Earbuds', slug: 'headphones-and-earbuds', icon: Headphones },
  { name: 'Smartwatches', slug: 'smartwatches-and-wearables', icon: Watch },
  { name: 'Gaming', slug: 'gaming-accessories', icon: Gamepad2 }
];

const IosCategoryBar = ({ activeSlug = 'all', onSelectCategory }) => {
  return (
    <section className="ios-category-strip-section">
      <div className="container">
        <div className="ios-category-scroll-container">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeSlug === cat.slug;

            if (onSelectCategory) {
              return (
                <button
                  key={cat.slug}
                  type="button"
                  className={`ios-cat-pill ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectCategory(cat.slug)}
                >
                  <div className="ios-cat-icon-bubble">
                    <Icon size={18} />
                  </div>
                  <span className="ios-cat-title">{cat.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={cat.slug}
                to={cat.isAll ? '/shop' : `/category/${cat.slug}`}
                className={`ios-cat-pill ${isActive ? 'active' : ''}`}
              >
                <div className="ios-cat-icon-bubble">
                  <Icon size={18} />
                </div>
                <span className="ios-cat-title">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IosCategoryBar;
