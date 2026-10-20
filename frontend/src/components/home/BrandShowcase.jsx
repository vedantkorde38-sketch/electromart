import React from 'react';
import { ShieldCheck, Award, CheckCircle2 } from 'lucide-react';

const BRANDS = [
  { name: 'Apple', tag: 'Authorized Reseller' },
  { name: 'Samsung', tag: 'Official Partner' },
  { name: 'Sony', tag: 'Certified Audio/Visual' },
  { name: 'LG', tag: 'Inverter Smart Tech' },
  { name: 'Daikin', tag: 'Climate Partner' },
  { name: 'HP', tag: 'Computing Direct' },
  { name: 'OnePlus', tag: 'Flagship Mobile' },
  { name: 'Dell', tag: 'Authorized Systems' }
];

const BrandShowcase = () => {
  return (
    <section className="apple-brand-showcase-section">
      <div className="container">
        <div className="apple-brand-header">
          <div className="apple-verified-badge">
            <ShieldCheck size={16} />
            <span>100% Brand Authorized Store</span>
          </div>
          <h3 className="apple-brand-title">Official Electronic Partners</h3>
          <p className="apple-brand-sub">All products shipped with official manufacturer warranty and original retail seals.</p>
        </div>

        <div className="apple-brand-grid">
          {BRANDS.map((b) => (
            <div key={b.name} className="apple-brand-card">
              <span className="apple-brand-name">{b.name}</span>
              <span className="apple-brand-tag">{b.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;
