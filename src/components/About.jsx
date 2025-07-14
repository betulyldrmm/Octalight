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
