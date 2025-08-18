import React, { useState, useEffect } from 'react';
import './ResimKismi.css';

const ResimKismi5 = ({ koleksiyonSlug }) => {
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentData = async () => {
      try {
        setLoading(true);
        
        // Koleksiyon slug'ına göre resim içeriklerini çek
        const response = await fetch(`http://localhost:3001/api/koleksiyonlar/${koleksiyonSlug}/resim-icerik`);
        const data = await response.json();
        
        if (data.success && data.icerikler && data.icerikler.length > 0) {
          // Admin panelinden gelen verileri uygun formata çevir
          const formattedData = data.icerikler.map(item => ({
            image: `http://localhost:3001${item.gorsel_url || item.gorselUrl}`,
            title: item.baslik || item.title,
            text: item.aciklama || item.yazi_icerik || item.text || ''
          }));
          setContentData(formattedData);
        } else {
          // Eğer koleksiyon özel içerikleri yoksa, genel içerikleri çek
          const fallbackResponse = await fetch(`http://localhost:3001/api/genel-icerik/resim-icerik`);
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.success && fallbackData.icerikler) {
            const formattedFallbackData = fallbackData.icerikler.map(item => ({
              image: `http://localhost:3001${item.gorsel_url || item.gorselUrl}`,
              title: item.baslik || item.title,
              text: item.aciklama || item.yazi_icerik || item.text || ''
            }));
            setContentData(formattedFallbackData);
          } else {
            // Hiç veri yoksa varsayılan içerik kullan
            setContentData([]);
          }
        }
        
      } catch (error) {
        console.error('Resim içerik verileri çekilirken hata:', error);
        setContentData([]);
      } finally {
        setLoading(false);
      }
    };

    if (koleksiyonSlug) {
      fetchContentData();
    }
  }, [koleksiyonSlug]);

  if (loading) {
    return (
      <div className="modern-gallery">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>İçerikler yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (contentData.length === 0) {
    return (
      <div className="modern-gallery">
        <div className="no-content-container">
          <p>Bu koleksiyon için henüz resim içeriği bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-gallery">
      <div className="content-containerr">
        {contentData.map((item, index) => (
          <div key={index} className={`content-sectionn ${index === 1 ? 'reverse' : ''}`}>
            <div className="image-containerr">
              <img
                src={item.image}
                alt={item.title}
                className="section-imagee"
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/assets/default-image.jpg'; // Varsayılan resim
                }}
              />
              <div className="image-overlayy"></div>
            </div>
            
            <div className="content-panell">
              <div className="section-numberr">
                {String(index + 1).padStart(2, '0')} / {String(contentData.length).padStart(2, '0')}
              </div>
              
              <div className="content-textt animate-fadeInUp">
                <h3 className="section-titlee">{item.title}</h3>
                <p className="section-textt">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResimKismi5;