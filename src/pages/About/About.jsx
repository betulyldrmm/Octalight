
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
=======
import React, { useRef, useEffect } from 'react';
import './About.css';
import backgroundImage from '../assets/hakkindaplan.jpg';
import altGorsel from '../assets/hakkinda2.jpg';
import ucuncuGorsel from '../assets/hakkinda3.jpg';
import dorduncu from '../assets/hakkinda4.jpg';

const Ok = () => (
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
  const ikinciBolumRef = useRef(null);

  useEffect(() => {
    document.body.setAttribute('data-about', 'true');
    return () => document.body.removeAttribute('data-about');
  }, []);

  const handleArrowClick = () => {
    ikinciBolumRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. BÖLÜM */}
      <section
        id="hakkimizda"
        className="birincibolum"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="birincikisım">
          <div className="birincibolumyazi">
            <p>

It all began when we realized how a single light could bring a sense of peace to a room. OctaLight was born in those special moments when an ordinary lamp could transform a space into a magical atmosphere.
For us, light is more than just a tool for illumination; it’s an element that adds memories, warmth, and character to living spaces. Each of our collections reflects a different emotion and memory from life.
OctaLight started as a dream; today, it is turning into stories that leave a mark on your spaces.

</p>
          </div>
          <div className="ok" onClick={handleArrowClick} data-aos="fade-up">
            <Ok />
          </div>
        </div>
      </section>
      {/* 2. BÖLÜM */}
      <section
        className="ikincibolum"
        style={{ backgroundImage: `url(${altGorsel})` }}
        ref={ikinciBolumRef}
        data-aos="fade-up"
      >
        <div className="ikincibolumyazi" data-aos="fade-right" data-aos-delay="200">
          <p>
OctaLight is where lighting designs that stand out with simplicity and evoke emotions come together. Each piece is carefully crafted to appeal both to the eye and to the soul.
Every one of our collections brings a unique warmth to your living spaces with its story, texture, and modern lines. We aim for light to be not just a background element, but the main character that surrounds you every day.
With OctaLight, light leaves a real mark on your life.

          </p>
        </div>
      </section>

      {/* 3. BÖLÜM */}
      <section
        className="ucuncubolum"
        style={{ backgroundImage: `url(${ucuncuGorsel})` }}
        data-aos="fade-up"
      >
        <div className="ucuncubolumyazi" data-aos="fade-right" data-aos-delay="100">
          <p>

OctaLight brings together the elegance of classical art and contemporary design, transforming light into a timeless experience.
Each collection highlights the purity of light and the integrity of space with simple colors like black and white. In our designs, you’ll find the grace of minimalism and a sense of emotional depth in every detail.
At the intersection of light and design, OctaLight creates unique spaces far from the ordinary.

          </p>
        </div>
      </section>

      {/* 4. BÖLÜM */}
      <section
        className="dorduncubolum"
        style={{ backgroundImage: `url(${dorduncu})` }}
        data-aos="fade-up"
      >
        <div className="dorduncubolumyazi" data-aos="fade-right" data-aos-delay="200">
          <p>

OctaLight was born from the belief that when light touches a space, it creates a completely new atmosphere.
In each of our products, memories, aesthetic details, and the spirit of modern architecture come together. Our designs transform your spaces into warm, original, and unforgettable places.
With OctaLight, you’ll find humanity, memories, and elegance in every detail, bringing a new light into your life.

          </p>
        </div>
      </section>
    </>
  );
};

export default About;

