import React, { useState, useEffect } from 'react';
import './DonmeDolapKarti.css';

import aplik from '../assets/apliklamba.jpg';
import gece from '../assets/gece.jpg';
import avize from '../assets/avize.jpg';
import kose from '../assets/kose.jpg';

const urunler = [
  { id: 1, baslik: "Duvar Aplik Modelleri", image: aplik },
  { id: 2, baslik: "Gece Lambaları", image: gece },
  { id: 3, baslik: "Avize Modelleri", image: avize },
  { id: 4, baslik: "Köşe Aydınlatma & Lambader", image: kose },
];

const DonmeDolapKarti = () => {
  const [aktifIndex, setAktifIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAktifIndex((prev) => (prev + 1) % urunler.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const kartClassi = (index) => {
    if (index === aktifIndex) return 'urun-karti aktif';
    if (index === (aktifIndex - 1 + urunler.length) % urunler.length) return 'urun-karti sol';
    if (index === (aktifIndex + 1) % urunler.length) return 'urun-karti sag';
    return 'urun-karti gizli';
  };

  return (
    <div className="donmedolap-wrapper" data-aos="zoom-in-up">
      <div className="kart-container">
        {urunler.map((item, index) => (
          <div className={kartClassi(index)} key={item.id}>
            <img src={item.image} alt={item.baslik} />
            <h3>{item.baslik}</h3>
            <button className="kesfet-btn">KEŞFET</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonmeDolapKarti;
