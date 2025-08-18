import React, { useState } from 'react';
import './Tasarimcilar.css';
import Header from '../../components/Header';
import heroImage from '../../assets/1.jpg';
import designerImage from '../../assets/resimm.jpg'; // Resmi doğru şekilde import et
import Galeri from '../../components/Galeri';

const designers = [
  {
    id: 1,
    name: 'Shahed Tabsho',
    speciality: 'Mimar&Tasarımcı',
    image: designerImage, // Import edilen resmi kullan
    bio: ' Shahed Tabsho | Interior Architect & Lighting Designer Graduated with a Bachelors degree in Interior Architecture from Istanbul Technical University, Shahed is the founder and creative mind behind OctaLight, a lighting design brand based in France.Driven by a deep passion for lighting and storytelling through design, she creates unique and artistic lighting pieces that blend function with emotion. Each collection is crafted to evoke a feeling, tell a story, and bring quiet elegance into everyday spaces. ',
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
            <div className='line'></div>
            <p className="pozisyon">{selectedDesigner.speciality}</p>
            <p className="aciklama">{selectedDesigner.bio}</p>
            
            <div className="detail-stats">
              
              
            </div>
            
            
          </div>
        </div>
      </section>

   <Galeri></Galeri>
   
   <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Hayalinizdeki Işıklandırmayı Birlikte Yaratalım</h2>
            <p>Uzman tasarımcımızla ücretsiz danışmanlık için hemen iletişime geçin</p>
            
          </div>
        </div>
      </section>
   
    </>
  );
};

export default Tasarimcilar;