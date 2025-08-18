import React, { useState, useEffect } from 'react';
import './Donme.css';

import lamba1 from '../assets/7.jpg';
import lamba2 from '../assets/8.jpg';
import lamba3 from '../assets/9.jpg';
import lamba4 from '../assets/10.jpg';
import lamba5 from '../assets/13.jpg';
import lamba6 from '../assets/12.jpg';

const urunler = [
  { id: 1, image: lamba1 },
  { id: 2, image: lamba2 },
  { id: 3, image: lamba3 },
  { id: 4, image: lamba4 },
  { id: 5, image: lamba5 },
  { id: 6, image: lamba6 }
];

const Donme = () => {
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
          </div>
        ))}
      </div>
      <br></br><br></br><br></br>
      <div className="dotss-container">
        {urunler.map((_, index) => (
          <div
            key={index}
            className={`dott ${index === aktifIndex ? 'active' : ''}`}
            onClick={() => setAktifIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Donme;