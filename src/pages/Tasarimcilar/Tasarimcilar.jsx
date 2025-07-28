import React, { useState } from 'react';
import './Tasarimcilar.css';
import Header from '../../components/Header';
import heroImage from '../../assets/t.png';
import Galeri from '../../components/Galeri';

const designers = [
  {
    id: 1,
    name: 'Mehmet Demir',
    speciality: 'İç Mimar & Konsept Tasarımcı',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    bio: '( Shahed Tabsho | Interior Architect & Lighting Designer Graduated with a Bachelor’s degree in Interior Architecture from Istanbul Technical University, Shahed is the founder and creative mind behind OctaLight, a lighting design brand based in France.Driven by a deep passion for lighting and storytelling through design, she creates unique and artistic lighting pieces that blend function with emotion. Each collection is crafted to evoke a feeling, tell a story, and bring quiet elegance into everyday spaces. )',
   
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

     
      
        <div className="scroll-down-container" onClick={scrollToContent}>
          <div className="scroll-indicator">
            
          </div>
        </div>
  


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
            <h2>Hayalinizdeki Işıklandırmayı Birlikte Yaratalım</h2>
            <p>Uzman tasarımcılarımızla ücretsiz danışmanlık için hemen iletişime geçin</p>
                 </div>
        </div>
      </section>
  
    </>
  );
};

export default Tasarimcilar;
