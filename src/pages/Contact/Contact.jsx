import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./Contact.css";

const COUNTRIES = [
  "Türkiye", "Germany", "France", "USA", "UK", "Italy", "Other"
];

const Contact = () => {
  const [country, setCountry] = useState("");
  const [otherCountry, setOtherCountry] = useState("");

  return (
    <div className="contact-pro-bg">
      {/* Hero / Başlık alanı */}
      <div className="contact-pro-hero">
  <span className="contact-title-accent"></span>
  <h1 className="contact-pro-title">Contact</h1>

        
      </div>

      {/* Ana form kartı */}
  <div className="contact-pro-card">
  <form className="contact-pro-form">
    <div className="contact-pro-form-row">
      <input type="text" placeholder="First Name" required />
    </div>
    <div className="contact-pro-form-row">
      <input type="text" placeholder="Last Name" required />
    </div>
    <div className="contact-pro-form-row">
      <input type="email" placeholder="Email" required />
    </div>
    <div className="contact-pro-form-row">
      <input type="text" placeholder="Address" required />
    </div>
    <div className="contact-pro-form-row">
      <input type="text" placeholder="Phone" required />
    </div>
    <div className="contact-pro-form-row">
      <select
        required
        value={country}
        onChange={e => setCountry(e.target.value)}
      >
        <option value="" disabled>Country</option>
        <option value="Türkiye">Türkiye</option>
        <option value="Germany">Germany</option>
        <option value="France">France</option>
        <option value="USA">USA</option>
        <option value="UK">UK</option>
        <option value="Italy">Italy</option>
        <option value="Other">Other</option>
      </select>
    </div>
    {country === "Other" && (
      <div className="contact-pro-form-row">
        <input
          type="text"
          className="fade-in-country"
          placeholder="Please specify your country"
          value={otherCountry}
          onChange={e => setOtherCountry(e.target.value)}
          required
        />
      </div>
    )}
    <div className="contact-pro-form-row">
      <textarea placeholder="Your Message" required />
    </div>
    <button className="contact-pro-btn" type="submit">
      Send the message
    </button>
  </form>
</div>

      {/* Find Us Here */}
      <div className="contact-pro-findus-row">
        <div className="contact-pro-findus-box">
          <FaPhoneAlt className="findus-icon" />
          <div className="findus-title">Phone</div>
          <div className="findus-desc">+90 284 521 202</div>
        </div>
        <div className="contact-pro-findus-box">
          <FaEnvelope className="findus-icon" />
          <div className="findus-title">Email</div>
          <div className="findus-desc">info@octalight.com</div>
        </div>
        <div className="contact-pro-findus-box">
          <FaMapMarkerAlt className="findus-icon" />
          <div className="findus-title">Location</div>
          <div className="findus-desc">Ankara, Çankaya</div>
        </div>
      </div>

      {/* Harita */}
      <div className="contact-pro-map">
        <iframe
          title="Office Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24408.6784378124!2d32.847793955298225!3d39.90495630265466!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34f32d181a8ed%3A0xd91ce28c9789e46c!2zS3XFn2x1IFBhcmsgLSDDnG5jZWxpIE1lcmtlemk!5e0!3m2!1str!2str!4v1721296830190!5m2!1str!2str"
          width="100%"
          height="290"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
        />
      </div>
      <div className="footer-gap"></div>  {/* TAM BURAYA */}
    </div>
  );
};

export default Contact;
