import React from 'react';
import bgImage from '../assets/arkaplan.jpg';
import Header from '../components/Header';
import DonmeDolapKarti from '../components/DonmeDolapKarti';

const Home = () => {
  const scrollToContent = () => {
    const content = document.getElementById('main-content');
    content?.scrollIntoView({ behavior: 'smooth' });
  };

  const homeStyle = {
    width: '100%',
    height: '100vh',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
  };

  const overlayStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingBottom: 0,
  };

  const scrollBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    paddingBottom: '40px',
  };

  return (
    <>
      <Header />
      <style>
        {`
          .scroll-down svg {
            width: 52px;
            height: 52px;
            display: block;
            transition: filter 0.3s;
            filter: drop-shadow(0 2px 6px #23232370);
          }
          .scroll-down:hover svg {
            filter: drop-shadow(0 2px 12px #fcfcfc80);
          }
        `}
      </style>
      <div style={homeStyle}>
        <div style={overlayStyle}>
          <button
            className="scroll-down"
            style={scrollBtnStyle}
            onClick={scrollToContent}
            aria-label="Aşağı kaydır"
          >
            <svg viewBox="0 0 48 48" fill="none">
              <polyline
                points="10,16 24,32 38,16"
                fill="none"
                stroke="#fcfcfc"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        id="main-content"
        style={{
          backgroundColor: "#fcfcfc",
          minHeight: "100vh",
          width: "100%",
          paddingTop: "40px",
          display: "flex",
          flexDirection: "column",    
          alignItems: "center"       
        }}
      >
        <h1
          style={{
            textAlign: "center",
            padding: "5px 0 30px 0",
            fontSize: "32px",
            color: "#232323",
            fontFamily: "Montserrat, Arial, sans-serif",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
        >
          KOLEKSİYONUMUZU KEŞFET
        </h1>

        <DonmeDolapKarti />
      </div>
    </>
  );
};

export default Home;
