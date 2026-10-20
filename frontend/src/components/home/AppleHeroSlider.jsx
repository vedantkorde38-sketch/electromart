import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'Flagship Launch',
    title: 'Titanium. So strong. So light. So Pro.',
    subtitle: 'Experience aerospace-grade titanium, revolutionary A17 Pro & Snapdragon 8 Gen 3 silicon, and next-gen computational optics.',
    highlight: 'From ₹1,19,900* • Up to ₹10,000 Exchange Bonus',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900&auto=format&fit=crop&q=85',
    theme: 'titanium-dark',
    primaryLink: '/shop?category=smartphones',
    primaryText: 'Buy Flagship Phones',
    secondaryLink: '/shop',
    secondaryText: 'Compare Models'
  },
  {
    id: 2,
    tag: 'Supercharged by M3',
    title: 'Lean. Mean. M3 Machine.',
    subtitle: 'MacBook Air sails through work and play. With up to 18 hours of battery life and a stunning Liquid Retina display.',
    highlight: 'From ₹1,04,900* • No-Cost EMI from ₹4,370/mo',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&auto=format&fit=crop&q=85',
    theme: 'aluminum-light',
    primaryLink: '/shop?category=laptops-and-computers',
    primaryText: 'Explore Laptops',
    secondaryLink: '/deals',
    secondaryText: 'Student Offers'
  },
  {
    id: 3,
    tag: 'Smart Climate & Living',
    title: 'Cooling Reimagined. 5-Star Energy Saver.',
    subtitle: 'Daikin Triple-Display Inverter Split ACs & LG Smart Inverter Refrigerators. Instant chill with whisper-quiet operation.',
    highlight: 'Starting ₹25,990 • Free Delivery & Standard Installation',
    image: 'https://images.unsplash.com/photo-1759772238012-9d5ad59ae637?w=900&auto=format&fit=crop&q=85',
    theme: 'frost-ice',
    primaryLink: '/shop?category=air-conditioners',
    primaryText: 'Shop Air Conditioners',
    secondaryLink: '/shop?category=refrigerators',
    secondaryText: 'Smart Refrigerators'
  }
];

const AppleHeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      }, 5500);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div
      className={`apple-hero-container ${slide.theme}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container apple-hero-layout">
        <div className="apple-hero-content">
          <div className="apple-hero-pill-badge">
            <Sparkles size={13} className="sparkle-icon" />
            <span>{slide.tag}</span>
          </div>

          <h1 className="apple-hero-title">{slide.title}</h1>
          <p className="apple-hero-sub">{slide.subtitle}</p>

          <div className="apple-hero-callout">
            <Zap size={15} />
            <span>{slide.highlight}</span>
          </div>

          <div className="apple-hero-actions">
            <Link to={slide.primaryLink} className="apple-btn-primary">
              <span>{slide.primaryText}</span>
              <ArrowRight size={16} />
            </Link>
            <Link to={slide.secondaryLink} className="apple-btn-secondary">
              <span>{slide.secondaryText}</span>
            </Link>
          </div>

          <div className="apple-trust-strip">
            <div className="apple-trust-item">
              <ShieldCheck size={16} />
              <span>Official 1-Yr Brand Warranty</span>
            </div>
            <span className="apple-trust-dot">•</span>
            <div className="apple-trust-item">
              <span>Free Express Delivery Across India</span>
            </div>
          </div>
        </div>

        <div className="apple-hero-visual">
          <div className="apple-hero-img-card">
            <img
              src={slide.image}
              alt={slide.title}
              className="apple-hero-photo"
              key={slide.id}
            />
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <button
        type="button"
        className="apple-slide-arrow arrow-left"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        className="apple-slide-arrow arrow-right"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Segmented Dots Indicator */}
      <div className="apple-dots-track">
        {SLIDES.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            className={`apple-dot-pill ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span className="dot-fill-bar"></span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppleHeroSlider;
