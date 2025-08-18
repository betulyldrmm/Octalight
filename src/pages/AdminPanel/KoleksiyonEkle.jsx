// src/pages/KoleksiyonEkle.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './KoleksiyonEkle.css';

const KoleksiyonEkle = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'manage', 'edit-collection', 'edit-content', 'add-content'
  
  // Koleksiyon oluşturma state'leri
  const [koleksiyonlar, setKoleksiyonlar] = useState([
    { isim: '', aciklama: '', slug: '', gorsel: null }
  ]);
  const [errors, setErrors] = useState({});

  // Koleksiyon yönetimi state'leri
  const [mevcutKoleksiyonlar, setMevcutKoleksiyonlar] = useState([]);
  const [loading, setLoading] = useState(false);

  // Koleksiyon düzenleme state'leri
  const [editingCollection, setEditingCollection] = useState(null);
  const [editCollectionData, setEditCollectionData] = useState({
    isim: '',
    aciklama: '',
    slug: '',
    gorsel: null
  });

  // İçerik yönetimi state'leri
  const [mevcutIcerikler, setMevcutIcerikler] = useState([]);
  const [selectedContentCollection, setSelectedContentCollection] = useState('');
  const [editingContent, setEditingContent] = useState(null);
  const [editContentData, setEditContentData] = useState({
    tip: '',
    baslik: '',
    aciklama: '',
    gorsel: null,
    yazi: ''
  });

  // Yeni içerik ekleme state'leri
  const [newContentData, setNewContentData] = useState({
    tip: 'text',
    baslik: '',
    aciklama: '',
    gorsel: null,
    yazi: ''
  });

  // Mevcut koleksiyonları yükle
  useEffect(() => {
    if (activeTab === 'manage' || activeTab === 'edit-collection' || activeTab === 'edit-content' || activeTab === 'add-content') {
      loadMevcutKoleksiyonlar();
    }
  }, [activeTab]);

  // Seçilen koleksiyonun içeriğini yükle
  useEffect(() => {
    if (selectedContentCollection && (activeTab === 'edit-content' || activeTab === 'add-content')) {
      loadKoleksiyonIcerik(selectedContentCollection);
    }
  }, [selectedContentCollection, activeTab]);

  const loadMevcutKoleksiyonlar = async () => {
    console.log('Koleksiyonlar yükleniyor...');
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const res = await fetch('http://localhost:3001/api/koleksiyonlar', {
        headers
      });
      
      const data = await res.json();
      
      if (data.success && data.koleksiyonlar) {
        setMevcutKoleksiyonlar(data.koleksiyonlar);
        console.log('Yüklenen koleksiyon sayısı:', data.koleksiyonlar.length);
      } else {
        console.error('Koleksiyonlar yüklenemedi:', data);
        setMevcutKoleksiyonlar([]);
      }
    } catch (err) {
      console.error('Koleksiyonlar yükleme hatası:', err);
      setMevcutKoleksiyonlar([]);
    } finally {
      setLoading(false);
    }
  };

  // Koleksiyon içeriğini yükle
  const loadKoleksiyonIcerik = async (slug) => {
    console.log('İçerik yükleniyor...', slug);
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const res = await fetch(`http://localhost:3001/api/koleksiyonlar/${slug}/icerik`, {
        headers
      });
      
      const data = await res.json();
      
      if (data.success && data.icerik) {
        setMevcutIcerikler(data.icerik);
        console.log('Yüklenen içerik sayısı:', data.icerik.length);
      } else {
        console.error('İçerik yüklenemedi:', data);
        setMevcutIcerikler([]);
      }
    } catch (err) {
      console.error('İçerik yükleme hatası:', err);
      setMevcutIcerikler([]);
    } finally {
      setLoading(false);
    }
  };

  // ========== YENİ İÇERİK EKLEME FONKSİYONLARI ==========

  // İçerik ekleme sayfasını başlat
  const startAddContent = () => {
    setActiveTab('add-content');
    setNewContentData({
      tip: 'text',
      baslik: '',
      aciklama: '',
      gorsel: null,
      yazi: ''
    });
  };

  // İçerik eklemeyi iptal et
  const cancelAddContent = () => {
    setNewContentData({
      tip: 'text',
      baslik: '',
      aciklama: '',
      gorsel: null,
      yazi: ''
    });
    // File input'u temizle
    const fileInput = document.querySelector('#new-content-file-input');
    if (fileInput) fileInput.value = '';
    setActiveTab('edit-content');
  };

  // Yeni içerik kaydetme
  const addNewContent = async (e) => {
    e.preventDefault();

    if (!selectedContentCollection) {
      alert('Önce bir koleksiyon seçin!');
      return;
    }

    // Validation
    if (!newContentData.baslik.trim()) {
      alert('Başlık gerekli!');
      return;
    }

    if (newContentData.tip === 'text' && !newContentData.yazi.trim()) {
      alert('Yazı içeriği gerekli!');
      return;
    }

    if (newContentData.tip === 'image' && !newContentData.gorsel) {
      alert('Resim içeriği için görsel gerekli!');
      return;
    }

    const formData = new FormData();
    
    // Zorunlu alanlar
    formData.append('tip', newContentData.tip);
    formData.append('baslik', newContentData.baslik.trim());
    formData.append('aciklama', newContentData.aciklama.trim());
    
    if (newContentData.tip === 'text') {
      formData.append('yazi', newContentData.yazi.trim());
    }
    
    if (newContentData.tip === 'image' && newContentData.gorsel) {
      formData.append('gorsel', newContentData.gorsel);
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Önce giriş yapmalısınız!');
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3001/api/koleksiyonlar/${selectedContentCollection}/icerik`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert('İçerik başarıyla eklendi! 🎉');
        cancelAddContent();
        // İçerik listesini yenile
        await loadKoleksiyonIcerik(selectedContentCollection);
      } else {
        alert(`Hata: ${data.error || 'İçerik ekleme başarısız'}`);
      }
    } catch (err) {
      console.error('İçerik ekleme hatası:', err);
      alert('Sunucu hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== KOLEKSİYON DÜZENLEME FONKSİYONLARI ==========

  // Koleksiyon düzenlemeye başla
  const startEditCollection = (collection) => {
    console.log('Koleksiyon düzenleme başlatıldı:', collection);
    setEditingCollection(collection);
    setEditCollectionData({
      isim: collection.isim,
      aciklama: collection.aciklama,
      slug: collection.slug,
      gorsel: null // Yeni dosya için
    });
    setActiveTab('edit-collection');
  };

  // Koleksiyon düzenlemeyi iptal et
  const cancelEditCollection = () => {
    setEditingCollection(null);
    setEditCollectionData({
      isim: '',
      aciklama: '',
      slug: '',
      gorsel: null
    });
    // File input'u temizle
    const fileInput = document.querySelector('#edit-collection-file-input');
    if (fileInput) fileInput.value = '';
    setActiveTab('manage');
  };

  // Koleksiyon güncellemesi
  const updateCollection = async (e) => {
    e.preventDefault();
    
    if (!editingCollection) {
      alert('Düzenlenecek koleksiyon bulunamadı!');
      return;
    }

    // Validation
    if (!editCollectionData.isim.trim()) {
      alert('Koleksiyon ismi gerekli!');
      return;
    }

    if (!editCollectionData.aciklama.trim()) {
      alert('Açıklama gerekli!');
      return;
    }

    if (!editCollectionData.slug.trim()) {
      alert('Slug gerekli!');
      return;
    }

    // Slug format kontrolü
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(editCollectionData.slug)) {
      alert('Slug sadece küçük harf, rakam ve tire içerebilir!');
      return;
    }

    const formData = new FormData();
    
    // Zorunlu alanlar
    formData.append('isim', editCollectionData.isim.trim());
    formData.append('aciklama', editCollectionData.aciklama.trim());
    formData.append('slug', editCollectionData.slug.trim());
    
    // Dosya varsa ekle
    if (editCollectionData.gorsel) {
      formData.append('gorsel', editCollectionData.gorsel);
      console.log('Yeni kapak görseli eklendi:', editCollectionData.gorsel.name);
    }

    console.log('Koleksiyon güncelleme FormData içeriği:');
    for (let [key, value] of formData.entries()) {
      console.log(key, typeof value === 'object' ? `File: ${value.name}` : value);
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Önce giriş yapmalısınız!');
        setLoading(false);
        return;
      }

      console.log(`Koleksiyon API güncelleme isteği gönderiliyor... Slug: ${editingCollection.slug}`);
      
      // Koleksiyon güncelleme URL'i
      const res = await fetch(`http://localhost:3001/api/koleksiyonlar/${editingCollection.slug}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type header'ı FormData için otomatik ayarlanır
        },
        body: formData
      });

      console.log('API yanıt durumu:', res.status);
      
      const data = await res.json();
      console.log('API yanıtı:', data);

      if (data.success) {
        alert('Koleksiyon başarıyla güncellendi! 🎉');
        cancelEditCollection();
        // Koleksiyon listesini yenile
        await loadMevcutKoleksiyonlar();
      } else {
        alert(`Hata: ${data.error || 'Koleksiyon güncelleme başarısız'}`);
      }
    } catch (err) {
      console.error('Koleksiyon güncelleme hatası:', err);
      alert('Sunucu hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ========== İÇERİK DÜZENLEME FONKSİYONLARI ==========

  // İçerik düzenlemeye başla
  const startEditContent = (content) => {
    console.log('İçerik düzenleme başlatıldı:', content);
    setEditingContent(content);
    setEditContentData({
      tip: content.tip,
      baslik: content.baslik,
      aciklama: content.aciklama || '',
      gorsel: null, // Yeni dosya için
      yazi: content.yazi_icerik || ''
    });
  };

  // İçerik düzenlemeyi iptal et
  const cancelEditContent = () => {
    setEditingContent(null);
    setEditContentData({
      tip: '',
      baslik: '',
      aciklama: '',
      gorsel: null,
      yazi: ''
    });
    // File input'u temizle
    const fileInput = document.querySelector('#edit-content-file-input');
    if (fileInput) fileInput.value = '';
  };

  // İçerik güncellemesi
  const updateContent = async (e) => {
    e.preventDefault();
    
    if (!editingContent) {
      alert('Düzenlenecek içerik bulunamadı!');
      return;
    }

    // Validation
    if (!editContentData.baslik.trim()) {
      alert('Başlık gerekli!');
      return;
    }

    if (editContentData.tip === 'text' && !editContentData.yazi.trim()) {
      alert('Yazı içeriği gerekli!');
      return;
    }

    const formData = new FormData();
    
    // Zorunlu alanlar
    formData.append('baslik', editContentData.baslik.trim());
    formData.append('aciklama', editContentData.aciklama.trim());
    
    if (editContentData.tip === 'text') {
      formData.append('yazi', editContentData.yazi.trim());
    }
    
    // Resim içeriği için dosya kontrolü
    if (editContentData.tip === 'image' && editContentData.gorsel) {
      formData.append('gorsel', editContentData.gorsel);
      console.log('Yeni görsel eklendi:', editContentData.gorsel.name);
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Önce giriş yapmalısınız!');
        setLoading(false);
        return;
      }

      const res = await fetch(`http://localhost:3001/api/koleksiyonlar/icerik/${editingContent.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        alert('İçerik başarıyla güncellendi! 🎉');
        cancelEditContent();
        // İçerik listesini yenile
        await loadKoleksiyonIcerik(selectedContentCollection);
      } else {
        alert(`Hata: ${data.error || 'İçerik güncelleme başarısız'}`);
      }
    } catch (err) {
      console.error('İçerik güncelleme hatası:', err);
      alert('Sunucu hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // İçerik silme
  const deleteContent = async (contentId, contentTitle) => {
    if (!confirm(`"${contentTitle}" içeriğini silmek istediğinizden emin misiniz?`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Önce giriş yapmalısınız!');
        return;
      }

      const res = await fetch(`http://localhost:3001/api/koleksiyonlar/icerik/${contentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        alert('İçerik başarıyla silindi! 🗑️');
        // Eğer silinen içerik düzenleniyorsa, düzenlemeyi iptal et
        if (editingContent && editingContent.id === contentId) {
          cancelEditContent();
        }
        await loadKoleksiyonIcerik(selectedContentCollection);
      } else {
        alert(data.error || 'Silme işlemi başarısız');
      }
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Sunucu hatası!');
    } finally {
      setLoading(false);
    }
  };

  // Koleksiyon silme
  const deleteCollection = async (slug, collectionName) => {
    if (!confirm(`"${collectionName}" koleksiyonunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!`)) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        alert('Önce giriş yapmalısınız!');
        return;
      }

      const res = await fetch(`http://localhost:3001/api/koleksiyonlar/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        alert('Koleksiyon başarıyla silindi! 🗑️');
        // Eğer silinen koleksiyon içerik yönetiminde seçiliyse, temizle
        if (selectedContentCollection === slug) {
          setSelectedContentCollection('');
          setMevcutIcerikler([]);
          cancelEditContent();
        }
        // Eğer silinen koleksiyon düzenleniyorsa, düzenlemeyi iptal et
        if (editingCollection && editingCollection.slug === slug) {
          cancelEditCollection();
        }
        await loadMevcutKoleksiyonlar();
      } else {
        alert(data.error || 'Silme işlemi başarısız');
      }
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Sunucu hatası!');
    } finally {
      setLoading(false);
    }
  };

  // ========== KOLEKSİYON OLUŞTURMA FONKSİYONLARI ==========

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...koleksiyonlar];
    updated[index][name] = value;
    setKoleksiyonlar(updated);
    
    const newErrors = { ...errors };
    delete newErrors[`${index}-${name}`];
    setErrors(newErrors);
  };

  const handleFileChange = (index, e) => {
    const updated = [...koleksiyonlar];
    updated[index].gorsel = e.target.files[0];
    setKoleksiyonlar(updated);
    
    const newErrors = { ...errors };
    delete newErrors[`${index}-gorsel`];
    setErrors(newErrors);
  };

  const addRow = () => {
    setKoleksiyonlar([...koleksiyonlar, { isim: '', aciklama: '', slug: '', gorsel: null }]);
  };

  const removeRow = (index) => {
    if (koleksiyonlar.length > 1) {
      const updated = koleksiyonlar.filter((_, i) => i !== index);
      setKoleksiyonlar(updated);
      
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${index}-`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let hasValidKoleksiyon = false;

    koleksiyonlar.forEach((koleksiyon, index) => {
      const hasAnyField = koleksiyon.isim.trim() || koleksiyon.aciklama.trim() || koleksiyon.slug.trim() || koleksiyon.gorsel;
      
      if (hasAnyField) {
        hasValidKoleksiyon = true;
        
        if (!koleksiyon.isim.trim()) {
          newErrors[`${index}-isim`] = 'Koleksiyon ismi gerekli';
        }
        if (!koleksiyon.aciklama.trim()) {
          newErrors[`${index}-aciklama`] = 'Açıklama gerekli';
        }
        if (!koleksiyon.slug.trim()) {
          newErrors[`${index}-slug`] = 'Slug gerekli';
        }
        if (!koleksiyon.gorsel) {
          newErrors[`${index}-gorsel`] = 'Görsel gerekli';
        }

        if (koleksiyon.slug.trim()) {
          const slugRegex = /^[a-z0-9-]+$/;
          if (!slugRegex.test(koleksiyon.slug)) {
            newErrors[`${index}-slug`] = 'Slug sadece küçük harf, rakam ve tire içerebilir';
          }
        }
      }
    });

    if (!hasValidKoleksiyon) {
      newErrors.general = 'En az bir koleksiyon için bilgi girmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Lütfen hataları düzeltip tekrar deneyin.');
      return;
    }

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      alert('Önce giriş yapmalısınız!');
      return;
    }

    const validKoleksiyonlar = koleksiyonlar.filter(k => 
      k.isim.trim() !== '' && 
      k.aciklama.trim() !== '' && 
      k.slug.trim() !== '' && 
      k.gorsel
    );

    if (validKoleksiyonlar.length === 0) {
      alert('En az bir koleksiyon için tüm alanları doldurun!');
      return;
    }

    const formData = new FormData();
    
    validKoleksiyonlar.forEach((k, i) => {
      formData.append(`isim_${i}`, k.isim.trim());
      formData.append(`aciklama_${i}`, k.aciklama.trim());
      formData.append(`slug_${i}`, k.slug.trim());
      formData.append(`gorsel_${i}`, k.gorsel);
    });

    formData.append('koleksiyonSayisi', validKoleksiyonlar.length.toString());

    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/koleksiyonlar/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      
      if (res.ok) {
        alert(`${validKoleksiyonlar.length} koleksiyon başarıyla eklendi! 🎉`);
        setKoleksiyonlar([{ isim: '', aciklama: '', slug: '', gorsel: null }]);
        setErrors({});
        navigate('/koleksiyon');
      } else {
        alert(data.error || data.message || 'Bir hata oluştu.');
      }
    } catch (err) {
      console.error('API Hatası:', err);
      alert('Sunucu hatası: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleIsimChange = (index, e) => {
    const { value } = e.target;
    const updated = [...koleksiyonlar];
    updated[index].isim = value;
    
    if (!updated[index].slug.trim()) {
      updated[index].slug = generateSlug(value);
    }
    
    setKoleksiyonlar(updated);
    
    const newErrors = { ...errors };
    delete newErrors[`${index}-isim`];
    if (!updated[index].slug.trim()) {
      delete newErrors[`${index}-slug`];
    }
    setErrors(newErrors);
  };

  return (
    <div className="page-contain">
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
          <h1 className="page-title">Koleksiyon Yönetimi</h1>
          <p className="page-subtitle">Koleksiyonlarınızı oluşturun, yönetin ve içerikleri düzenleyin</p>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigationn">
          <button 
            className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ➕ Yeni Koleksiyon
          </button>
          <button 
            className={`tab-btnn ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            🗂️ Koleksiyonları Yönet
          </button>
          <button 
            className={`tab-btnn ${activeTab === 'edit-content' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit-content')}
          >
            📝 İçerik Yönetimi
          </button>
        </div>

        {/* Koleksiyon Oluşturma */}
        {activeTab === 'create' && (
          <div className="tab-content">
            {errors.general && (
              <div className="error-message general-error">
                <span className="error-icon">⚠️</span>
                {errors.general}
              </div>
            )}

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
                        ❌
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
                        onChange={(e) => handleIsimChange(index, e)}
                        className={`form-input ${errors[`${index}-isim`] ? 'error' : ''}`}
                      />
                      {errors[`${index}-isim`] && (
                        <span className="error-text">{errors[`${index}-isim`]}</span>
                      )}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Slug (URL)</label>
                      <input
                        type="text"
                        name="slug"
                        placeholder="örn: yaz-koleksiyonu"
                        value={koleksiyon.slug}
                        onChange={(e) => handleInputChange(index, e)}
                        className={`form-input ${errors[`${index}-slug`] ? 'error' : ''}`}
                      />
                      {errors[`${index}-slug`] && (
                        <span className="error-text">{errors[`${index}-slug`]}</span>
                      )}
                    </div>

                    <div className="input-group full-width">
                      <label className="input-label">Açıklama</label>
                      <input
                        type="text"
                        name="aciklama"
                        placeholder="Koleksiyon hakkında kısa bir açıklama yazın..."
                        value={koleksiyon.aciklama}
                        onChange={(e) => handleInputChange(index, e)}
                        className={`form-input ${errors[`${index}-aciklama`] ? 'error' : ''}`}
                      />
                      {errors[`${index}-aciklama`] && (
                        <span className="error-text">{errors[`${index}-aciklama`]}</span>
                      )}
                    </div>

                    <div className="input-group file-group">
                      <label className="input-label">Kapak Görseli</label>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index, e)}
                          className={`file-input ${errors[`${index}-gorsel`] ? 'error' : ''}`}
                          id={`file-${index}`}
                        />
                        <label htmlFor={`file-${index}`} className="file-label">
                          📂 Görsel Seçin
                        </label>
                        {koleksiyon.gorsel && (
                          <span className="file-name">{koleksiyon.gorsel.name}</span>
                        )}
                      </div>
                      {errors[`${index}-gorsel`] && (
                        <span className="error-text">{errors[`${index}-gorsel`]}</span>
                      )}
                    </div>
                  </div>

                  <div className="collection-status">
                    {koleksiyon.isim.trim() && koleksiyon.aciklama.trim() && koleksiyon.slug.trim() && koleksiyon.gorsel ? (
                      <span className="status-complete">✅ Tam dolduruldu</span>
                    ) : koleksiyon.isim.trim() || koleksiyon.aciklama.trim() || koleksiyon.slug.trim() || koleksiyon.gorsel ? (
                      <span className="status-partial">📝 Kısmi dolduruldu</span>
                    ) : (
                      <span className="status-empty">⭕ Boş koleksiyon</span>
                    )}
                  </div>
                </div>
              ))}

              <div className="form-actions">
                <button type="button" className="add-btn" onClick={addRow}>+ Yeni Koleksiyon Ekle</button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? '⏳ Kaydediliyor...' : '✔ Koleksiyonları Kaydet'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Koleksiyon Yönetimi */}
        {activeTab === 'manage' && (
          <div className="tab-content">
            <div className="management-header">
              <h2>Mevcut Koleksiyonlar</h2>
              <button 
                onClick={loadMevcutKoleksiyonlar} 
                className="refresh-btn"
                disabled={loading}
              >
                {loading ? '⏳' : '🔄'} Yenile
              </button>
            </div>

            {loading ? (
              <div className="loading">Yükleniyor...</div>
            ) : (
              <div className="collections-list">
                {mevcutKoleksiyonlar.length === 0 ? (
                  <div className="empty-state">
                    <p>Henüz koleksiyon bulunmuyor.</p>
                  </div>
                ) : (
                  mevcutKoleksiyonlar.map((koleksiyon) => (
                    <div key={koleksiyon.slug} className="collection-item">
                      <div className="collection-info">
                        <img 
                          src={`http://localhost:3001${koleksiyon.gorselUrl || koleksiyon.gorsel_url}`} 
                          alt={koleksiyon.isim}
                          className="collection-thumbnail"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zNS41IDUwSDY0LjVNNTAgMzUuNVY2NC41IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="collection-details">
                          <h3>{koleksiyon.isim}</h3>
                          <p>{koleksiyon.aciklama}</p>
                          <span className="collection-slug">/{koleksiyon.slug}</span>
                          <div className="collection-meta">
                            <small>
                              Oluşturulma: {new Date(koleksiyon.created_at).toLocaleDateString('tr-TR')}
                              {koleksiyon.created_by_username && ` • ${koleksiyon.created_by_username}`}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="collection-actions">
                        <button 
                          onClick={() => startEditCollection(koleksiyon)}
                          className="edit-btn"
                          title="Koleksiyonu düzenle"
                          disabled={loading}
                        >
                          ✏️ Düzenle
                        </button>
                        <button 
                          onClick={() => deleteCollection(koleksiyon.slug, koleksiyon.isim)}
                          className="delete-btn"
                          title="Koleksiyonu sil"
                          disabled={loading}
                        >
                          🗑️ Sil
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Koleksiyon Düzenleme */}
        {activeTab === 'edit-collection' && editingCollection && (
          <div className="tab-content">
            <div className="edit-form-container" style={{
              background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '25px',
              border: '2px solid #ff9800',
              boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#ff9800',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  🗂️
                </div>
                <div>
                  <h3 style={{margin: '0', color: '#e65100'}}>Koleksiyon Düzenleniyor</h3>
                  <p style={{margin: '5px 0 0 0', color: '#666', fontSize: '14px'}}>
                    "{editingCollection.isim}" koleksiyonunu düzenliyorsunuz
                  </p>
                </div>
              </div>

              <form onSubmit={updateCollection}>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">Koleksiyon İsmi *</label>
                    <input
                      type="text"
                      value={editCollectionData.isim}
                      onChange={(e) => setEditCollectionData({...editCollectionData, isim: e.target.value})}
                      className="form-input"
                      placeholder="Koleksiyon ismini girin..."
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Slug (URL) *</label>
                    <input
                      type="text"
                      value={editCollectionData.slug}
                      onChange={(e) => setEditCollectionData({...editCollectionData, slug: e.target.value})}
                      className="form-input"
                      placeholder="örn: yaz-koleksiyonu"
                      required
                      disabled={loading}
                    />
                    <small style={{color: '#666', fontSize: '12px'}}>
                      Sadece küçük harf, rakam ve tire kullanabilirsiniz
                    </small>
                  </div>

                  <div className="input-group full-width">
                    <label className="input-label">Açıklama *</label>
                    <textarea
                      value={editCollectionData.aciklama}
                      onChange={(e) => setEditCollectionData({...editCollectionData, aciklama: e.target.value})}
                      className="form-input"
                      rows="3"
                      placeholder="Koleksiyon hakkında açıklama yazın..."
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="input-group file-group full-width">
                    <label className="input-label">
                      Kapak Görseli {editingCollection.gorsel_url ? '(Yeni görsel yüklemezseniz mevcut görsel korunur)' : '*'}
                    </label>
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditCollectionData({...editCollectionData, gorsel: e.target.files[0]})}
                        className="file-input"
                        id="edit-collection-file-input"
                        disabled={loading}
                      />
                      <label htmlFor="edit-collection-file-input" className="file-label">
                        📂 {editCollectionData.gorsel ? 'Görsel Değiştirildi' : 'Yeni Görsel Seç'}
                      </label>
                      {editCollectionData.gorsel && (
                        <span className="file-name" style={{color: '#ff9800', fontWeight: 'bold'}}>
                          ✓ {editCollectionData.gorsel.name}
                        </span>
                      )}
                    </div>
                    
                    {editingCollection.gorsel_url && !editCollectionData.gorsel && (
                      <div style={{marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                        <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>
                          📷 Mevcut Kapak Görseli:
                        </p>
                        <img 
                          src={`http://localhost:3001${editingCollection.gorsel_url}`}
                          alt="Mevcut kapak görseli"
                          style={{
                            width: '200px', 
                            height: '200px', 
                            objectFit: 'cover', 
                            borderRadius: '8px',
                            border: '2px solid #e0e0e0'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{display: 'none', padding: '20px', textAlign: 'center', color: '#999'}}>
                          Görsel yüklenemedi
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-actions" style={{marginTop: '25px', gap: '15px'}}>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                    style={{minWidth: '140px', backgroundColor: '#ff9800'}}
                  >
                    {loading ? '⏳ Güncelleniyor...' : '✔️ Koleksiyonu Güncelle'}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelEditCollection}
                    className="add-btn"
                    disabled={loading}
                    style={{
                      backgroundColor: '#6c757d', 
                      minWidth: '100px'
                    }}
                  >
                    ❌ İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* İçerik Yönetimi */}
        {activeTab === 'edit-content' && (
          <div className="tab-content">
            <div className="content-management-header">
              <h2>İçerik Yönetimi</h2>
              <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
                <select 
                  value={selectedContentCollection}
                  onChange={(e) => setSelectedContentCollection(e.target.value)}
                  className="form-input"
                  style={{minWidth: '250px'}}
                  disabled={loading}
                >
                  <option value="">Koleksiyon Seçin...</option>
                  {mevcutKoleksiyonlar.map((koleksiyon) => (
                    <option key={koleksiyon.slug} value={koleksiyon.slug}>
                      {koleksiyon.isim} ({koleksiyon.slug})
                    </option>
                  ))}
                </select>
                
                {selectedContentCollection && (
                  <button 
                    onClick={startAddContent}
                    className="submit-btn"
                    style={{
                      backgroundColor: '#28a745',
                      padding: '12px 24px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      minWidth: '160px'
                    }}
                    disabled={loading}
                  >
                    ➕ İçerik Ekle
                  </button>
                )}
              </div>
            </div>

            {selectedContentCollection && !loading && (
              <div className="content-list">
                <div style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  padding: '15px',
                  background: '#f8f9fa',
                  borderRadius: '8px'
                }}>
                  <h3 style={{margin: '0'}}>
                    📋 İçerikler ({mevcutIcerikler.length} adet)
                    {mevcutKoleksiyonlar.find(k => k.slug === selectedContentCollection)?.isim && 
                      ` - ${mevcutKoleksiyonlar.find(k => k.slug === selectedContentCollection).isim}`
                    }
                  </h3>
                  <button 
                    onClick={() => loadKoleksiyonIcerik(selectedContentCollection)}
                    className="refresh-btn"
                    disabled={loading}
                    style={{fontSize: '14px'}}
                  >
                    {loading ? '⏳' : '🔄'} Yenile
                  </button>
                </div>
                
                {mevcutIcerikler.length === 0 ? (
                  <div className="empty-state" style={{
                    textAlign: 'center',
                    padding: '40px',
                    background: '#f8f9fa',
                    borderRadius: '8px'
                  }}>
                    <div style={{fontSize: '48px', marginBottom: '15px'}}>📝</div>
                    <p style={{margin: '0 0 20px 0', color: '#666'}}>Bu koleksiyonda henüz içerik bulunmuyor.</p>
                    <button 
                      onClick={startAddContent}
                      className="submit-btn"
                      style={{
                        backgroundColor: '#28a745',
                        padding: '12px 24px',
                        fontSize: '16px'
                      }}
                    >
                      ➕ İlk İçeriği Ekle
                    </button>
                  </div>
                ) : (
                  <div className="content-items">
                    {mevcutIcerikler.map((icerik) => (
                      <div 
                        key={icerik.id} 
                        className="content-item" 
                        style={{
                          border: editingContent?.id === icerik.id ? '2px solid #2196f3' : '1px solid #e0e0e0',
                          borderRadius: '12px',
                          padding: '20px',
                          marginBottom: '15px',
                          backgroundColor: editingContent?.id === icerik.id ? '#e3f2fd' : '#fff',
                          boxShadow: editingContent?.id === icerik.id ? '0 4px 12px rgba(33, 150, 243, 0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <div className="content-info">
                          <div className="content-header" style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: '12px'
                          }}>
                            <h4 style={{margin: '0', color: '#333'}}>{icerik.baslik}</h4>
                            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                              <span className="content-type-badge" style={{
                                background: icerik.tip === 'image' ? '#28a745' : '#17a2b8',
                                color: 'white',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                {icerik.tip === 'image' ? '🖼️ Resim' : '📝 Yazı'}
                              </span>
                              {editingContent?.id === icerik.id && (
                                <span style={{
                                  background: '#2196f3',
                                  color: 'white',
                                  padding: '4px 12px',
                                  borderRadius: '20px',
                                  fontSize: '12px',
                                  fontWeight: 'bold'
                                }}>
                                  ✏️ Düzenleniyor
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {icerik.aciklama && (
                            <p style={{
                              color: '#666', 
                              margin: '8px 0',
                              fontSize: '14px',
                              lineHeight: '1.5'
                            }}>
                              {icerik.aciklama}
                            </p>
                          )}
                          
                          {icerik.tip === 'image' && icerik.gorsel_url && (
                            <div style={{margin: '15px 0'}}>
                              <img 
                                src={`http://localhost:3001${icerik.gorsel_url}`}
                                alt={icerik.baslik}
                                style={{
                                  width: '150px',
                                  height: '150px',
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #e0e0e0'
                                }}
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div style={{
                                display: 'none',
                                width: '150px',
                                height: '150px',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '8px',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#999',
                                fontSize: '12px'
                              }}>
                                Görsel yüklenemedi
                              </div>
                            </div>
                          )}
                          
                          {icerik.tip === 'text' && icerik.yazi_icerik && (
                            <div style={{
                              background: '#f8f9fa',
                              padding: '15px',
                              borderRadius: '8px',
                              margin: '15px 0',
                              maxHeight: '120px',
                              overflow: 'auto',
                              fontSize: '14px',
                              lineHeight: '1.6',
                              border: '1px solid #e9ecef'
                            }}>
                              {icerik.yazi_icerik.substring(0, 200)}
                              {icerik.yazi_icerik.length > 200 && '...'}
                            </div>
                          )}
                          
                          <div style={{
                            fontSize: '12px', 
                            color: '#888', 
                            marginTop: '15px',
                            padding: '10px',
                            background: '#f8f9fa',
                            borderRadius: '6px'
                          }}>
                            📅 Oluşturulma: {new Date(icerik.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            {icerik.updated_at !== icerik.created_at && (
                              <span style={{display: 'block', marginTop: '5px'}}>
                                🔄 Güncelleme: {new Date(icerik.updated_at).toLocaleDateString('tr-TR', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            )}
                            {icerik.created_by_username && (
                              <span style={{display: 'block', marginTop: '5px'}}>
                                👤 Oluşturan: {icerik.created_by_username}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="content-actions" style={{
                          marginTop: '20px',
                          display: 'flex',
                          gap: '10px'
                        }}>
                          <button 
                            onClick={() => startEditContent(icerik)}
                            className="edit-btn"
                            style={{
                              background: editingContent?.id === icerik.id ? '#6c757d' : '#007bff',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              cursor: editingContent?.id === icerik.id ? 'not-allowed' : 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              transition: 'all 0.3s ease'
                            }}
                            disabled={editingContent?.id === icerik.id || loading}
                          >
                            {editingContent?.id === icerik.id ? '✏️ Düzenleniyor...' : '✏️ Düzenle'}
                          </button>
                          <button 
                            onClick={() => deleteContent(icerik.id, icerik.baslik)}
                            className="delete-btn"
                            style={{
                              background: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '10px 20px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              transition: 'all 0.3s ease'
                            }}
                            disabled={loading}
                          >
                            🗑️ Sil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* İçerik Düzenleme Formu */}
                {editingContent && (
                  <div style={{
                    position: 'fixed',
                    top: '0',
                    left: '0',
                    right: '0',
                    bottom: '0',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                  }}>
                    <div style={{
                      backgroundColor: 'white',
                      padding: '30px',
                      borderRadius: '12px',
                      maxWidth: '600px',
                      width: '100%',
                      maxHeight: '80vh',
                      overflowY: 'auto',
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                    }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '25px',
                        gap: '15px'
                      }}>
                        <div style={{
                          width: '50px',
                          height: '50px',
                          background: '#2196f3',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '20px'
                        }}>
                          ✏️
                        </div>
                        <div>
                          <h3 style={{margin: '0', color: '#1976d2', fontSize: '22px'}}>
                            İçerik Düzenleme
                          </h3>
                          <p style={{margin: '5px 0 0 0', color: '#666', fontSize: '14px'}}>
                            "{editingContent.baslik}" içeriğini düzenliyorsunuz
                          </p>
                        </div>
                      </div>

                      <form onSubmit={updateContent}>
                        <div style={{marginBottom: '20px'}}>
                          <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>
                            Başlık *
                          </label>
                          <input
                            type="text"
                            value={editContentData.baslik}
                            onChange={(e) => setEditContentData({...editContentData, baslik: e.target.value})}
                            className="form-input"
                            placeholder="İçerik başlığını girin..."
                            required
                            disabled={loading}
                            style={{width: '100%'}}
                          />
                        </div>

                        <div style={{marginBottom: '20px'}}>
                          <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontWeight: 'bold',
                            color: '#333'
                          }}>
                            Açıklama
                          </label>
                          <textarea
                            value={editContentData.aciklama}
                            onChange={(e) => setEditContentData({...editContentData, aciklama: e.target.value})}
                            className="form-input"
                            rows="3"
                            placeholder="İçerik hakkında açıklama yazın..."
                            disabled={loading}
                            style={{width: '100%', resize: 'vertical'}}
                          />
                        </div>

                       

                        {editContentData.tip === 'image' && (
                          <div style={{marginBottom: '20px'}}>
                          
                            <div className="file-input-wrapper">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setEditContentData({...editContentData, gorsel: e.target.files[0]})}
                                className="file-input"
                                id="edit-content-file-input"
                                disabled={loading}
                              />
                              <label htmlFor="edit-content-file-input" className="file-label">
                                📂 {editContentData.gorsel ? 'Görsel Değiştirildi' : 'Yeni Görsel Seç'}
                              </label>
                              {editContentData.gorsel && (
                                <span className="file-name" style={{color: '#2196f3', fontWeight: 'bold'}}>
                                  ✓ {editContentData.gorsel.name}
                                </span>
                              )}
                            </div>
                            
                            {editingContent.gorsel_url && !editContentData.gorsel && (
                              <div style={{marginTop: '15px', padding: '15px', background: '#f8f9fa', borderRadius: '8px'}}>
                                <p style={{margin: '0 0 10px 0', fontSize: '14px', color: '#666'}}>
                                  📷 Mevcut Görsel:
                                </p>
                                <img 
                                  src={`http://localhost:3001${editingContent.gorsel_url}`}
                                  alt="Mevcut görsel"
                                  style={{
                                    width: '200px', 
                                    height: '200px', 
                                    objectFit: 'cover', 
                                    borderRadius: '8px',
                                    border: '2px solid #e0e0e0'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                  }}
                                />
                                <div style={{display: 'none', padding: '20px', textAlign: 'center', color: '#999'}}>
                                  Görsel yüklenemedi
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div style={{
                          display: 'flex', 
                          gap: '15px', 
                          justifyContent: 'flex-end',
                          marginTop: '30px'
                        }}>
                          <button 
                            type="button" 
                            onClick={cancelEditContent}
                            style={{
                              backgroundColor: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}
                            disabled={loading}
                          >
                            ❌ İptal
                          </button>
                          <button 
                            type="submit" 
                            style={{
                              backgroundColor: '#2196f3',
                              color: 'white',
                              border: 'none',
                              padding: '12px 24px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold',
                              minWidth: '140px'
                            }}
                            disabled={loading}
                          >
                            {loading ? '⏳ Güncelleniyor...' : '✔️ İçeriği Güncelle'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Yeni İçerik Ekleme */}
        {activeTab === 'add-content' && (
          <div className="tab-content">
            <div className="edit-form-container" style={{
              background: 'linear-gradient(135deg, #e8f5e8 0%, #f0fff0 100%)',
              padding: '25px',
              borderRadius: '12px',
              marginBottom: '25px',
              border: '2px solid #28a745',
              boxShadow: '0 4px 12px rgba(40, 167, 69, 0.15)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                gap: '10px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#28a745',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  ➕
                </div>
                <div>
                  <h3 style={{margin: '0', color: '#155724'}}>Yeni İçerik Ekleme</h3>
                  <p style={{margin: '5px 0 0 0', color: '#666', fontSize: '14px'}}>
                    "{mevcutKoleksiyonlar.find(k => k.slug === selectedContentCollection)?.isim}" koleksiyonuna yeni içerik ekliyorsunuz
                  </p>
                </div>
              </div>

              <form onSubmit={addNewContent}>
                <div className="form-grid">
                  <div className="input-group">
                    <label className="input-label">İçerik Türü *</label>
                    <select
                      value={newContentData.tip}
                      onChange={(e) => setNewContentData({...newContentData, tip: e.target.value})}
                      className="form-input"
                      required
                      disabled={loading}
                    >
                      <option value="text">📝 Yazı İçeriği</option>
                      <option value="image">🖼️ Görsel İçeriği</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label className="input-label">Başlık *</label>
                    <input
                      type="text"
                      value={newContentData.baslik}
                      onChange={(e) => setNewContentData({...newContentData, baslik: e.target.value})}
                      className="form-input"
                      placeholder="İçerik başlığını girin..."
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="input-group full-width">
                    <label className="input-label">Açıklama</label>
                    <textarea
                      value={newContentData.aciklama}
                      onChange={(e) => setNewContentData({...newContentData, aciklama: e.target.value})}
                      className="form-input"
                      rows="3"
                      placeholder="İçerik hakkında açıklama yazın..."
                      disabled={loading}
                    />
                  </div>

                  {newContentData.tip === 'text' && (
                    <div className="input-group full-width">
                      <label className="input-label">Yazı İçeriği *</label>
                      <textarea
                        value={newContentData.yazi}
                        onChange={(e) => setNewContentData({...newContentData, yazi: e.target.value})}
                        className="form-input"
                        rows="8"
                        placeholder="Yazı içeriğini buraya yazın..."
                        required
                        disabled={loading}
                        style={{resize: 'vertical'}}
                      />
                    </div>
                  )}

                  {newContentData.tip === 'image' && (
                    <div className="input-group file-group full-width">
                      <label className="input-label">Görsel *</label>
                      <div className="file-input-wrapper">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setNewContentData({...newContentData, gorsel: e.target.files[0]})}
                          className="file-input"
                          id="new-content-file-input"
                          required
                          disabled={loading}
                        />
                        <label htmlFor="new-content-file-input" className="file-label">
                          📂 Görsel Seçin
                        </label>
                        {newContentData.gorsel && (
                          <span className="file-name" style={{color: '#28a745', fontWeight: 'bold'}}>
                            ✓ {newContentData.gorsel.name}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions" style={{marginTop: '25px', gap: '15px'}}>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                    style={{minWidth: '140px', backgroundColor: '#28a745'}}
                  >
                    {loading ? '⏳ Ekleniyor...' : '✔️ İçeriği Ekle'}
                  </button>
                  <button 
                    type="button" 
                    onClick={cancelAddContent}
                    className="add-btn"
                    disabled={loading}
                    style={{
                      backgroundColor: '#6c757d', 
                      minWidth: '100px'
                    }}
                  >
                    ❌ İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KoleksiyonEkle;