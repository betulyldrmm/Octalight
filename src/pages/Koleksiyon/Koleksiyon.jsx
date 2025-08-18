import React, { useState, useEffect } from 'react';
import './Koleksiyon.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Link } from 'react-router-dom';

import isikHero from '../../assets/isiki.jpg';
import goldenHour from '../../assets/10.jpg';
import nest from '../../assets/7.jpg';
import pearls from '../../assets/6.jpg';
import ironmute from '../../assets/5.jpg';

const Koleksiyon = () => {
  const [backendKoleksiyonlar, setBackendKoleksiyonlar] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sabit koleksiyonlar
  const sabitKoleksiyonlar = [
    { id: 'golden-hour', kategori: 'Golden Hour', description: 'Sıcak altın tonlarının zarafeti..', image: goldenHour, route: '/golden' },
    { id: 'nest', kategori: 'Nest', description: 'Doğanın organik formlarından ilham alan Nest koleksiyonu..', image: nest, route: '/nest' },
    { id: 'pearls', kategori: 'Pearls', description: 'Zarafetin ve lüksün simgesi olan inci..', image: pearls, route: '/pearls' },
    { id: 'ironmute', kategori: 'Ironmute', description: 'Endüstriyel tasarımın gücü ile minimalist estetiğin zarafeti..', image: ironmute, route: '/ironmite' },
  ];

  useEffect(() => {
    AOS.init({
      duration: 600,
      once: true,
      easing: 'ease-out',
    });

   fetch('http://localhost:3001/api/koleksiyonlar')
  .then(res => res.json())
  .then(data => {
    if (data.success && data.koleksiyonlar) {
      const mapped = data.koleksiyonlar.map(k => ({
        id: k.slug,
        kategori: k.isim,
        description: k.aciklama,
        image: `http://localhost:3001${k.gorselUrl}`,
        // Backend koleksiyonları için dinamik route
        route: `/koleksiyon/${k.slug}`, // Burayı değiştirin
      }));
      setBackendKoleksiyonlar(mapped);
    } else {
      setBackendKoleksiyonlar([]);
    }
  })
  .catch(err => {
    console.error('Backend koleksiyonları çekilirken hata:', err);
    setBackendKoleksiyonlar([]);
  })
  .finally(() => setLoading(false));
  }, []);

  const scrollToContent = () => {
    const el = document.querySelector('.koleksiyon-container');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) return <div>Yükleniyor...</div>;

  // Sabit koleksiyonlar + backend koleksiyonları birleştir
  const tumKoleksiyonlar = [...sabitKoleksiyonlar, ...backendKoleksiyonlar];

  return (
    <>
      <Header />
      <div
        className="koleksiyon-hero"
        style={{ backgroundImage: `url(${isikHero})` }}
      >
        <div className="koleksiyon-hero-content" data-aos="fade-up">
          <h1 className="koleksiyon-hero-title">KOLEKSİYONLAR</h1>
          <p className="koleksiyon-hero-subtitle">IŞIĞIN SANATLA BULUŞTUĞU EŞSİZ TASARIMLAR</p>
        </div>

        <div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-down-arrow">
            <svg width="80" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <div className="koleksiyon-container">
        <div className="koleksiyon-grid">
          {tumKoleksiyonlar.map((koleksiyon, index) => (
            <div
              key={koleksiyon.id + index}
              className="koleksiyon-item"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="item-content-left">
                <h2 className="kategori-baslik-left">{koleksiyon.kategori}</h2>
                <h1 className='kategori-description'>{koleksiyon.description}</h1>
                <Link to={koleksiyon.route} className="item-link-left">
                  İncele
                </Link>
              </div>

              <div className="item-image-container-right">
                <img
                  src={koleksiyon.image}
                  alt={koleksiyon.kategori}
                  className="item-image-right"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    
    </>
  );
};

export default Koleksiyon;
