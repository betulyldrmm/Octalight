// src/pages/Auth.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Hata mesajını temizle
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Giriş isteği gönderiliyor...');
      
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      console.log('Response status:', response.status);
      
      // Eğer response HTML ise (404 sayfası), hata ver
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend sunucusu çalışmıyor! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        console.log('Token alındı:', data.token);
        
        // Token'ı hem localStorage hem sessionStorage'a 'token' adıyla kaydet
        localStorage.setItem('token', data.token);
        sessionStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        // Token kaydedildi mi kontrol et
        const savedToken = localStorage.getItem('token');
        console.log('Kaydedilen token:', savedToken);
        
        if (savedToken) {
          console.log('✅ Token başarıyla kaydedildi');
          alert('Giriş başarılı!');
          navigate('/admin/KoleksiyonEkle');
        } else {
          console.error('❌ Token kaydedilemedi!');
          setError('Token kaydetme hatası');
        }
      } else {
        setError(data.message || 'Giriş yapılamadı');
      }
    } catch (error) {
      console.error('Giriş hatası:', error);
      if (error.message.includes('fetch')) {
        setError('Backend sunucusu çalışmıyor! Terminal\'de "node users.js" komutunu çalıştırın.');
      } else {
        setError(error.message || 'Sunucu ile bağlantı kurulamadı');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Form validasyonu
    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      console.log('Kayıt isteği gönderiliyor...');
      
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });

      console.log('Response status:', response.status);
      
      // Eğer response HTML ise (404 sayfası), hata ver
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Backend sunucusu çalışmıyor! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        alert('Hesap başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');
        setIsLogin(true);
        setFormData({
          username: formData.username, // Username'i koru
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setError(data.message || 'Kayıt yapılamadı');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      if (error.message.includes('fetch')) {
        setError('Backend sunucusu çalışmıyor! Terminal\'de "node users.js" komutunu çalıştırın.');
      } else {
        setError(error.message || 'Sunucu ile bağlantı kurulamadı');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setError('');
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
          <h1 className="auth-title">
            {isLogin ? 'Admin Panel' : 'Hesap Oluştur'}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? 'Yönetim paneline erişim için giriş yapın' 
              : 'Yeni admin hesabı oluşturun'
            }
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="auth-form">
          <div className="form-group">
            <label className="form-label">Kullanıcı Adı</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Kullanıcı adınızı girin"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">E-posta</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="E-posta adresinizi girin"
                required
                disabled={loading}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="form-input"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Şifre Tekrar</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            <span>{loading ? 'İşlem yapılıyor...' : (isLogin ? 'Giriş Yap' : 'Hesap Oluştur')}</span>
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </form>

        <div className="auth-switch">
          <p>
            {isLogin 
              ? 'Hesabınız yok mu? ' 
              : 'Zaten hesabınız var mı? '
            }
            <button 
              type="button" 
              onClick={toggleAuthMode}
              className="switch-button"
              disabled={loading}
            >
              {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="test-info">
            <div className="info-badge">
              <span className="info-icon">ℹ</span>
              <span>Varsayılan: <strong>admin</strong> / <strong>admin123</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;