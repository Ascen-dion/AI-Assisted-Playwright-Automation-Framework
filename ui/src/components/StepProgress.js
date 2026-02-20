import React from 'react';
import './StepProgress.css';

const StepProgress = ({ steps, currentStep }) => {
  return (
    <div className="step-progress">
      {steps.map((step) => (
        <div 
          key={step.id}
          className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
        >
          <div className="step-icon">{step.icon}</div>
          <div className="step-name">{step.name}</div>
          {step.id < steps.length && <div className="step-connector"></div>}
        </div>
      ))}
    </div>
  );
};

export default StepProgress;
