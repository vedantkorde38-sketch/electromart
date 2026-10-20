import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

const OrderTrackingStepper = ({ orderStatus = 'Confirmed', orderDate = new Date() }) => {
  // Map backend status to stepper stage index (0 to 4)
  const getStageIndex = (status) => {
    switch (status?.toLowerCase()) {
      case 'cancelled':
        return -1;
      case 'delivered':
        return 4;
      case 'shipped':
        return 2;
      case 'processing':
        return 1;
      case 'confirmed':
      case 'pending':
      default:
        return 1; // Show at stage 1 or 2 for live demonstration
    }
  };

  const currentStage = getStageIndex(orderStatus);

  const stages = [
    {
      title: 'Order Placed',
      desc: 'Order received & verified',
      icon: CheckCircle2,
      time: 'Instant'
    },
    {
      title: 'Packed & Hub QA',
      desc: 'ElectroMart Bengaluru Hub',
      icon: Package,
      time: 'Day 1'
    },
    {
      title: 'In Transit',
      desc: 'BlueDart Air Express (AWB: BD-849201938IN)',
      icon: Truck,
      time: 'Day 2'
    },
    {
      title: 'Out for Delivery',
      desc: 'Local courier agent dispatched',
      icon: MapPin,
      time: 'Day 3'
    },
    {
      title: 'Delivered',
      desc: 'Doorstep contactless delivery',
      icon: ShieldCheck,
      time: 'Day 3-4'
    }
  ];

  if (orderStatus?.toLowerCase() === 'cancelled') {
    return (
      <div className="order-tracking-card cancelled-tracking-card">
        <div className="tracking-cancelled-banner">
          <Clock size={20} className="text-danger" />
          <div>
            <strong>Order Cancelled</strong>
            <p>This order was cancelled and inventory has been restored.</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage for the glowing line (0%, 25%, 50%, 75%, 100%)
  const progressPercent = Math.min(100, Math.max(12, (currentStage / (stages.length - 1)) * 100));

  return (
    <div className="order-tracking-card">
      <div className="tracking-card-header">
        <div className="tracking-title-box">
          <div className="truck-pulse-circle">
            <Truck size={20} className="truck-pulse-icon" />
          </div>
          <div>
            <h4 className="tracking-title">Live Delivery Status &amp; Tracking</h4>
            <p className="tracking-subtitle">
              Carrier: <strong>BlueDart Express</strong> &bull; Tracking No:{' '}
              <span className="awb-number">BD-849201938IN</span>
            </p>
          </div>
        </div>
        <div className="tracking-estimate-pill">
          <Clock size={14} />
          <span>Estimated: 2 - 3 Days</span>
        </div>
      </div>

      {/* Visual Stepper */}
      <div className="tracking-stepper-body">
        {/* Background track & Animated Fill bar */}
        <div className="stepper-line-track">
          <div
            className="stepper-line-fill"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="stepper-truck-marker">
              <Truck size={14} />
            </div>
          </div>
        </div>

        {/* Steps Nodes */}
        <div className="stepper-nodes-row">
          {stages.map((stg, idx) => {
            const isCompleted = idx <= currentStage;
            const isCurrent = idx === currentStage;
            const IconComponent = stg.icon;

            return (
              <div
                key={idx}
                className={`stepper-node-item ${isCompleted ? 'completed' : ''} ${
                  isCurrent ? 'current' : ''
                }`}
              >
                <div className="stepper-node-bubble">
                  <IconComponent size={18} />
                </div>
                <div className="stepper-node-info">
                  <span className="stepper-node-title">{stg.title}</span>
                  <span className="stepper-node-desc">{stg.desc}</span>
                  <span className="stepper-node-time">{stg.time}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Courier Partner Simulation Strip */}
      <div className="tracking-courier-strip">
        <div className="courier-meta-item">
          <span>Current Location:</span>
          <strong>Bengaluru Central Logistics Hub</strong>
        </div>
        <div className="courier-meta-item">
          <span>Dispatch Mode:</span>
          <strong>Insured Electronics Surface Air</strong>
        </div>
        <div className="courier-meta-item">
          <span>Delivery Partner:</span>
          <span className="partner-badge">BlueDart Express</span>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingStepper;
