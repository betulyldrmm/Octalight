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
import Contact from './pages/Contact/Contact';
import ScrollToTop from './components/ScrollToTop';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/tasarimcilar" element={<Tasarimcilar />} />
            <Route path="/koleksiyon" element={<Koleksiyon />} />
            <Route path="/golden" element={<Golden />} />
            <Route path="/nest" element={<Nest />} />
            <Route path="/pearls" element={<Pearls />} />
            <Route path="/ironmite" element={<Ironmite />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </Router>
  );
};

export default App;
