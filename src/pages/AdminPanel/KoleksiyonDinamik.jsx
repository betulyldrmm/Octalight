import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './KoleksiyonDinamik.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollToTop from '../../components/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaHome, FaList, FaGem } from 'react-icons/fa';

const KoleksiyonDinamik = () => {
  const { slug } = useParams();
  const [koleksiyon, setKoleksiyon] = useState(null);
  const [icerikler, setIcerikler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
      easing: 'ease-in-out',
    });

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Koleksiyon bilgileri ve içeriklerini aynı anda çek
        const [koleksiyonResponse, icerikResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/koleksiyonlar/${slug}`),
          fetch(`http://localhost:3001/api/koleksiyonlar/${slug}/icerik`)
        ]);

        const koleksiyonData = await koleksiyonResponse.json();
        const icerikData = await icerikResponse.json();
        
        if (koleksiyonData.success) {
          setKoleksiyon(koleksiyonData.koleksiyon);
        } else {
          setError('Koleksiyon bulunamadı');
        }

        if (icerikData.success) {
          // Backend'den gelen veri formatını kontrol et
          if (icerikData.icerikler) {
            setIcerikler(icerikData.icerikler);
          } else if (icerikData.icerik) {
            setIcerikler(icerikData.icerik);
          } else {
            setIcerikler([]);
          }
        } else {
          setIcerikler([]);
        }
        
      } catch (err) {
        console.error('Veri çekme hatası:', err);
        setError('Veriler yüklenirken bir hata oluştu');
      } finally {
        // Biraz gecikme ekle smooth loading için
        setTimeout(() => setLoading(false), 500);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  const scrollToContent = () => {
    window.scrollTo({
      top: 800,
      behavior: 'smooth'
    });
  };

  // Resim ve yazı içeriklerini ayır
  const imageContents = icerikler.filter(item => item.tip === 'image');
  const textContents = icerikler.filter(item => item.tip === 'text');

  if (loading) {
    return (
      <div className="loader">
        <div className="loader-spinner"></div>
        <p>Loading Collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="error-container">
          <div className="error-content">
            <h2>Ups! Bir sorun oluştu</h2>
            <p>{error}</p>
            <button onClick={() => window.history.back()} className="back-btn">
              Geri Dön
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ScrollToTop />
      
      <div className="page-containere">
        {/* Sidebar */}
        <div className="sidebarr">
          <Link to="/" className="sidebarr-link">
            <FaHome className="sidebarr-icon" />
            <span className="sidebarr-text">Home</span>
          </Link>
          <Link to="/koleksiyon" className="sidebarr-link">
            <FaList className="sidebarr-icon" />
            <span className="sidebarr-text">Collections</span>
          </Link>
          <div className="sidebarr-link active">
            <FaGem className="sidebarr-icon" />
            <span className="sidebarr-text">{koleksiyon?.isim?.toUpperCase() || slug.toUpperCase()}</span>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-down-arrow">
            <svg width="100" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Hero Section */}
        <div className="hero-sectionn">
          <div className="hero-image-containerr">
            {koleksiyon?.gorselUrl ? (
              <img
                src={`http://localhost:3001${koleksiyon.gorselUrl}`}
                alt={koleksiyon.isim}
                className="heroo-image"
                loading="lazy"
              />
            ) : (
              <div className="hero-placeholder">
                <FaGem size={100} />
              </div>
            )}
            <div className="hero-overlayy">
              <div className="hero-conten" data-aos="fade-up">
                <h1 className="hero-titl">
                  {koleksiyon?.isim?.toUpperCase() || slug.toUpperCase()}
                </h1>
                {koleksiyon?.aciklama && (
                  <p className="hero-subtitle">
                    {koleksiyon.aciklama}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Collection Story Header */}
        <div className="collection-story">
          <div className="story-content">
            <h2 className="story-title" data-aos="fade-up">
              {koleksiyon?.isim?.toUpperCase() || slug.toUpperCase()} COLLECTION
            </h2>
            <p className="story-subtitle" data-aos="fade-up" data-aos-delay="200">
              {icerikler.length > 0 ? `${icerikler.length} özel içerik ile` : 'Yakında özel içeriklerle'}
            </p>
          </div>
        </div>
 {/* Text Content Section */}
        {textContents.length > 0 && (
          <div className="text-content-section">
            <h3 className="section-title" data-aos="fade-up">
              Stories & Details
            </h3>
            <div className="text-content-grid">
              {textContents.map((icerik, index) => (
                <div 
                  key={icerik.id} 
                  className="text-content-item"
                  data-aos="fade-up"
                  data-aos-delay={index * 200}
                >
                  <div className="text-card">
                    <h4 className="text-title">{icerik.baslik}</h4>
                    {icerik.aciklama && (
                      <p className="text-subtitle">{icerik.aciklama}</p>
                    )}
                    {icerik.yazi_icerik && (
                      <div 
                        className="text-content"
                        dangerouslySetInnerHTML={{ 
                          __html: icerik.yazi_icerik.replace(/\n/g, '<br/>') 
                        }}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Full-Width Image Gallery with Overlaid Text */}
        {imageContents.length > 0 && (
          <div className="image-gallery-section">
            <div className="image-gallery">
              {imageContents.map((icerik, index) => (
                <div 
                  key={icerik.id} 
                  className="gallery-item"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="image-containerr">
                    <img 
                      src={`http://localhost:3001${icerik.gorsel_url}`}
                      alt={icerik.baslik}
                      className="gallery-image"
                      loading="lazy"
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <h4 className="image-title">{icerik.baslik}</h4>
                        {icerik.aciklama && (
                          <p className="image-description">{icerik.aciklama}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

       

        {/* No Content Message */}
        {icerikler.length === 0 && (
          <div className="collection-story">
            <div className="no-content-elegant" data-aos="fade-up">
              <div className="no-content-icon">
                <FaGem size={60} />
              </div>
              <h3>Bu koleksiyonda henüz özel içerik bulunmuyor</h3>
              <p>Yakında bu koleksiyon için özel içerikler ve görseller eklenecek.</p>
            </div>
          </div>
        )}
      </div>

      
    </>
  );
};

export default KoleksiyonDinamik;