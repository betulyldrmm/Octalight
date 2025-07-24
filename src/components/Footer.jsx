import './Footer.css';
import React from "react";
import { FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";
import ndmsoftwarelogo from '../assets/ndmsoftwarelogo.jpg';

const Footer = () => (
  <footer>
    <div className="footer">
      <div className="footer-left">
        <div className="footer-logo">OCTALIGHT</div>
        <div className="newsletter-title">BÜLTENİMİZE ABONE OLUN</div>
        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
          <input type="email" placeholder="E-posta Adresi" required />
          <button type="submit">ABONE OL</button>
        </form>
      </div>
      <div className="footer-right">
        <div className="footer-menu">
          <a href="/home">ANASAYFA</a>
          <a href="/about">HAKKIMIZDA</a>
          <a href="/koleksiyon">KOLEKSİYON</a>
          <a href="/tasarimcilar">TASARIMCILAR</a>
          <a href="#">VİZYON-MİSYON</a>
          <a href="/contact">İLETİŞİM</a>
        </div>
        <div className="footer-social-title">BİZİ TAKİP EDİN</div>
        <div className="footer-social">
          <a href="#"><FaInstagram /></a>
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaLinkedin /></a>
        </div>
        <div className="footer-mail">info@octalight.com</div>
      </div>
    </div>
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

export default Footer;
