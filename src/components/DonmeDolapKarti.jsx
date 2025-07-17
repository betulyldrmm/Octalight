import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DonmeDolapKarti.css';

import goldenHour from '../assets/1.jpg';
import nest from '../assets/2.jpg';
import pearls from '../assets/3.jpg';
import ironmute from '../assets/4.jpg';

const urunler = [
  { id: 1, baslik: "GOLDEN HOUR", image: goldenHour, path: "/golden" },
  { id: 2, baslik: "NEST",         image: nest,       path: "/nest" },
  { id: 3, baslik: "PEARLS",       image: pearls,     path: "/pearls" },
  { id: 4, baslik: "IRONMUTE",     image: ironmute,   path: "/ronmite" },
];

const DonmeDolapKarti = () => {
  const [aktifIndex, setAktifIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAktifIndex((prev) => (prev + 1) % urunler.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const kartClassi = (index) => {
    if (index === aktifIndex) return 'yeni-urun-karti yeni-aktif';
    if (index === (aktifIndex - 1 + urunler.length) % urunler.length) return 'yeni-urun-karti yeni-sol';
    if (index === (aktifIndex + 1) % urunler.length) return 'yeni-urun-karti yeni-sag';
    return 'yeni-urun-karti yeni-gizli';
  };

  return (
    <div className="yeni-donmedolap-wrapper" data-aos="zoom-in-up">
      <div className="yeni-kart-container">
        {urunler.map((item, index) => (
          <div className={kartClassi(index)} key={item.id}>
            <img src={item.image} alt={item.baslik} />
            <h3>{item.baslik}</h3>
            <button
              className="yeni-kesfet-btn"
              onClick={() => navigate(item.path)}
            >
              KEŞFET
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonmeDolapKarti;
