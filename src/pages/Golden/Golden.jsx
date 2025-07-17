import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Golden.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaHome, FaList, FaGem } from 'react-icons/fa';

import Header from '../../components/Header';
import ScrollToTop from '../../components/ScrollToTop';

import heroImage from '../../assets/hero.jpg';


import Donme from '../../components/Donme';


import ResimKismi from '../../components/ResimKismi';

const Golden = () => {
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
        {/* Sidebar */}
        <div className="sidebarr">
          <Link to="/" className="sidebarr-link">
            <FaHome className="sidebarr-icon" />
            <span className="sidebarr-text">Home</span>
          </Link>
          <Link to="/koleksiyon" className="sidebarr-link">
            <FaList className="sidebarr-icon" />
            <span className="sidebarr-text">Collection</span>
          </Link>
          <div className="sidebarr-link active">
            <FaGem className="sidebarr-icon" />
            <span className="sidebarr-text">GOLDEN HOUR</span>
          </div>
        </div>
<div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-down-arrow">
            <svg width="100" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
    
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-image-container">
            <img
              src={heroImage}
              alt="Golden Hour Hero"
              className="hero-image"
              loading="lazy"
            />
            <div className="hero-overlay">
              <div className="hero-conten" data-aos="fade-up">
                <h1 className="hero-titl">GOLDEN HOUR</h1>
                <p className="hero-subtitle">
                  Modern and elegant lighting for your dreams
                </p>
              </div>
            </div>
          </div>
        </div>

        <br /><br /><br />
        <Donme />

        {/* Collection Story */}
        <div className="collection-story">
          <div className="story-content">
            <h2 className="story-title" data-aos="fade-up">
              GOLDEN HOUR COLLECTION
            </h2>
            <p className="story-subtitle" data-aos="fade-up" data-aos-delay="200">
              The perfect harmony of light and design
            </p>
          </div>

       <ResimKismi></ResimKismi>     
       
          </div>
        </div>
  
    </>
  );
};

export default Golden;