import React, { useEffect } from 'react'; 
import './Koleksiyon.css'; 
import AOS from 'aos'; 
import 'aos/dist/aos.css'; 
import Header from '../../components/Header'; 
import Footer from '../../components/Footer'; 
import { Link } from 'react-router-dom';   

import isikHero from '../../assets/isiki.jpg'; 
import goldenHour from '../../assets/1.jpg'; 
import nest from '../../assets/2.jpg'; 
import pearls from '../../assets/3.jpg'; 
import ironmute from '../../assets/4.jpg';  

const Koleksiyon = () => {   
  useEffect(() => {     
    AOS.init({       
      duration: 600,       
      once: true,       
      easing: 'ease-out',     
    });   
  }, []);    
  
  const lambalar = [     
    { id: 'golden-hour',description:"Sıcak altın tonlarının zarafeti..", image: goldenHour, route: '/golden', kategori: 'Golden Hour' },     
    { id: 'nest',description:"Doğanın organik formlarından ilham alan Nest koleksiyonu..", image: nest, route: '/nest', kategori: 'Nest' },     
    { id: 'pearls', description:" Zarafetin ve lüksün simgesi olan inci..",image: pearls, route: '/pearls', kategori: 'Pearls' },     
    { id: 'ironmute',description:" Endüstriyel tasarımın gücü ile minimalist estetiğin zarafeti.." ,image: ironmute, route: '/ironmite', kategori: 'Ironmute' },   
  ];     
  
  const scrollToContent = () => {     
    const koleksiyonContainer = document.querySelector('.koleksiyon-container');     
    if (koleksiyonContainer) {       
      koleksiyonContainer.scrollIntoView({         
        behavior: 'smooth',         
        block: 'start'       
      });     
    }   
  };    
  
  return (     
    <>       
      <Header />             
      <div
        className="koleksiyon-hero"
        style={{
          backgroundImage: `url(${isikHero})`,
        }}
      >
        <div className="koleksiyon-hero-content" data-aos="fade-up">
          <h1 className="koleksiyon-hero-title">KOLEKSİYONLAR</h1>
          <p className="koleksiyon-hero-subtitle">IŞIĞIN SANATLA BULUŞTUĞU EŞSİZ TASARIMLAR</p>
        </div>
        
        <div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-down-arrow">
            <svg width="80" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="koleksiyon-container">
        <div className="koleksiyon-grid">
          {lambalar.map((lamba, index) => (
            <div
              key={lamba.id}
              className="koleksiyon-item"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="item-content-left">
                <h2 className="kategori-baslik-left">{lamba.kategori}</h2>
                <h1 className='kategori-description'>{lamba.description}</h1>
                <Link to={lamba.route} className="item-link-left">
                  İncele
                </Link>
              </div>
              
              <div className="item-image-container-right">
                <img
                  src={lamba.image}
                  alt={lamba.kategori}
                  className="item-image-right"
                />
              </div>
            </div>
          ))}
        </div>
        <br></br><br></br>
      </div>
    </>   
  ); 
};  

export default Koleksiyon;