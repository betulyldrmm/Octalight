import React from 'react';
import './VizyonMisyon.css';
import Header from '../../components/Header';
import lamba from '../../assets/6.jpg';
import lamba1 from '../../assets/7.jpg';

const VizyonMisyon = () => {
  return (
    <>
      <Header />
      
      <div className="vizyon-misyon-container">
        <div className="content-wrapper">
          <div className="text-content">
            <section className="vizyon-section">
              <h2>Vizyonumuz</h2>
              <p>
                OctaLight olarak, ışığın sadece aydınlatma değil, aynı zamanda duygu ve hikaye anlatımının 
                da bir aracı olduğuna inanıyoruz. Vizyonumuz, her mekanda benzersiz bir atmosfer yaratarak 
                insanların yaşam kalitesini artırmak ve günlük yaşamlarına estetik değer katmaktır. 
                Işığın gücüyle mekanları dönüştürüp, her köşede sanat eseri niteliğinde tasarımlar 
                sunarak sektörde öncü bir marka olmayı hedefliyoruz.
              </p>
              <p>
                Gelecekte, sürdürülebilir ve çevre dostu teknolojilerle birlikte, global ölçekte 
                tanınan bir tasarım markası olarak ışık dünyasında yenilikçi çözümler sunmaya 
                devam edeceğiz. Her projemizde özgünlük, kalite ve işlevselliği bir araya getirerek, 
                müşterilerimizin hayallerini gerçeğe dönüştürmeyi amaçlıyoruz.
              </p>
            </section>

            <section className="misyon-section">
              <h2>Misyonumuz</h2>
              <p>
                Misyonumuz, işlevsellik ve estetik değerleri harmanlayarak, her müşterinin ihtiyaç 
                ve beklentilerine özel aydınlatma çözümleri geliştirmektir. İç mimari ve ışık tasarımı 
                alanındaki uzmanlığımızı kullanarak, mekanların potansiyelini ortaya çıkaran ve 
                kullanıcı deneyimini zenginleştiren tasarımlar yaratıyoruz.
              </p>
              <p>
                Yenilikçi teknolojiler ve yaratıcı tasarım anlayışımızla, her projeye özgün bir 
                yaklaşım sergileyerek müşteri memnuniyetini en üst düzeyde tutmayı amaçlıyoruz. 
                Kaliteli malzemeler ve titiz işçilik ile ürettiğimiz ürünlerle, ışığın büyüsünü 
                her eve ve iş yerine taşımak en temel misyonumuzdur.
              </p>
              <p>
                Sürdürülebilir tasarım ilkeleri doğrultusunda, çevreye duyarlı üretim süreçleri 
                benimser ve uzun ömürlü, enerji verimli aydınlatma sistemleri geliştiririz. 
                Müşterilerimizle kurduğumuz güçlü işbirliği sayesinde, her projede mükemmellik 
                standartlarını yakalayarak sektörde güvenilir bir partner olmayı sürdürüyoruz.
              </p>
            </section>

            <div className="section-divider"></div>

            <div className="images-section">
              <div className="image-container">
                <img src={lamba} alt="Vizyon görüntüsü" className="vizyon-image" />
              </div>
              <div className="image-container">
                <img src={lamba1} alt="Misyon görüntüsü" className="misyon-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VizyonMisyon;