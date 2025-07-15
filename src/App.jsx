import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Koleksiyon from './pages/Koleksiyon/Koleksiyon';
import Golden from './pages/Golden/Golden';
import Nest from './pages/Nest/Nest';
import Pearls from './pages/Pearls/Pearls';
import Ronmite from './pages/Ronmite/Ronmite';

import Footer from './components/Footer';
import DonmeDolapKarti from './components/DonmeDolapKarti';
import CookieBanner from './components/CookieBanner';
import Header from './components/Header';
import About from './pages/About/About';
import Donme from './components/Donme';

import ScrollToTop from './components/ScrollToTop';

import AOS from 'aos';
import 'aos/dist/aos.css';
import Tasarimcilar from './pages/Tasarimcilar/Tasarimcilar';

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
      offset: 80,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div
        className="App"
        style={{
          backgroundColor: '#121212',
          minHeight: '100vh',
          color: '#fcfcfc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <main style={{ flex: 1 }}>
          <Header />

          <Routes>
            {/* Anasayfa */}
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <div
                    id="main-content"
                    style={{
                      backgroundColor: '#fcfcfc',
                      padding: '40px 0',
                    }}
                  >
                    <h1
                      style={{
                        textAlign: 'center',
                        padding: '5px 0',
                        fontSize: '32px',
                        color: '#232323',
                      }}
                    >
                      KOLEKSİYONUMUZU KEŞFET
                    </h1>
                    <DonmeDolapKarti />
                  </div>
                </>
              }
            />

            {/* Koleksiyon ve Diğer Sayfalar */}
           

            {/* Hakkımızda */}
        <Route path="/hakkimizda" element={<About />} />
         <Route path="/" element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="/koleksiyon" element={<Koleksiyon />} />
        <Route path="/golden" element={<Golden />} />
       <Route path="/nest" element={<Nest />} />
        <Route path="/pearls" element={<Pearls />} />
        <Route path="/ronmite" element={<Ronmite />} />
        <Route path="/about" element={<About/>}/>
 <Route path='/tasarimcilar' element={<Tasarimcilar/>}/>
          </Routes>
        </main>

        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
};

export default App;
