// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'admin123') {
      // localStorage yerine state kullanıyoruz
      sessionStorage.setItem('adminToken', 'true');
      alert('Giriş başarılı!');
      navigate('/admin/KoleksiyonEkle'); // App.js'teki route'a uygun path
    } else {
      alert('Hatalı kullanıcı adı veya şifre');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-containerr">
        <div className="auth-header">
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7V10C2 16 6 20.88 12 22C18 20.88 22 16 22 10V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <h1 className="auth-title">Admin Panel</h1>
          <p className="auth-subtitle">Yönetim paneline erişim için giriş yapın</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-button">
            <span>Giriş Yap</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </form>

        <div className="test-info">
          <div className="info-badge">
            <span className="info-icon">ℹ</span>
            <span>Test bilgileri: <strong>admin</strong> / <strong>admin123</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;