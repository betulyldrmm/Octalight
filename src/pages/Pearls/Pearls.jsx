import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Pearls.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaHome, FaList, FaGem } from 'react-icons/fa';

import Header from '../../components/Header';
import ScrollToTop from '../../components/ScrollToTop';

import heroImage from '../../assets/hero.jpg';


import Donme from '../../components/Donme';


import ResimKismi3 from '../../components/ResimKismi3';

const Pearls = () => {
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
const scrollToContent = () => {
  window.scrollTo({
    top: 800, // Sayfanın neresine gideceğini belirle. 800 px aşağı mesela.
    behavior: 'smooth'
  });
};
  return (
    <>
      <Header />
      <ScrollToTop />

      <div className="page-container">
        <div className="sidebar">
          <Link to="/" className="sidebar-link">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/koleksiyon" className="sidebar-link">
            <FaList />
            <span>Collection</span>
          </Link>
          <div className="sidebar-link active">
            <FaGem />
            <span>Pearls</span>
          </div>
        </div>
<div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-down-arrow">
            <svg width="100" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="hero-section">
          <div className="hero-image-container">
            <img
              src={heroImage}
              alt="Hero"
              className="hero-image"
              loading="lazy"
            />
            <div className="hero-overlay">
              <div className="hero-content" data-aos="fade-up">
                <h1 className="hero-title">PEARLS</h1>
                <p className="hero-subtitle">Modern lighting beyond expectations</p>
              </div>
            </div>
          </div>
        </div>

        <br /><br /><br />

        <Donme />

        {/* contentDataa dizisini ResimKismi bileşenine prop olarak gönderiyoruz */}
        <ResimKismi3></ResimKismi3>
      </div>
    </>
  );
};

export default Pearls;
