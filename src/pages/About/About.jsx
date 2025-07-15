import React, { useRef } from 'react';
import './About.css';
import backgroundImage from '../../assets/hakkindaplan.jpg';
import altGorsel from '../../assets/hakkinda2.jpg';
import ucuncuGorsel from '../../assets/hakkinda3.jpg';


import DonmeDolapKarti from '../../components/DonmeDolapKarti';

const DownArrow = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <polyline
      points="10,16 24,32 38,16"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const About = () => {
  const bottomImageRef = useRef(null);

  const handleArrowClick = () => {
    bottomImageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ÜSTTEKİ KISIM */}
      <section
        className="about-overlay-section"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="about-overlay-text" data-aos="fade-right">
          <h2>About the Brand</h2>
          <hr />
          <p><strong>• Story & Concept:</strong></p>
          <p>
            <strong>OctaLight</strong> is the creative vision of Shahed Tabsho, an interior architect driven by a passion for transforming spaces through light.
            Born from a deep fascination with light’s ability to shape atmospheres and influence moods,
            <strong> OctaLight</strong> bridges architecture, psychology, and emotion.
          </p>
          <p>
            Each collection reflects moments and memories, designed not only as functional objects but as emotional experiences.
            We believe light is more than illumination – it’s an atmosphere, a feeling, and a memory.
          </p>
        </div>
        <div className="about-down-arrow" onClick={handleArrowClick} data-aos="fade-up">
          <DownArrow />
        </div>
      </section>

      {/* ALTA KUTU VE FOTOĞRAF YAN YANA */}
      <div className="about-bottom-row" data-aos="fade-up">
        <div className="about-brand-box" data-aos="fade-right" data-aos-delay="200">
          <h2>About the Brand</h2>
          <div className="brand-underline"></div>
          <p><b>• Story & Concept:</b></p>
          <p>
            <b>OctaLight</b> is the creative vision of Shahed Tabsho, an interior architect driven by a passion for transforming spaces through light.
            Born from a deep fascination with light’s ability to shape atmospheres and influence moods, <b>OctaLight</b> bridges architecture, psychology, and emotion. Each collection reflects moments and memories, designed not only as functional objects but as emotional experiences.<br />
            We believe light is more than illumination, it’s an atmosphere, a feeling, and a memory.
          </p>
        </div>
        <div className="about-bottom-image" ref={bottomImageRef} data-aos="fade-left" data-aos-delay="300">
          <img src={altGorsel} alt="OctaLight Vision" />
        </div>
      </div>

      {/* 3. GÖRSEL + YANINDA RANDOM KUTU */}
      <div className="about-image-row" data-aos="fade-up">
        {/* Sol tarafta random yazı kutusu */}
        <div className="about-random-box" data-aos="fade-right" data-aos-delay="100">
          <h3>Did You Know?</h3>
          <p>
            Good lighting isn’t just about brightness—<b>it’s about creating atmosphere</b>.
            <br /><br />
            Whether you’re designing a cozy living room or a modern office, 
            the right lighting can make any space feel inviting, inspiring, and unique.
            <br /><br />
            <i>Light is not just something we see; it’s something we feel.</i>
          </p>
        </div>
        {/* Sağda büyük görsel */}
        <img className="about-random-img" src={ucuncuGorsel} alt="OctaLight Additional" data-aos="fade-left" data-aos-delay="300" />
      </div>
       
     
    
    </>
  );
};

export default About;
