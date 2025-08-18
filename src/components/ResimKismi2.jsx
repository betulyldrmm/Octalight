import './ResimKismi.css';

import img1 from "../assets/22.jpg";
import img2 from "../assets/33.jpg";
import img3 from "../assets/44.jpg";

const contentData = [
 
     {
       image: img1,
       text:
         'Inspired by nature’s organic forms, the Nest collection brings warmth and tranquility to your living spaces with soft lines and gentle light.',
       title: 'The Meeting of Elegance and Light',
     },
     {
       image: img2,
       text:
         'The comfort of rounded forms merges with contemporary technology, creating designs that connect emotionally as well as visually.',
       title: 'Harmony of Technology and Art',
     },
     {
       image: img3,
       text:
         'Nest does not only light your space, it makes it livable.',
       title: 'Timeless Value and Design',
     },
    ]

const ResimKismi2 = () => {
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

export default ResimKismi2;
