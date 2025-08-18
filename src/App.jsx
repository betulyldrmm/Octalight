import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Sayfa import'ları
import Home from './pages/Home';
import Koleksiyon from './pages/Koleksiyon/Koleksiyon';
import Tasarimcilar from './pages/Tasarimcilar/Tasarimcilar';
import Golden from './pages/Golden/Golden';
import Nest from './pages/Nest/Nest';
import Pearls from './pages/Pearls/Pearls';
import Ironmite from './pages/Ironmite/Ironmite';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import VizyonMisyon from './pages/VizyonMisyon/VizyonMisyon';
import Auth from './pages/Authh/Auth';
import UrunEkle from './pages/AdminPanel/UrunEkle';
import KoleksiyonEkle from './pages/AdminPanel/KoleksiyonEkle';
import KoleksiyonYeni from './pages/AdminPanel/KoleksiyonYeni';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import KoleksiyonDinamik from './pages/AdminPanel/KoleksiyonDinamik';
// Component import'ları
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ScrollToTop from './components/ScrollToTop';

// Harici kütüphaneler
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

// 404 Component
const NotFound = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    minHeight: '60vh',
    textAlign: 'center',
    padding: '2rem'
  }}>
    <h1 style={{ fontSize: '4rem', marginBottom: '1rem', color: '#fcfcfc' }}>404</h1>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fcfcfc' }}>Sayfa Bulunamadı</h2>
    <p style={{ marginBottom: '2rem', color: '#fcfcfc', opacity: 0.8 }}>
      Aradığınız sayfa mevcut değil veya taşınmış olabilir.
    </p>
    <a 
      href="/" 
      style={{ 
        padding: '0.75rem 1.5rem', 
        backgroundColor: '#D4AF37', 
        color: '#121212', 
        textDecoration: 'none', 
        borderRadius: '4px',
        fontWeight: 'bold'
      }}
    >
      Ana Sayfaya Dön
    </a>
  </div>
);

// Sabit koleksiyonların slug'larını tanımla
export const SABIT_KOLEKSIYONLAR = ['golden', 'nest', 'pearls', 'ironmite'];

// URL belirleme fonksiyonu - diğer component'lerde de kullanabilmek için export ediyoruz
export const getKoleksiyonUrl = (slug) => {
  return SABIT_KOLEKSIYONLAR.includes(slug) ? `/${slug}` : `/koleksiyonlar/${slug}`;
};

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
            {/* Ana sayfa route'ları */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            
            {/* Statik sayfalar */}
            <Route path="/hakkimizda" element={<About />} />
            <Route path="/about" element={<About />} />
            <Route path="/tasarimcilar" element={<Tasarimcilar />} />
            <Route path="/koleksiyon" element={<Koleksiyon />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/vizyonMisyon" element={<VizyonMisyon />} />
            
            {/* Sabit koleksiyonlar - özel sayfaları */}
            <Route path="/golden" element={<Golden />} />
            <Route path="/nest" element={<Nest />} />
            <Route path="/pearls" element={<Pearls />} />
            <Route path="/ironmite" element={<Ironmite />} />
            
            {/* Dinamik koleksiyonlar - KoleksiyonYeni sayfası */}
            <Route path="/koleksiyonlar/:slug" element={<KoleksiyonYeni />} />
            
            {/* Admin giriş ve panel */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin-panel" element={<AdminPanel />} />
            <Route path="/admin/urun-ekle" element={<UrunEkle />} />
            <Route path="/admin/KoleksiyonEkle" element={<KoleksiyonEkle />} />
             <Route path="/koleksiyon/:slug" element={<KoleksiyonDinamik />} />
            {/* 404 - Catch all route - Bu en sonda olmalı */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
        <CookieBanner />
        
        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
};

export default App;