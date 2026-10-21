import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Truck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';

// Comprehensive Electronics Trade-In Database for India
const TRADE_IN_CATALOG = {
  smartphones: {
    name: 'Smartphones',
    icon: Smartphone,
    brands: {
      Apple: [
        { model: 'iPhone 15 Pro Max', baseValue: 58000, storage: ['256GB', '512GB', '1TB'] },
        { model: 'iPhone 15 Pro', baseValue: 50000, storage: ['128GB', '256GB', '512GB'] },
        { model: 'iPhone 15', baseValue: 38000, storage: ['128GB', '256GB'] },
        { model: 'iPhone 14 Pro Max', baseValue: 44000, storage: ['128GB', '256GB', '512GB'] },
        { model: 'iPhone 14 Pro', baseValue: 38000, storage: ['128GB', '256GB'] },
        { model: 'iPhone 14', baseValue: 29000, storage: ['128GB', '256GB'] },
        { model: 'iPhone 13 Pro', baseValue: 31000, storage: ['128GB', '256GB'] },
        { model: 'iPhone 13', baseValue: 23500, storage: ['128GB', '256GB'] },
        { model: 'iPhone 12', baseValue: 16500, storage: ['64GB', '128GB'] },
        { model: 'iPhone 11', baseValue: 12000, storage: ['64GB', '128GB'] }
      ],
      Samsung: [
        { model: 'Galaxy S24 Ultra', baseValue: 54000, storage: ['256GB', '512GB'] },
        { model: 'Galaxy S23 Ultra', baseValue: 41000, storage: ['256GB', '512GB'] },
        { model: 'Galaxy S23 / S23+', baseValue: 29000, storage: ['128GB', '256GB'] },
        { model: 'Galaxy S22 Ultra', baseValue: 27000, storage: ['128GB', '256GB'] },
        { model: 'Galaxy Z Fold 5', baseValue: 46000, storage: ['256GB', '512GB'] },
        { model: 'Galaxy Z Flip 5', baseValue: 28000, storage: ['128GB', '256GB'] },
        { model: 'Galaxy S21 FE', baseValue: 14000, storage: ['128GB'] }
      ],
      OnePlus: [
        { model: 'OnePlus 12', baseValue: 34000, storage: ['256GB', '512GB'] },
        { model: 'OnePlus 11 5G', baseValue: 24000, storage: ['128GB', '256GB'] },
        { model: 'OnePlus 10 Pro', baseValue: 18000, storage: ['128GB', '256GB'] },
        { model: 'OnePlus 9 Pro', baseValue: 13500, storage: ['128GB', '256GB'] },
        { model: 'OnePlus Nord 3', baseValue: 11000, storage: ['128GB'] }
      ],
      Google: [
        { model: 'Pixel 8 Pro', baseValue: 36000, storage: ['128GB', '256GB'] },
        { model: 'Pixel 7 Pro', baseValue: 23000, storage: ['128GB', '256GB'] },
        { model: 'Pixel 7a / 7', baseValue: 16000, storage: ['128GB'] },
        { model: 'Pixel 6a', baseValue: 9500, storage: ['128GB'] }
      ]
    }
  },
  laptops: {
    name: 'Laptops',
    icon: Laptop,
    brands: {
      Apple: [
        { model: 'MacBook Pro 16" (M2 Max/Pro)', baseValue: 65000, storage: ['512GB', '1TB'] },
        { model: 'MacBook Pro 14" (M2/M1 Pro)', baseValue: 52000, storage: ['512GB', '1TB'] },
        { model: 'MacBook Air 15" M2', baseValue: 45000, storage: ['256GB', '512GB'] },
        { model: 'MacBook Air 13" M2', baseValue: 39000, storage: ['256GB', '512GB'] },
        { model: 'MacBook Air M1', baseValue: 31000, storage: ['256GB'] },
        { model: 'MacBook Pro 13" (Intel)', baseValue: 19000, storage: ['256GB', '512GB'] }
      ],
      Dell: [
        { model: 'XPS 15 (Core i7/i9)', baseValue: 38000, storage: ['512GB', '1TB'] },
        { model: 'XPS 13 Plus', baseValue: 31000, storage: ['512GB'] },
        { model: 'Inspiron 15 (Core i5/i7)', baseValue: 18000, storage: ['512GB'] }
      ],
      HP: [
        { model: 'Spectre x360', baseValue: 32000, storage: ['512GB', '1TB'] },
        { model: 'Envy 14/15', baseValue: 22000, storage: ['512GB'] },
        { model: 'Pavilion Gaming', baseValue: 19500, storage: ['512GB'] }
      ],
      Lenovo: [
        { model: 'ThinkPad X1 Carbon', baseValue: 33000, storage: ['512GB'] },
        { model: 'Legion 5 Pro Gaming', baseValue: 26000, storage: ['512GB', '1TB'] },
        { model: 'Yoga Slim 7i', baseValue: 21000, storage: ['512GB'] }
      ]
    }
  },
  wearables: {
    name: 'Smartwatches',
    icon: Watch,
    brands: {
      Apple: [
        { model: 'Apple Watch Ultra 2', baseValue: 38000, storage: ['Standard'] },
        { model: 'Apple Watch Ultra', baseValue: 30000, storage: ['Standard'] },
        { model: 'Apple Watch Series 9', baseValue: 20000, storage: ['Standard'] },
        { model: 'Apple Watch Series 8', baseValue: 15500, storage: ['Standard'] },
        { model: 'Apple Watch SE (2nd Gen)', baseValue: 11000, storage: ['Standard'] }
      ],
      Samsung: [
        { model: 'Galaxy Watch 6 Classic', baseValue: 14000, storage: ['Standard'] },
        { model: 'Galaxy Watch 5 Pro', baseValue: 11000, storage: ['Standard'] },
        { model: 'Galaxy Watch 4', baseValue: 6500, storage: ['Standard'] }
      ]
    }
  }
};

