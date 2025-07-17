import './ResimKismi.css';

import img1 from "../assets/lamp.jpg";
import img2 from "../assets/1.jpg";
import img3 from "../assets/2.jpg";

const contentData = [
 
     {
       image: img1,
       text:
         'The pearl, a symbol of elegance and luxury, is reinterpreted in the Pearls collection through the power of contemporary design. This collection, where the clarity of crystal glass meets the warmth of golden details, brings sophisticated elegance to your spaces while revealing the magical dance of light.',
       title: 'The Meeting of Elegance and Light',
     },
     {
       image: img2,
       text:
         'Each piece blends the mastery of traditional craftsmanship with modern production techniques, offering not only functionality but also decorative value.',
       title: 'Harmony of Technology and Art',
     },
     {
       image: img3,
       text:
         'More than just lighting, Pearls is a collection of artistic creations that illuminate your spaces like precious jewels.',
       title: 'Timeless Value and Design',
     },
    ]

const ResimKismi3 = () => {
  return (
    <div className="modern-gallery">
      <div className="content-containerr">
        {contentData.map((item, index) => (
          <div key={index} className={`content-sectionn ${index === 1 ? 'reverse' : ''}`}>
            <div className="image-containerr">
              <img
                src={item.image}
                alt={`Golden Hour ${index + 1}`}
                className="section-imagee"
                loading="lazy"
              />
              <div className="image-overlayy"></div>
            </div>
            
            <div className="content-panell">
              <div className="section-numberr">
                {String(index + 1).padStart(2, '0')} / {String(contentData.length).padStart(2, '0')}
              </div>
              
              <div className="content-textt animate-fadeInUp">
                <h3 className="section-titlee">{item.title}</h3>
                <p className="section-textt">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResimKismi3;
