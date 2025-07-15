import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Golden.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaHome, FaList, FaGem } from 'react-icons/fa';

import Header from '../../components/Header';
import ScrollToTop from '../../components/ScrollToTop';

import heroImage from '../../assets/hero.jpg';
import img1 from '../../assets/isik1.jpg';
import img2 from '../../assets/isik2.jpg';
import img3 from '../../assets/isik3.jpg';

import Donme from '../../components/Donme';

import Galeri from '../../components/Galeri';
import ResimKismi from '../../components/ResimKismi';

const Golden = () => {
  const [loading, setLoading] = useState(true);

  const contentData = [
    {
      image: img1,
      text: 'The Golden Hour collection brings the magic of the day\'s most enchanting moments into your living spaces, blending the elegance of warm golden tones with modern design. This line recreates the magic of natural light, creating a timeless atmosphere in your interiors while offering the perfect balance of luxury and comfort.',
      title: 'The Meeting of Elegance and Light',
    },
    {
      image: img2,
      text: 'Behind the minimalist forms lies sophisticated technology, transforming each piece into not only a lighting element but also an artistic expression. This collection reflects the pursuit of perfection in every detail and is designed with an understanding of the dynamics of modern life.',
      title: 'Harmony of Technology and Art',
    },
    {
      image: img3,
      text: 'Blending the warmth of gold with the functionality of modern life, this collection promises much more than ordinary lighting. Each piece creates timeless value, transforming your living spaces into works of art.',
      title: 'Timeless Value and Design',
    },
  ];

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
              <div className="hero-content" data-aos="fade-up">
                <h1 className="hero-title">GOLDEN HOUR</h1>
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