import React from 'react';
import './Galeri.css';
import img1 from '../assets/7.jpg';
import img2 from '../assets/22.jpg';
import img3 from '../assets/9.jpg';
import img4 from '../assets/8.jpg';
import img5 from '../assets/gece.jpg';


const Galeri = () => {
  const images = [img1, img2, img3, img4, img5];

  return (
    <div className="galeri-container">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Foto ${index + 1}`}
          className="galeri-foto"
        />
      ))}
    </div>
  );
};
 
export default Galeri;
