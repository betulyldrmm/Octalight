import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Ronmite.css';
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

const Ronmite= () => {
  const [loading, setLoading] = useState(true);

  const contentData = [
    {
      image: img1,
      text:
        'Inspired by nature’s organic forms, the Nest collection brings warmth and tranquility to your living spaces with soft lines and gentle light.',
      title: 'The Meeting of Elegance and Light',
    },
    {
      image: img2,
      text:
        'The comfort of rounded forms merges with contemporary technology, creating designs that connect emotionally as well as visually.',
      title: 'Harmony of Technology and Art',
    },
    {
      image: img3,
      text:
        'Nest does not only light your space, it makes it livable.',
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
            <span>NEST</span>
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
              Perfect harmony of light and design
            </p>
          </div>

          <div className="content-container">
            {contentData.map((item, index) => (
              <div
                key={index}
                className={`content-card ${index % 2 === 1 ? 'reverse' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 200}
              >
                <div className="image-wrapper">
                  <img
                    src={item.image}
                    alt={`Nest ${index + 1}`}
                    className="content-image"
                    loading="lazy"
                  />
                  <div className="image-overlay">
                    <div className="overlay-text">
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="content-text-wrapper">
                  <div className="content-text">
                    <h3 className="content-heading">{item.title}</h3>
                    <p className="content-paragraph">{item.text}</p>
                    <div className="content-divider"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ronmite;
