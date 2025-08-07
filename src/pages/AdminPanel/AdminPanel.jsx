// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('Admin');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/auth'); // Giriş yapılmadıysa yönlendir
    }

    // Zamanı güncelle
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/auth');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-container">
      <div className="admin-wrapper">
        {/* Header Section */}
        <div className="admin-header">
          <div className="welcome-section">
            <div className="admin-avatar">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="welcome-text">
              <h1 className="welcome-title">Hoş geldin, {adminName}!</h1>
              <p className="welcome-subtitle">Admin paneline başarıyla giriş yaptın</p>
            </div>
          </div>
          
          <div className="time-section">
            <div className="current-time">{formatTime(currentTime)}</div>
            <div className="current-date">{formatDate(currentTime)}</div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon products">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                <line x1="7" y1="7" x2="7.01" y2="7"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Ürün Yönetimi</h3>
              <p>Yeni ürünler ekle, düzenle</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon collections">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="stat-content">
              <h3>Koleksiyon Yönetimi</h3>
              <p>Koleksiyonları organize et</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <h2 className="section-title">Hızlı İşlemler</h2>
          
          <div className="action-grid">
            <button 
              onClick={() => navigate('/admin/urun-ekle')}
              className="action-btn primary"
            >
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <div className="btn-content">
                <span className="btn-title">Yeni Ürün Ekle</span>
                <span className="btn-subtitle">Kataloga ürün ekleyin</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/koleksiyon-ekle')}
              className="action-btn secondary"
            >
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                </svg>
              </div>
              <div className="btn-content">
                <span className="btn-title">Koleksiyon Ekle</span>
                <span className="btn-subtitle">Yeni koleksiyon oluşturun</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/urun-listesi')}
              className="action-btn info"
            >
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
              <div className="btn-content">
                <span className="btn-title">Ürün Listesi</span>
                <span className="btn-subtitle">Mevcut ürünleri görüntüle</span>
              </div>
            </button>

            <button 
              onClick={() => navigate('/admin/koleksiyon-listesi')}
              className="action-btn success"
            >
              <div className="btn-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="btn-content">
                <span className="btn-title">Koleksiyon Listesi</span>
                <span className="btn-subtitle">Koleksiyonları yönet</span>
              </div>
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <div className="logout-section">
          <button 
            onClick={handleLogout}
            className="logout-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16,17 21,12 16,7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Güvenli Çıkış
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;