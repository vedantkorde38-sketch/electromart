import React from 'react';
import { ShieldCheck, Cpu, Truck, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="about-page-container">
      <div className="container">
        {/* Hero */}
        <div className="about-hero-section text-center">
          <span className="section-eyebrow">About ElectroMart</span>
          <h1 className="about-hero-heading">Technology That Fits Your Life</h1>
          <p className="about-hero-subtext">
            ElectroMart is India's dedicated online destination specializing exclusively in authentic consumer electronics and home appliances.
          </p>
        </div>

        {/* Story Section */}
        <div className="about-story-grid">
          <div className="story-content-box">
            <h2>Our Purpose &amp; Vision</h2>
            <p>
              In an era crowded with generic marketplaces selling everything from clothing to groceries, electronics buyers face confusion over authorized sellers, inconsistent warranty support, and fluctuating prices.
            </p>
            <p>
              <strong>ElectroMart was built with one sole focus: Consumer Electronics.</strong> We bring transparency, official brand warranties, verified technical specifications, and fair Indian Rupee pricing together in a seamless modern shopping experience.
            </p>
            <div className="story-checklist">
              <div className="checklist-item">
                <CheckCircle2 size={20} className="check-icon" />
                <span>100% Genuine electronics with manufacturer brand seal</span>
              </div>
              <div className="checklist-item">
                <CheckCircle2 size={20} className="check-icon" />
                <span>All Indian Rupee (₹) prices inclusive of applicable GST</span>
              </div>
              <div className="checklist-item">
                <CheckCircle2 size={20} className="check-icon" />
                <span>Full-stack modern MERN architecture for blazing fast performance</span>
              </div>
            </div>
          </div>

          <div className="story-visual-card">
            <img
              src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=700&auto=format&fit=crop&q=80"
              alt="ElectroMart Technology"
              className="about-story-img"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="about-pillars-section">
          <div className="text-center mb-5">
            <span className="section-eyebrow">Our Core Pillars</span>
            <h2>Why Buy Electronics on ElectroMart?</h2>
          </div>

          <div className="pillars-grid">
            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Cpu size={32} />
              </div>
              <h3>Specialized Catalog</h3>
              <p>
                From latest Snapdragon &amp; Apple A17 smartphones to high-efficiency inverter air conditioners and OLED TVs, our catalog is curated by electronics enthusiasts.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <ShieldCheck size={32} />
              </div>
              <h3>Guaranteed Authenticity</h3>
              <p>
                Every device includes a valid manufacturer warranty valid at authorized service centers across all states in India.
              </p>
            </div>

            <div className="pillar-card">
              <div className="pillar-icon-box">
                <Truck size={32} />
              </div>
              <h3>Safe Transit Handling</h3>
              <p>
                Consumer electronics demand delicate shipping. All shipments feature shock-absorbent multi-tier protective packaging.
              </p>
            </div>
          </div>
        </div>

        {/* College Project Badge Notice */}
        <div className="project-academic-notice">
          <Award size={36} className="notice-icon" />
          <div className="notice-content">
            <h4>College Mini Project Demonstration</h4>
            <p>
              ElectroMart is designed and developed as a complete Full-Stack Web Development Mini Project utilizing <strong>React.js (Vite), Express.js, Node.js, MongoDB (Mongoose), JWT Authentication</strong>, and custom responsive CSS. Designed for academic demonstration, viva presentation, and e-commerce software architecture evaluation.
            </p>
            <div className="notice-actions">
              <Link to="/shop" className="btn btn-primary">Browse Catalogue</Link>
              <Link to="/contact" className="btn btn-outline">Contact Developer</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
