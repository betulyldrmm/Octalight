import React from 'react';
import './Footer.css';
import { FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import ndmsoftwarelogo from '../assets/ndmsoftwarelogo.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        {/* Bülten */}
        <div className="newsletter">
          <h4>BÜLTENİMİZE ABONE OLUN</h4>
          <form className="newsletter-form">
            <input type="email" placeholder="E-posta adresiniz" />
            <button type="submit">ABONE OL</button>
          </form>
        </div>

        {/* Sosyal + Mail */}
        <div className="social-contact">
          <h4 className="follow-title">BİZİ TAKİP EDİN</h4>
          <div className="social-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
          <div className="email">info@octalight.com.tr</div>
        </div>
      </div>

      {/* Alt Bilgi */}
      <div className="footer-bottom">
        <p>© 2025 OCTALIGHT — Tüm hakları saklıdır</p>
        <div className="developed-by">
          <span>Developed by</span>
          <img
            src={ndmsoftwarelogo}
            alt="NDM Software Logo"
            className="developer-logo"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
