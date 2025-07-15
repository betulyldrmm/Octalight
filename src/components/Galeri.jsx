import React, { useState } from 'react';
import "./Galeri.css"
import lamp from "../assets/lamp.jpg";
const Galeri = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [lamp, lamp, lamp];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="gallery-container">
      <h1 className="gallery-title">GALERİ</h1>
      
      <div className="gallery-wrapper">
        <div className="gallery-track" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((image, index) => (
            <div key={index} className="gallery-slide">
              <img src={image} alt={`Lamp ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="gallery-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Galeri;