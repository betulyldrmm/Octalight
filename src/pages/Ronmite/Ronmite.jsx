import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Ronmite.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { FaHome } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import ekskai from '../../assets/lamba1.jpg';
import ekskai2 from '../../assets/lamba3.png';
import foto1 from '../../assets/isik1.jpg';
import foto2 from '../../assets/iaik2.jpg';
import foto3 from '../../assets/isik3.jpg';

const Ironmite = () => {
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);
  
  const heroImage = ekskai;
  
  const sliderImages = [
    ekskai,
    ekskai2,
    ekskai,
    ekskai2
  ];
  
  const prevSliderImage = () => {
    setCurrentSliderIndex((prevIndex) => 
      prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1
    );
  };
  
  const nextSliderImage = () => {
    setCurrentSliderIndex((prevIndex) => 
      prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowLeft') prevSliderImage();
      if (e.key === 'ArrowRight') nextSliderImage();
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSliderImage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100
    });
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Golden Hour - Lamba Koleksiyonu',
        text: 'Modern ve şık tasarımıyla Golden Hour koleksiyonu',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link kopyalandı!');
    }
  };

  return (
    <>
      <Header />
      <ScrollToTop />
      
      <div className="sandalyeler-page">
        <div className="breadcrumb">
          <Link to="/" className="breadcrumb-link">
            <FaHome className="breadcrumb-icon" />
            Anasayfa
          </Link>
          <span className="breadcrumb-separator"> / </span>
          <Link to="/koleksiyon" className="breadcrumb-link">
            Koleksiyon
          </Link>
          <span className="breadcrumb-separator"> / </span>
          <span className="active">Golden Hour</span>
        </div>

        <div className="hero-section">
          <div className="hero-image-container">
            <img 
              src={heroImage} 
              alt="Golden Hour Hero"
              className="hero-image"
            />
            <div className="hero-overlay">
              <div className="hero-content">
                <h1 className="hero-title">GOLDEN HOUR</h1>
                <p className="hero-description">
                  Modern ve şık tasarımıyla
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Golden Hour Collection Story */}
        <div className="collection-story">
          <div className="story-content">
            <h3 className="story-title" data-aos="fade-up">GOLDEN HOUR</h3>
          </div>
          
          <div className="story-images-new">
            {/* İlk resim - Sol */}
            <div className="image-text-section" data-aos="fade-up" data-aos-delay="200">
              <div className="image-container">
                <img src={foto1} alt="Golden Hour Koleksiyonu" className="story-image-new" />
              </div>
              <div className="text-content">
                <p className="story-text-new">
                  Günün en büyülü anlarını yaşam alanlarınıza taşıyan Golden Hour koleksiyonu, 
                  sıcak altın tonlarının zarafetini modern tasarımla buluşturuyor. Doğal ışığın 
                  büyüsünü yeniden yaratan bu çizgi, mekanlarınızda zamansız bir atmosfer yaratırken, 
                  lüks ve konforun mükemmel dengesini sunar.
                </p>
              </div>
            </div>

            {/* İkinci resim - Sağ */}
            <div className="image-text-section reverse" data-aos="fade-up" data-aos-delay="400">
              <div className="image-container">
                <img src={foto2} alt="Golden Hour Tasarım" className="story-image-new" />
              </div>
              <div className="text-content">
                <p className="story-text-new">
                  Minimalist formların arkasında yatan sofistike teknoloji, her bir parçayı sadece 
                  bir aydınlatma elementi değil, aynı zamanda sanatsal bir ifade aracı haline getiriyor. 
                  Her detayında mükemmellik arayışının izlerini taşıyan bu koleksiyon, modern yaşamın 
                  dinamiklerini anlayarak tasarlanmıştır.
                </p>
              </div>
            </div>

            {/* Üçüncü resim - Sol */}
            <div className="image-text-section" data-aos="fade-up" data-aos-delay="600">
              <div className="image-container">
                <img src={foto3} alt="Golden Hour Detay" className="story-image-new" />
              </div>
              <div className="text-content">
                <p className="story-text-new">
                  Altın rengin sıcaklığı ile modern yaşamın işlevselliğini harmanlayan bu koleksiyon, 
                  mekanlarınızı sıradan aydınlatmaktan çok daha fazlasını vaat ediyor. Her bir parça, 
                  zamanın ötesinde bir değer yaratarak, yaşam alanlarınızı sanat eserine dönüştürüyor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default Ironmite;
