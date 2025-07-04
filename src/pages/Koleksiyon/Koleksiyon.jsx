import React from 'react'
import './Koleksiyon.css'
import Header from '../../components/Header'

const Koleksiyon = () => {
  return (
    <>
   <Header></Header>
    <div className="koleksiyon-container">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">ANASAYFA</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-item">KOLEKSİYON</span>
      </div>

      {/* Main Title */}
      <h1 className="main-title">TÜM ÜRÜNLER</h1>
      
      {/* Subtitle */}
      <p className="subtitle">Çeşitlilikte enginlik.</p>

      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-left">
          <span className="filter-label">FİLTRELER</span>
        </div>
        
        <div className="filter-center">
          <div className="filter-dropdown">
            <span className="dropdown-label">KOLEKSİYON</span>
            <select className="dropdown-select">
              <option value="">Tüm Ürünler</option>
            </select>
          </div>
          
          <div className="filter-dropdown">
            <span className="dropdown-label">KATEGORİ</span>
            <select className="dropdown-select">
              <option value="">Tümü</option>
            </select>
          </div>
        </div>
        
        <div className="filter-right">
          <span className="product-count">196 ÜRÜN GÖSTERİLİYOR</span>
        </div>
      </div>
    </div>
    </>
  )
}

export default Koleksiyon