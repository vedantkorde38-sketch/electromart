import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShoppingBag, CreditCard, Truck, ShieldAlert, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      category: 'Placing an Order',
      icon: ShoppingBag,
      items: [
        {
          q: 'How do I place an order on ElectroMart?',
          a: 'Browse our electronics catalog or use the top search bar. Click "Add to Cart" or "Buy Now" on the product details page. In your shopping cart, review your selected items, apply any available discount coupons (e.g. WELCOME10), and click "Proceed to Checkout". Enter or select your delivery address, choose your payment mode (Cash on Delivery or Instant Demo Online Payment), and click "Place Order".'
        },
        {
          q: 'Do I need an account to browse and add items to cart?',
          a: 'No! You can browse, search, and add items to your cart as a guest. When you are ready to complete your checkout, you can quickly log in or create an account, and your guest cart will automatically merge into your account.'
        },
        {
          q: 'Can I order multiple quantities of an electronic item?',
          a: 'Yes, provided the requested quantity is within our available warehouse inventory. Our backend automatically checks real-time stock levels and prevents overselling.'
        }
      ]
    },
    {
      category: 'Payments & Pricing',
      icon: CreditCard,
      items: [
        {
          q: 'What payment methods are supported on ElectroMart?',
          a: 'We support Cash on Delivery (COD) with zero upfront charge, as well as an instant Demo Online Payment simulation (Cards/UPI) designed for demonstration and college viva evaluation.'
        },
        {
          q: 'Are the prices shown in Indian Rupees (₹) and do they include GST?',
          a: 'Yes, all prices displayed across ElectroMart are strictly in Indian Rupees (₹) using official Indian number formatting (lakhs/thousands) and are fully inclusive of all applicable Indian taxes and GST.'
        },
        {
          q: 'How do discount coupons work?',
          a: 'Enter a valid coupon code in the shopping cart (such as WELCOME10 for 10% off or ELECTRO200 for ₹200 off) and click Apply. The discount is calculated on the backend against verified coupon rules and subtracted from your order total.'
        }
      ]
    },
    {
      category: 'Shipping & Delivery',
      icon: Truck,
      items: [
        {
          q: 'What are the delivery charges?',
          a: 'Delivery is 100% FREE on all electronics orders with a subtotal of ₹999 or higher! For orders below ₹999, a nominal shipping fee of ₹99 is applied.'
        },
        {
          q: 'How long does delivery take across India?',
          a: 'Metro cities (Bengaluru, Mumbai, Delhi-NCR, Hyderabad, Chennai, Kolkata) typically receive deliveries within 24 to 48 hours. Other Indian cities and tier-2 regions typically receive shipments in 3 to 5 business days.'
        },
        {
          q: 'How is delicate electronic equipment packaged?',
          a: 'All consumer electronics (smartphones, TVs, laptops, kitchen appliances) are packed with multi-layer shockproof bubble wraps and tamper-evident sealed boxes to prevent any damage during transit.'
        }
      ]
    },
    {
      category: 'Warranty & Returns',
      icon: RotateCcw,
      items: [
        {
          q: 'Do the products come with a manufacturer warranty?',
          a: 'Yes! Every device sold on ElectroMart is brand new, sealed, and backed by a minimum 1-Year Official Manufacturer Warranty valid at authorized service centers across India. Your order invoice serves as proof of purchase.'
        },
        {
          q: 'Can I cancel an order after placing it?',
          a: 'Yes. You can cancel your order from your "My Orders" dashboard as long as the status is "Pending" or "Confirmed". Once cancelled, any allocated stock is immediately restored to our inventory.'
        },
        {
          q: 'What is the 7-day replacement policy?',
          a: 'If your product arrives damaged or exhibits an out-of-the-box hardware defect within 7 days of delivery, contact our support team with your order number for an immediate replacement.'
        }
      ]
    }
  ];

  return (
    <div className="faq-page-container">
      <div className="container">
        {/* Header */}
        <div className="faq-hero text-center">
          <span className="section-eyebrow">Frequently Asked Questions</span>
          <h1 className="faq-hero-heading">How Can We Help You?</h1>
          <p className="faq-hero-subtext">
            Find quick answers to common questions about shopping, payments, warranty, delivery, and returns on ElectroMart.
          </p>
        </div>

        {/* Categories of FAQs */}
        <div className="faq-groups-stack">
          {faqs.map((group, gIdx) => {
            const Icon = group.icon;
            return (
              <div key={gIdx} className="faq-category-card">
                <div className="faq-category-header">
                  <div className="category-icon-box">
                    <Icon size={22} />
                  </div>
                  <h2 className="faq-category-title">{group.category}</h2>
                </div>

                <div className="faq-accordion-list">
                  {group.items.map((item, iIdx) => {
                    const uniqueIndex = `${gIdx}-${iIdx}`;
                    const isOpen = openIndex === uniqueIndex;
                    return (
                      <div key={iIdx} className={`faq-accordion-item ${isOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="faq-question-btn"
                          onClick={() => setOpenIndex(isOpen ? null : uniqueIndex)}
                          aria-expanded={isOpen}
                        >
                          <span className="question-text">{item.q}</span>
                          <ChevronDown size={18} className={`chevron-faq ${isOpen ? 'rotated' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="faq-answer-panel">
                            <p>{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="faq-contact-callout">
          <HelpCircle size={36} />
          <div>
            <h3>Still Have Questions?</h3>
            <p>Our customer support team is available Monday through Saturday to assist you.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
