import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Koleksiyon from './pages/Koleksiyon/Koleksiyon';
import Tasarimcilar from './pages/Tasarimcilar/Tasarimcilar'; 
import Golden from './pages/Golden/Golden';
import Nest from './pages/Nest/Nest';
import Pearls from './pages/Pearls/Pearls';
import Ironmite from './pages/Ironmite/Ironmite';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import Header from './components/Header';
import About from './pages/About/About';
import Donme from './components/Donme';
import Auth from './pages/Authh/Auth';

import Contact from './pages/Contact/Contact';
import ScrollToTop from './components/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';
import VizyonMisyon from './pages/VizyonMisyon/VizyonMisyon';

// DonmeDolapKarti importu yok, ekledim (doğru yolu kontrol et)
import DonmeDolapKarti from './components/DonmeDolapKarti'; 

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
        <Header />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Anasayfa özel */}
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

            {/* Diğer rotalar */}
            <Route path="/home" element={<Home />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/tasarimcilar" element={<Tasarimcilar />} />
            <Route path="/koleksiyon" element={<Koleksiyon />} />
            <Route path="/golden" element={<Golden />} />
            <Route path="/nest" element={<Nest />} />
            <Route path="/pearls" element={<Pearls />} />
            <Route path="/ironmite" element={<Ironmite />} />
            <Route path="/contact" element={<Contact />} />
          
            <Route path="/vizyonMisyon" element={<VizyonMisyon />} />
            <Route path='/auth' element={<Auth/>}/>
           
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
};

export default App;
