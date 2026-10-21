import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, ArrowRight, X, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatINR } from '../../utils/currency';
import TradeInModal from './TradeInModal';

const TradeInCard = ({ compact = false, targetProduct = null }) => {
  const { tradeIn, removeTradeIn } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={`apple-tradein-card ${compact ? 'compact-mode' : ''} ${tradeIn ? 'applied-state' : ''}`}>
        {tradeIn ? (
          /* Applied Exchange State */
          <div className="tradein-applied-content">
            <div className="applied-left-cluster">
              <div className="applied-badge-icon">
                <CheckCircle2 size={22} className="text-emerald-600" />
              </div>
              <div className="applied-info">
                <div className="applied-pill-tag">
                  <Sparkles size={13} />
                  <span>Exchange Discount Active</span>
                </div>
                <h4 className="applied-device-title">{tradeIn.deviceName}</h4>
                <p className="applied-saving-lead">
                  Saving <strong className="text-emerald-600">{formatINR(tradeIn.value)}</strong> with device exchange
                </p>
              </div>
            </div>

            <div className="applied-actions-cluster">
              <button
                type="button"
                className="btn-tradein-recalc"
                onClick={() => setModalOpen(true)}
              >
                Change Device
              </button>
              <button
                type="button"
                className="btn-tradein-remove"
                onClick={removeTradeIn}
                title="Remove exchange discount"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          /* Default Incentive Banner State */
          <div className="tradein-incentive-content">
            <div className="incentive-left-cluster">
              <div className="tradein-icon-halo">
                <RefreshCw size={24} className="tradein-halo-icon" />
              </div>
              <div className="incentive-text">
                <div className="tradein-eyebrow">
                  <span className="eyebrow-apple">ElectroMart</span>
                  <span className="eyebrow-badge">Exchange Offer</span>
                </div>
                <h4 className="incentive-heading">
                  Get up to <strong>₹58,000</strong> instant exchange discount
                </h4>
                <p className="incentive-subtext">
                  Exchange your old smartphone, laptop, or smartwatch for instant savings at checkout. Seamless doorstep verification.
                </p>
              </div>
            </div>

            <div className="incentive-right-cluster">
              <button
                type="button"
                className="btn-estimate-tradein"
                onClick={() => setModalOpen(true)}
              >
                <span>Check Exchange Value</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Device Exchange Modal */}
      <TradeInModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetProduct={targetProduct}
      />
    </>
  );
};

export default TradeInCard;
