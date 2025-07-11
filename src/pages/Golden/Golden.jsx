import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Golden.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { FaHome, FaList, FaGem } from 'react-icons/fa';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';

import foto1 from '../../assets/isi.jpg';
import foto2 from '../../assets/iaik2.jpg';
import foto3 from '../../assets/isik3.jpg';
import isikii from '../../assets/isiki.jpg';
import isik1 from '../../assets/isik1.jpg';
import isik2 from '../../assets/isik2.jpg';
import isik3 from '../../assets/isik3.jpg';

const Golden = () => {
  const [currentSliderIndex, setCurrentSliderIndex] = useState(0);

  // Slider resimleri
  const sliderImages = [isikii, isik1, isik2, isik3, isik1, isik2];

  // AOS başlatılıyor
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  // Slider otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSliderIndex((prevIndex) => {
        const nextIndex = prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1;
        return nextIndex;
      });
    }, 5000); // 5 saniye

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  const goToSlide = (index) => {
    if (index >= 0 && index < sliderImages.length) {
      setCurrentSliderIndex(index);
    }
  };

  const heroImage = foto1;

  const slideWidth = 320; // px olarak slider genişliği
  const gap = 25; // px olarak slide arası boşluk
  const slideCount = sliderImages.length;
  const trackWidth = (slideWidth + gap) * slideCount;

  return (
    <>
      <Header />
      <ScrollToTop />

      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          <FaHome className="breadcrumb-icon" />
          <span>Anasayfa</span>
        </Link>
        <Link to="/koleksiyon" className="breadcrumb-link">
          <FaList className="breadcrumb-icon" />
          <span>Koleksiyon</span>
        </Link>
        <div className="breadcrumb-link active">
          <FaGem className="breadcrumb-icon" />
          <span>Golden Hour</span>
        </div>
      </div>

      <div className="sandalyeler-page">
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
                <p className="hero-description">Modern ve şık tasarımıyla</p>
              </div>
            </div>
          </div>
        </div>

        {/* Golden Hour Collection Story */}
        <div className="collection-story">
          <div className="story-content">
            <h3 className="story-title" data-aos="fade-up">
              GOLDEN HOUR
            </h3>
          </div>

          {/* Slider Section */}
          <div className="slider-section" data-aos="fade-up" data-aos-delay="100">
            <div className="slider-main-container">
              <div className="main-slider">
                <div className="slider-wrapper">
                  <div
                    className="slider-track"
                    style={{
                      width: `${trackWidth}px`,
                      transform: `translateX(-${currentSliderIndex * (slideWidth + gap)}px)`,
                    }}
                  >
                    {sliderImages.map((image, index) => (
                      <div
                        key={index}
                        className="slider-slide"
                        style={{ width: `${slideWidth}px` }}
                      >
                        <img
                          src={image}
                          alt={`Golden Hour ${index + 1}`}
                          className="slider-image"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Slider Dots */}
                <div className="slider-dots">
                  {sliderImages.map((_, index) => (
                    <button
                      key={index}
                      className={`dot ${index === currentSliderIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Açıklama - Slider Altında */}
              <div className="slider-description">
                <p className="description-text">
                  Günün en büyülü anlarını yaşam alanlarınıza taşıyan Golden Hour koleksiyonu, sıcak altın tonlarının zarafetini modern tasarımla buluşturuyor
                </p>
                <div className="description-features"></div>
                <div className="description-stats"></div>
              </div>
            </div>
          </div>

          <div className="story-container">
            {/* İlk Kutu */}
            <div className="content-box" data-aos="fade-up" data-aos-delay="200">
              <div className="image-section">
                <img src={foto1} alt="Golden Hour Koleksiyonu" className="content-image" />
              </div>
              <div className="text-section">
                <p className="content-text">
                  Günün en büyülü anlarını yaşam alanlarınıza taşıyan Golden Hour koleksiyonu, sıcak altın tonlarının zarafetini modern tasarımla buluşturuyor. Doğal ışığın büyüsünü yeniden yaratan bu çizgi, mekanlarınızda zamansız bir atmosfer yaratırken, lüks ve konforun mükemmel dengesini sunar.
                </p>
              </div>
            </div>

            {/* İkinci Kutu */}
            <div className="content-box" data-aos="fade-up" data-aos-delay="400">
              <div className="image-section">
                <img src={foto2} alt="Golden Hour Tasarım" className="content-image" />
              </div>
              <div className="text-section">
                <p className="content-text">
                  Minimalist formların arkasında yatan sofistike teknoloji, her bir parçayı sadece bir aydınlatma elementi değil, aynı zamanda sanatsal bir ifade aracı haline getiriyor. Her detayında mükemmellik arayışının izlerini taşıyan bu koleksiyon, modern yaşamın dinamiklerini anlayarak tasarlanmıştır.
                </p>
              </div>
            </div>

            {/* Üçüncü Kutu */}
            <div className="content-box" data-aos="fade-up" data-aos-delay="600">
              <div className="image-section">
                <img src={foto3} alt="Golden Hour Detay" className="content-image" />
              </div>
              <div className="text-section">
                <p className="content-text">
                  Altın rengin sıcaklığı ile modern yaşamın işlevselliğini harmanlayan bu koleksiyon, mekanlarınızı sıradan aydınlatmaktan çok daha fazlasını vaat ediyor. Her bir parça, zamanın ötesinde bir değer yaratarak, yaşam alanlarınızı sanat eserine dönüştürüyor.
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

export default Golden;
