// Tasarimcilar.jsx
import React from 'react';
import './Tasarimcilar.css';
import Header from '../../components/Header';
import heroImage from '../../assets/hero.jpg'; // hero.jpg dosyan src/assets klasöründe olmalı

const designerPhoto = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';

const Tasarimcilar = () => {
  return (
    <>
      <Header />
      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <h1 className="hero-title">TASARIMCILAR</h1>
        </div>
      </section>

      <main className="designer-main">
        <div className="designer-content">
          <div className="designer-photo">
            <img src={designerPhoto} alt="Mehmet Demir" />
          </div>
          <div className="designer-details">
            <h2 className="designer-name">Mehmet Demir</h2>
            <p className="designer-bio">
              Mehmet Demir, tasarım dünyasında minimalizm ve fonksiyonelliği birleştiren yaratıcı bir profesyoneldir.
              Her projesinde kullanıcı odaklı çözümler geliştirir ve detaylara önem verir. Tasarımlarında doğadan ve
              modern mimariden ilham alarak mekanlara sıcaklık ve estetik katar. Yenilikçi bakış açısıyla, her yaşam
              alanını bir sanat eserine dönüştürür.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Tasarimcilar;
