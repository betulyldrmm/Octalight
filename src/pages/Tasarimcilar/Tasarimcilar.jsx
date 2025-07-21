import React, { useState } from 'react';
import './Tasarimcilar.css';
import Header from '../../components/Header';
import heroImage from '../../assets/lam.jpg';
import Galeri from '../../components/Galeri';

const designers = [
  {
    id: 1,
    name: 'Mehmet Demir',
    speciality: 'İç Mimar & Konsept Tasarımcı',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    bio: ' Minimalizm ve fonksiyonelliği birleştiren yaratıcı bir profesyonel. 15 yıllık deneyimiyle modern yaşam alanları tasarlıyor. Minimalizm ve fonksiyonelliği birleştiren yaratıcı bir profesyonel. 15 yıllık deneyimiyle modern yaşam alanları tasarlıyor. Minimalizm ve fonksiyonelliği birleştiren yaratıcı bir profesyonel. 15 yıllık deneyimiyle modern yaşam alanları tasarlıyor.',
   
    experience: '15+ Yıl',
    projects: '200+',
    awards: '12',
    skills: ['Minimalist Tasarım', 'Konsept Geliştirme', '3D Modelleme', 'Proje Yönetimi']
  }
];

const scrollToContent = () => {
  const designersSection = document.querySelector('.tasarimcilar-section');
  if (designersSection) {
    designersSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const Tasarimcilar = () => {
  const [selectedDesigner] = useState(designers[0]);

  return (
    <>
      <Header />

      <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">TASARIMCILAR</h1>
            <p className="hero-subtitle">Yaşam Alanlarınızı Dönüştürüyoruz</p>
          </div>
        </div>
        <div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-indicator">
            <div className="scroll-arrow">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="none">
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>


      <section className="tasarimcilar-section">
      
        <div className="tek-kart-wrapper">
          <div className="tasarimci-resim-wrapper">
            <img src={selectedDesigner.image} alt={selectedDesigner.name} className="tasarimci-resim" />
          </div>
          <div className="tasarimci-bilgi">
            <h3 className="isim">{selectedDesigner.name}</h3>
            <p className="pozisyon">{selectedDesigner.speciality}</p>
            <p className="aciklama">{selectedDesigner.bio}</p>

            <div className="detail-stats">
              <div className="stat">
                <div className="stat-value">{selectedDesigner.experience}</div>
                <div className="stat-name">Deneyim</div>
              </div>
              <div className="stat">
                <div className="stat-value">{selectedDesigner.projects}</div>
                <div className="stat-name">Proje</div>
              </div>
              <div className="stat">
                <div className="stat-value">{selectedDesigner.awards}</div>
                <div className="stat-name">Ödül</div>
              </div>
            </div>

            <div className="detail-skills">
              <h3>Uzmanlık Alanları</h3>
              <div className="skills-list">
                {selectedDesigner.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
   <Galeri></Galeri>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Hayalinizdeki Mekanı Birlikte Yaratalım</h2>
            <p>Uzman tasarımcılarımızla ücretsiz danışmanlık için hemen iletişime geçin</p>
            <button className="cta-button">Ücretsiz Danışmanlık</button>
          </div>
        </div>
      </section>
  
    </>
  );
};

export default Tasarimcilar;