const TradeInModal = ({ isOpen, onClose, targetProduct = null }) => {
  const { tradeIn, applyTradeIn, removeTradeIn } = useCart();

  // Step state: 1 = Category & Brand, 2 = Model & Spec, 3 = Condition Diagnostics, 4 = Final Valuation
  const [step, setStep] = useState(1);

  // Form selections
  const [category, setCategory] = useState('smartphones');
  const [brand, setBrand] = useState('Apple');
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState('');

  // Diagnostic questions
  const [conditionPower, setConditionPower] = useState('working'); // 'working' | 'battery_issue' | 'dead'
  const [conditionScreen, setConditionScreen] = useState('flawless'); // 'flawless' | 'scratches' | 'cracked'
  const [conditionBody, setConditionBody] = useState('good'); // 'flawless' | 'good' | 'dents'
  const [hasBoxCharger, setHasBoxCharger] = useState(true);

  // Valuation calculation animation
  const [displayValue, setDisplayValue] = useState(0);

  // Initialize selected model when brand or category changes
  useEffect(() => {
    const brandList = TRADE_IN_CATALOG[category]?.brands[brand] || [];
    if (brandList.length > 0) {
      setSelectedModel(brandList[0]);
      setSelectedStorage(brandList[0].storage[0] || '');
    } else {
      setSelectedModel(null);
      setSelectedStorage('');
    }
  }, [category, brand]);

  // Update storage when model changes
  const handleModelChange = (model) => {
    setSelectedModel(model);
    setSelectedStorage(model.storage[0] || '');
  };

  // Compute final trade-in valuation
  const computeValuation = () => {
    if (!selectedModel) return { base: 0, healthFactor: 1, bonus: 0, boxBonus: 0, finalValue: 0 };

    const base = selectedModel.baseValue;
    let factor = 1.0;

    // Power diagnostic factor
    if (conditionPower === 'battery_issue') factor *= 0.85;
    else if (conditionPower === 'dead') factor *= 0.35;

    // Screen diagnostic factor
    if (conditionScreen === 'scratches') factor *= 0.88;
    else if (conditionScreen === 'cracked') factor *= 0.6;

    // Body diagnostic factor
    if (conditionBody === 'good') factor *= 0.95;
    else if (conditionBody === 'dents') factor *= 0.8;

    let computed = Math.round(base * factor);

    // Box and charger bonus
    const boxBonus = hasBoxCharger ? 800 : 0;
    // ElectroMart festival exchange bonus
    const exchangeBonus = 1500;

    const finalValue = Math.max(1500, computed + boxBonus + exchangeBonus);

    return {
      base,
      factor: Math.round(factor * 100),
      exchangeBonus,
      boxBonus,
      finalValue
    };
  };

  const valuation = computeValuation();

  // Animate counter when reaching Step 4
  useEffect(() => {
    if (step === 4) {
      let start = 0;
      const end = valuation.finalValue;
      const duration = 800; // ms
      const stepTime = 20;
      const increment = Math.ceil(end / (duration / stepTime));

      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayValue(end);
          clearInterval(timer);
        } else {
          setDisplayValue(start);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [step, valuation.finalValue]);

  if (!isOpen) return null;

  const handleApplyToCart = () => {
    const tradeData = {
      id: `TRADE-${Date.now()}`,
      category,
      brand,
      model: selectedModel.model,
      storage: selectedStorage,
      deviceName: `${brand} ${selectedModel.model} (${selectedStorage})`,
      baseValue: valuation.base,
      healthScore: valuation.factor,
      value: valuation.finalValue,
      appliedAt: new Date().toISOString()
    };
    applyTradeIn(tradeData);
    onClose();
  };

  return (
    <div className="tradein-modal-backdrop" onClick={onClose}>
      <div className="tradein-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Bar */}
        <div className="tradein-modal-header">
          <div className="tradein-brand-pill">
            <RefreshCw size={14} className="spin-slow" />
            <span>ElectroMart Device Exchange</span>
          </div>
          <button type="button" className="tradein-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Progress Stepper Bar */}
        <div className="tradein-stepper-header">
          <div className="stepper-track-bar">
            <div className="stepper-fill" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>
          <div className="stepper-labels-row">
            <span className={step >= 1 ? 'active' : ''}>1. Device</span>
            <span className={step >= 2 ? 'active' : ''}>2. Model</span>
            <span className={step >= 3 ? 'active' : ''}>3. Condition</span>
            <span className={step >= 4 ? 'active' : ''}>4. Value</span>
          </div>
        </div>

        {/* Modal Body: Dynamic Step Content */}
        <div className="tradein-modal-body">
          {/* STEP 1: Category & Brand Selection */}
          {step === 1 && (
            <div className="tradein-step-view animate-fade-in">
              <h2 className="step-main-title">Select your old device category</h2>
              <p className="step-sub-desc">
                Exchange your eligible device for an instant discount towards your order.
              </p>

              {/* Category Pills */}
              <div className="tradein-cat-grid">
                {Object.entries(TRADE_IN_CATALOG).map(([key, data]) => {
                  const IconComp = data.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      className={`tradein-cat-card ${category === key ? 'selected' : ''}`}
                      onClick={() => {
                        setCategory(key);
                        const firstBrand = Object.keys(data.brands)[0];
                        setBrand(firstBrand);
                      }}
                    >
                      <div className="cat-icon-bubble">
                        <IconComp size={24} />
                      </div>
                      <span className="cat-card-title">{data.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Brand Pills */}
              <div className="tradein-brand-section">
                <label className="section-label">Select Brand:</label>
                <div className="brand-pills-row">
                  {Object.keys(TRADE_IN_CATALOG[category].brands).map((b) => (
                    <button
                      key={b}
                      type="button"
                      className={`brand-pill-btn ${brand === b ? 'selected' : ''}`}
                      onClick={() => setBrand(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tradein-step-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-block btn-lg tradein-next-btn"
                  onClick={() => setStep(2)}
                >
                  <span>Select Model</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Model & Storage Selection */}
          {step === 2 && (
            <div className="tradein-step-view animate-fade-in">
              <h2 className="step-main-title">Which {brand} model do you have?</h2>
              <p className="step-sub-desc">Choose your exact model for precise valuation.</p>

              <div className="model-selection-list">
                {TRADE_IN_CATALOG[category].brands[brand]?.map((m) => (
                  <button
                    key={m.model}
                    type="button"
                    className={`model-option-card ${selectedModel?.model === m.model ? 'selected' : ''}`}
                    onClick={() => handleModelChange(m)}
                  >
                    <div className="model-info">
                      <strong className="model-name">{m.model}</strong>
                      <span className="model-max-val">Up to {formatINR(m.baseValue + 2300)} exchange credit</span>
                    </div>
                    {selectedModel?.model === m.model && (
                      <CheckCircle2 size={20} className="check-selected-icon" />
                    )}
                  </button>
                ))}
              </div>

              {/* Storage Capacity Selector */}
              {selectedModel && selectedModel.storage && selectedModel.storage.length > 1 && (
                <div className="storage-select-box">
                  <label className="section-label">Storage Capacity:</label>
                  <div className="storage-pills-row">
                    {selectedModel.storage.map((str) => (
                      <button
                        key={str}
                        type="button"
                        className={`storage-pill ${selectedStorage === str ? 'selected' : ''}`}
                        onClick={() => setSelectedStorage(str)}
                      >
                        {str}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="tradein-step-actions double-btn">
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setStep(1)}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg tradein-next-btn"
                  onClick={() => setStep(3)}
                  disabled={!selectedModel}
                >
                  <span>Condition Check</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Quick Condition Diagnostics Questionnaire */}
          {step === 3 && (
            <div className="tradein-step-view animate-fade-in">
              <h2 className="step-main-title">Quick Diagnostic Check</h2>
              <p className="step-sub-desc">Answer 3 simple questions to calculate your verified credit.</p>

              <div className="diagnostics-questions-stack">
                {/* Q1: Power & Function */}
                <div className="question-card">
                  <label className="question-title">1. Does the device turn on and function properly?</label>
                  <div className="options-choice-grid">
                    <button
                      type="button"
                      className={`choice-pill ${conditionPower === 'working' ? 'selected' : ''}`}
                      onClick={() => setConditionPower('working')}
                    >
                      <CheckCircle2 size={16} />
                      <span>Yes, fully working</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${conditionPower === 'battery_issue' ? 'selected' : ''}`}
                      onClick={() => setConditionPower('battery_issue')}
                    >
                      <span>Minor battery degradation</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${conditionPower === 'dead' ? 'selected' : ''}`}
                      onClick={() => setConditionPower('dead')}
                    >
                      <span>Does not power on</span>
                    </button>
                  </div>
                </div>

                {/* Q2: Touch Screen */}
                <div className="question-card">
                  <label className="question-title">2. Screen &amp; Touch Condition</label>
                  <div className="options-choice-grid">
                    <button
                      type="button"
                      className={`choice-pill ${conditionScreen === 'flawless' ? 'selected' : ''}`}
                      onClick={() => setConditionScreen('flawless')}
                    >
                      <span>Flawless (No scratches)</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${conditionScreen === 'scratches' ? 'selected' : ''}`}
                      onClick={() => setConditionScreen('scratches')}
                    >
                      <span>Minor scratches only</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${conditionScreen === 'cracked' ? 'selected' : ''}`}
                      onClick={() => setConditionScreen('cracked')}
                    >
                      <span>Cracked or lines on display</span>
                    </button>
                  </div>
                </div>

                {/* Q3: Body Housing */}
                <div className="question-card">
                  <label className="question-title">3. Outer Body &amp; Camera Lens</label>
                  <div className="options-choice-grid">
                    <button
                      type="button"
                      className={`choice-pill ${conditionBody === 'good' ? 'selected' : ''}`}
                      onClick={() => setConditionBody('good')}
                    >
                      <span>Clean / Normal wear</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${conditionBody === 'flawless' ? 'selected' : ''}`}
                      onClick={() => setConditionBody('flawless')}
                    >
                      <span>Like New (No dents)</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-pill ${conditionBody === 'dents' ? 'selected' : ''}`}
                      onClick={() => setConditionBody('dents')}
                    >
                      <span>Major dents or cracks</span>
                    </button>
                  </div>
                </div>

                {/* Q4: Original Charger & Box bonus */}
                <div className="bonus-addon-toggle">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={hasBoxCharger}
                      onChange={(e) => setHasBoxCharger(e.target.checked)}
                    />
                    <span className="checkmark-box"></span>
                    <div className="toggle-label-content">
                      <strong>Include original box &amp; charging adapter</strong>
                      <span className="bonus-tag">+₹800 Extra Exchange Bonus</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="tradein-step-actions double-btn">
                <button
                  type="button"
                  className="btn btn-outline btn-lg"
                  onClick={() => setStep(2)}
                >
                  <ArrowLeft size={16} />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg tradein-next-btn"
                  onClick={() => setStep(4)}
                >
                  <Sparkles size={18} />
                  <span>Calculate Valuation</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Instant Valuation Certificate & 1-Click Apply */}
          {step === 4 && (
            <div className="tradein-step-view animate-fade-in text-center">
              <div className="valuation-celebration-bubble">
                <Sparkles size={28} className="sparkle-icon" />
              </div>

              <span className="valuation-subtitle-label">VERIFIED ESTIMATED EXCHANGE VALUE</span>
              <h1 className="valuation-big-amount">{formatINR(displayValue)}</h1>

              <div className="valuation-device-pill">
                <strong>{brand} {selectedModel?.model}</strong>
                <span>• {selectedStorage} • Health {valuation.factor}%</span>
              </div>

              {/* Breakdown Card */}
              <div className="valuation-breakdown-card">
                <div className="breakdown-row">
                  <span>Base Market Value</span>
                  <span>{formatINR(valuation.base)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Hardware Diagnostics Rating</span>
                  <span className="text-emerald-600 font-bold">{valuation.factor}% Optimal</span>
                </div>
                {valuation.boxBonus > 0 && (
                  <div className="breakdown-row highlight-green">
                    <span>Original Box &amp; Adapter Bonus</span>
                    <span>+ {formatINR(valuation.boxBonus)}</span>
                  </div>
                )}
                <div className="breakdown-row highlight-blue">
                  <span>ElectroMart Festival Exchange Bonus</span>
                  <span>+ {formatINR(valuation.exchangeBonus)}</span>
                </div>
                <div className="breakdown-divider"></div>
                <div className="breakdown-row final-total-row">
                  <strong>Total Instant Deduction</strong>
                  <strong className="text-emerald-700">{formatINR(valuation.finalValue)}</strong>
                </div>
              </div>

              {/* Doorstep Handover Notice */}
              <div className="doorstep-guarantee-box">
                <Truck size={18} className="text-blue-600 flex-shrink-0" />
                <p>
                  <strong>No hassle doorstep pickup:</strong> Keep using your old device until your new electronics arrive! Our Mumbai BKC courier performs a quick 60-second inspection at your door.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="tradein-final-cta-stack">
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block btn-apply-tradein"
                  onClick={handleApplyToCart}
                >
                  <CheckCircle2 size={20} />
                  <span>Apply {formatINR(valuation.finalValue)} Exchange Discount</span>
                </button>

                <div className="final-sub-links">
                  <button
                    type="button"
                    className="btn-text-recalculate"
                    onClick={() => setStep(3)}
                  >
                    Adjust diagnostics answers
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    className="btn-text-recalculate"
                    onClick={() => setStep(1)}
                  >
                    Choose another device
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeInModal;
