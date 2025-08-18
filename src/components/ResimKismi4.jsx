import './ResimKismi.css';

import img1 from "../assets/7.jpg";
import img2 from "../assets/8.jpg";
import img3 from "../assets/9.jpg";

const contentData = [
 
     {
       image: img1,
       text:
         'Combining the power of industrial design with the elegance of minimalist aesthetics, the Ironmute collection creates a bold statement in modern living spaces. The contrast between the cold character of black metal and the warmth of light forms a dramatic and impressive atmosphere in your spaces, pushing the boundaries of contemporary design.',
       title: 'The Meeting of Elegance and Light',
     },
     {
       image: img2,
       text:
         'With the sharpness of geometric forms and the perfection of functional design coming together, these creations go beyond lighting to bring a unique character to your interiors.',
       title: 'Harmony of Technology and Art',
     },
     {
       image: img3,
       text:
         'Ironmute is a collection that creates a strong visual impact in your spaces while reflecting the dynamism of modern life.',
       title: 'Timeless Value and Design',
     },
    ]

const ResimKismi4 = () => {
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

export default ResimKismi4;
