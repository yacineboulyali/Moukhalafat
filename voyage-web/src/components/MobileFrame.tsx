import React from 'react';
import './MobileFrame.css';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="phone-wrapper">
      <div className="phone-case">
        <div className="phone-screen">
          <div className="phone-notch"></div>
          <div className="app-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
