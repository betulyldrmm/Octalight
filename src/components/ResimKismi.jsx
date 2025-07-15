
import './ResimKismi.css';

import lamp from "../assets/lamp.jpg";
import resim from "../assets/1.jpg";
import lamba from "../assets/2.jpg";

const contentData = [
  {
    image: lamp,
    title: 'The Meeting of Elegance and Light',
    text: "The Golden Hour collection brings the magic of the day's most enchanting moments into your living spaces, blending the elegance of warm golden tones with modern design. This line recreates the magic of natural light, creating a timeless atmosphere in your interiors while offering the perfect balance of luxury and comfort."
  },
  {
    image: lamba,
    title: 'Harmony of Technology and Art',
    text: 'Behind the minimalist forms lies sophisticated technology, transforming each piece into not only a lighting element but also an artistic expression. This collection reflects the pursuit of perfection in every detail and is designed with an understanding of the dynamics of modern life.'
  },
  {
    image: resim,
    title: 'Timeless Value and Design',
    text: 'Blending the warmth of gold with the functionality of modern life, this collection promises much more than ordinary lighting. Each piece creates timeless value, transforming your living spaces into works of art.'
  },
];

const ResimKismi = () => {
  return (
    <div className="modern-gallery">
      <div className="content-container">
        {contentData.map((item, index) => (
          <div key={index} className={`content-section ${index === 1 ? 'reverse' : ''}`}>
            <div className="image-container">
              <img
                src={item.image}
                alt={`Golden Hour ${index + 1}`}
                className="section-image"
                loading="lazy"
              />
              <div className="image-overlay"></div>
            </div>
            
            <div className="content-panel">
              <div className="section-number">
                {String(index + 1).padStart(2, '0')} / {String(contentData.length).padStart(2, '0')}
              </div>
              
              <div className="content-text animate-fadeInUp">
                <h3 className="section-title">{item.title}</h3>
                <p className="section-text">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResimKismi;