import React from 'react';
import './Galeri.css';
import img1 from '../assets/1.jpg';
import img2 from '../assets/2.jpg';
import img3 from '../assets/3.jpg';
import img4 from '../assets/4.jpg';
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
