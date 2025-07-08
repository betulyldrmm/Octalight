import React, { useState } from 'react';
import './CookieBanner.css';

const CookieBanner = () => {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    setVisible(false);
  };

  const handleReject = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-box">
      <div className="cookie-text">
        Bu sitedeki deneyiminizi çerezlere izin vererek geliştirebilirsiniz.
      </div>
      <div className="cookie-actions">
        <button className="reject-btn" onClick={handleReject}>
          ÇEREZLERİ REDDET
        </button>
        <button className="accept-btn" onClick={handleAccept}>
          ÇEREZLERE İZİN VER
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
