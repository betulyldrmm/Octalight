import React, { useState, useEffect } from 'react';
import './Donme.css';

const AdminDonme = ({ koleksiyonSlug }) => {
  const [urunler, setUrunler] = useState([]);
  const [aktifIndex, setAktifIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrunler = async () => {
      try {
        setLoading(true);
        
        // Koleksiyon slug'ına göre ürünleri çek
        const response = await fetch(`http://localhost:3001/api/koleksiyonlar/${koleksiyonSlug}/urunler`);
        const data = await response.json();
        
        if (data.success && data.urunler && data.urunler.length > 0) {
          setUrunler(data.urunler);
        } else {
          // Eğer koleksiyon özel ürünleri yoksa, genel ürünleri çek
          const fallbackResponse = await fetch(`http://localhost:3001/api/urunler/featured`);
          const fallbackData = await fallbackResponse.json();
          
          if (fallbackData.success) {
            setUrunler(fallbackData.urunler || []);
          }
        }
        
      } catch (error) {
        console.error('Ürün verileri çekilirken hata:', error);
        // Hata durumunda boş array kullan
        setUrunler([]);
      } finally {
        setLoading(false);
      }
    };

    if (koleksiyonSlug) {
      fetchUrunler();
    }
  }, [koleksiyonSlug]);

  useEffect(() => {
    if (urunler.length === 0) return;
    
    const interval = setInterval(() => {
      setAktifIndex((prev) => (prev + 1) % urunler.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [urunler.length]);

  const kartClassi = (index) => {
    if (urunler.length === 0) return 'urun-karti gizli';
    
    if (index === aktifIndex) return 'urun-karti aktif';
    if (index === (aktifIndex - 1 + urunler.length) % urunler.length) return 'urun-karti sol';
    if (index === (aktifIndex + 1) % urunler.length) return 'urun-karti sag';
    return 'urun-karti gizli';
  };

  if (loading) {
    return (
      <div className="donmedolap-wrapper" data-aos="zoom-in-up">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (urunler.length === 0) {
    return (
      <div className="donmedolap-wrapper" data-aos="zoom-in-up">
        <div className="no-products">
          <p>Bu koleksiyon için henüz ürün bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="donmedolap-wrapper" data-aos="zoom-in-up">
      <div className="kart-container">
        {urunler.map((item, index) => (
          <div className={kartClassi(index)} key={item.id}>
            <img 
              src={`http://localhost:3001${item.gorsel_url || item.gorselUrl || item.image}`} 
              alt={item.baslik || item.isim || item.name} 
              onError={(e) => {
                e.target.src = '/assets/default-product.jpg'; // Varsayılan resim
              }}
            />
            {(item.baslik || item.isim || item.name) && (
              <h3>{item.baslik || item.isim || item.name}</h3>
            )}
          </div>
        ))}
      </div>
      <br /><br /><br />
      <div className="dotss-container">
        {urunler.map((_, index) => (
          <div
            key={index}
            className={`dott ${index === aktifIndex ? 'active' : ''}`}
            onClick={() => setAktifIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminDonme;