import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Nest.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaHome, FaList, FaGem } from 'react-icons/fa';

import Header from '../../components/Header';
import ScrollToTop from '../../components/ScrollToTop';

import heroImage from '../../assets/10.jpg';


import Donme from '../../components/Donme';


import ResimKismi2 from '../../components/ResimKismi2';

const Nest = () => {
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
        <div className="sidebarrr">
          <Link to="/" className="sidebarrr-link">
            <FaHome />
            <span>Home</span>
          </Link>
          <Link to="/koleksiyon" className="sidebarrr-link">
            <FaList />
            <span>Collection</span>
          </Link>
          <div className="sidebarrr-link active">
            <FaGem />
            <span>NEST</span>
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
            /><br></br><br></br>
            <div className="hero-overlayy"><br></br><br></br><br></br><br></br><br></br>
              <div className="hero-content" data-aos="fade-up">
                <h1 className="hero-title">NEST</h1>
                <p className="hero-subtitle">Modern lighting beyond expectations</p>
              </div>
            </div>
          </div>
        </div>

        <Donme />
<div className="collection-story">
          <div className="story-content">
            <h2 className="story-title" data-aos="fade-up">
              NEST COLLECTION
            </h2>
            <p className="story-subtitle" data-aos="fade-up" data-aos-delay="200">
              The perfect harmony of light and design
            </p>
          </div>
          </div>
       

        {/* contentDataa dizisini ResimKismi bileşenine prop olarak gönderiyoruz */}
        <ResimKismi2></ResimKismi2>
      </div>
    </>
  );
};

export default Nest;
