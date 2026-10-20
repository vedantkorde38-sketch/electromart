import React, { useState, useEffect } from 'react';
import { Flame, Clock, Zap } from 'lucide-react';

const FlashDealsTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 12, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div className="ios-flash-timer-card">
      <div className="ios-timer-left">
        <div className="ios-flame-bubble">
          <Flame size={20} className="flame-icon-pulse" />
        </div>
        <div>
          <div className="ios-timer-title-row">
            <span className="ios-timer-title">Today's Flash Deals</span>
            <span className="ios-timer-badge">Limited Quantity</span>
          </div>
          <p className="ios-timer-sub">Special festive price cuts refreshed every 24 hours.</p>
        </div>
      </div>

      <div className="ios-timer-right">
        <span className="ios-timer-label">
          <Clock size={13} />
          <span>Ends in:</span>
        </span>
        <div className="ios-timer-boxes">
          <div className="ios-time-digit-box">
            <span className="digit-val">{pad(timeLeft.hours)}</span>
            <span className="digit-lbl">HRS</span>
          </div>
          <span className="digit-sep">:</span>
          <div className="ios-time-digit-box">
            <span className="digit-val">{pad(timeLeft.minutes)}</span>
            <span className="digit-lbl">MIN</span>
          </div>
          <span className="digit-sep">:</span>
          <div className="ios-time-digit-box accent-box">
            <span className="digit-val">{pad(timeLeft.seconds)}</span>
            <span className="digit-lbl">SEC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashDealsTimer;
