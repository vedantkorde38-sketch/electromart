import React from 'react';

const LoadingSpinner = ({ text = 'Loading ElectroMart...', size = 'md' }) => {
  return (
    <div className={`spinner-wrapper size-${size}`}>
      <div className="spinner-glow">
        <div className="spinner-circle"></div>
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
