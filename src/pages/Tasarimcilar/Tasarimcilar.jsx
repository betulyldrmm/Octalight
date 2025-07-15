import React from 'react';
import './Tasarimcilar.css';
import designerPhoto from '../../assets/designer.jpg';

const Tasarimcilar = () => {
  return (
    <section className="designer-section">
      <div className="designer-container">
        <div className="designer-header">
          <h1>TASARIMCILAR</h1>
          <p>
            Estetik ve işlevselliği bir araya getiren yaratıcı vizyonerlerimizle tanışın.
            Her biri, mekânlarınıza sadece görsel güzellik katmakla kalmaz, aynı zamanda ruh ve anlam da taşır.
            Tasarımlarında doğadan ilham alır, modern çizgilerle klasik unsurları harmanlarlar.
            Sürekli yenilik peşindedirler ve mekanlarınıza değer katan detaylara büyük önem verirler.
            Sizin için en iyi yaşam alanlarını yaratmak amacıyla sanat ve teknolojiyi birleştirirler.
          </p>
        </div>

        <div className="designer-card">
          <div className="designer-image-wrapper">
            <img src={designerPhoto} alt="Tasarımcı Ayşe Yılmaz" className="designer-image" />
          </div>
          <div className="designer-info">
            <h2 className="designer-name">Ayşe Yılmaz</h2>
            <p className="designer-bio">
              Ayşe Yılmaz, tasarımlarında doğallığı ve sıcaklığı merkeze alır. Golden Hour ve Pearls koleksiyonları ile zarif, minimal ve huzur veren mekanlar yaratır.
              Lüksü yalınlıkla buluşturarak çağdaş estetiği yaşam alanlarına taşır.
              Tasarım sürecinde kullanıcı deneyimini ön planda tutar ve mekânların ruhunu yansıtacak özel çözümler üretir.
              Sanat ve işlevselliği dengede tutarak her projeyi benzersiz kılar.
            </p>
            <button className="designer-button">Daha Fazla</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tasarimcilar;
