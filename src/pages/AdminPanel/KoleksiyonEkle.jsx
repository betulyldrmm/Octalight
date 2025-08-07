// src/pages/KoleksiyonEkle.jsx
import React, { useState } from 'react';
import './KoleksiyonEkle.css';

const KoleksiyonEkle = () => {
  const [koleksiyonlar, setKoleksiyonlar] = useState([
    { isim: '', aciklama: '', slug: '', gorsel: null }
  ]);

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...koleksiyonlar];
    updated[index][name] = value;
    setKoleksiyonlar(updated);
  };

  const handleFileChange = (index, e) => {
    const updated = [...koleksiyonlar];
    updated[index].gorsel = e.target.files[0];
    setKoleksiyonlar(updated);
  };

  const addRow = () => {
    setKoleksiyonlar([...koleksiyonlar, { isim: '', aciklama: '', slug: '', gorsel: null }]);
  };

  const removeRow = (index) => {
    if (koleksiyonlar.length > 1) {
      const updated = koleksiyonlar.filter((_, i) => i !== index);
      setKoleksiyonlar(updated);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    koleksiyonlar.forEach((k, i) => {
      formData.append(`koleksiyonlar[${i}][isim]`, k.isim);
      formData.append(`koleksiyonlar[${i}][aciklama]`, k.aciklama);
      formData.append(`koleksiyonlar[${i}][slug]`, k.slug);
      if (k.gorsel) {
        formData.append(`koleksiyonlar[${i}][gorsel]`, k.gorsel);
      }
    });

    try {
      const res = await fetch('http://localhost:3001/api/koleksiyonlar/bulk', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert('Koleksiyonlar başarıyla eklendi!');
        setKoleksiyonlar([{ isim: '', aciklama: '', slug: '', gorsel: null }]);
      } else {
        alert(data.error || 'Bir hata oluştu.');
      }
    } catch (err) {
      console.error(err);
      alert('Sunucu hatası.');
    }
  };

  return (
    <div className="page-container">
      <div className="koleksiyon-wrapper">
        <div className="header-section">
          <div className="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
          <h1 className="page-title">Yeni Koleksiyon Ekle</h1>
          <p className="page-subtitle">Koleksiyonlarınızı düzenleyin ve yönetin</p>
        </div>

        <form onSubmit={handleSubmit} className="koleksiyon-form">
          {koleksiyonlar.map((koleksiyon, index) => (
            <div key={index} className="collection-card">
              <div className="card-header">
                <h3 className="card-title">Koleksiyon #{index + 1}</h3>
                {koleksiyonlar.length > 1 && (
                  <button 
                    type="button" 
                    className="remove-btn" 
                    onClick={() => removeRow(index)}
                    title="Bu koleksiyonu sil"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                )}
              </div>

              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Koleksiyon İsmi</label>
                  <input
                    type="text"
                    name="isim"
                    placeholder="Örn: Yaz Koleksiyonu"
                    value={koleksiyon.isim}
                    onChange={(e) => handleInputChange(index, e)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Slug (URL)</label>
                  <input
                    type="text"
                    name="slug"
                    placeholder="örn: yaz-koleksiyonu"
                    value={koleksiyon.slug}
                    onChange={(e) => handleInputChange(index, e)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label className="input-label">Açıklama</label>
                  <input
                    type="text"
                    name="aciklama"
                    placeholder="Koleksiyon hakkında kısa bir açıklama yazın..."
                    value={koleksiyon.aciklama}
                    onChange={(e) => handleInputChange(index, e)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="input-group file-group">
                  <label className="input-label">Kapak Görseli</label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(index, e)}
                      className="file-input"
                      id={`file-${index}`}
                      required
                    />
                    <label htmlFor={`file-${index}`} className="file-label">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                      </svg>
                      <span>Görsel Seçin</span>
                    </label>
                    {koleksiyon.gorsel && (
                      <span className="file-name">{koleksiyon.gorsel.name}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="form-actions">
            <button type="button" className="add-btn" onClick={addRow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Yeni Koleksiyon Ekle
            </button>
            
            <button type="submit" className="submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
              Koleksiyonları Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KoleksiyonEkle;