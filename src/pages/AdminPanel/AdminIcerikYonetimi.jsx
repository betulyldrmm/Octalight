import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Save, X, Upload, Image, FileText, Eye } from 'lucide-react';

const AdminIcerikYonetimi = () => {
  const [koleksiyonlar, setKoleksiyonlar] = useState([]);
  const [seciliKoleksiyon, setSeciliKoleksiyon] = useState('');
  const [icerikler, setIcerikler] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    tip: 'image', // 'image' veya 'text'
    baslik: '',
    aciklama: '',
    yazi: '',
    gorsel: null
  });

  // Token'ı localStorage'dan al
  const getToken = () => localStorage.getItem('token');

  // Koleksiyonları yükle
  const loadKoleksiyonlar = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/koleksiyonlar');
      const data = await response.json();
      if (data.success) {
        setKoleksiyonlar(data.koleksiyonlar);
      }
    } catch (error) {
      console.error('Koleksiyonlar yüklenirken hata:', error);
    }
  };

  // Seçili koleksiyonun içeriklerini yükle
  const loadIcerikler = async (koleksiyonSlug) => {
    if (!koleksiyonSlug) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/koleksiyonlar/${koleksiyonSlug}/icerik`);
      const data = await response.json();
      if (data.success) {
        setIcerikler(data.icerik);
      }
    } catch (error) {
      console.error('İçerikler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // İçerik ekle
  const addIcerik = async () => {
    const token = getToken();
    if (!token) {
      alert('Lütfen giriş yapın');
      return;
    }

    if (!formData.baslik || !seciliKoleksiyon) {
      alert('Başlık ve koleksiyon seçimi zorunludur');
      return;
    }

    if (formData.tip === 'text' && !formData.yazi) {
      alert('Yazı tipi için içerik zorunludur');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('koleksiyon_slug', seciliKoleksiyon);
    formDataToSend.append('tip', formData.tip);
    formDataToSend.append('baslik', formData.baslik);
    formDataToSend.append('aciklama', formData.aciklama);
    
    if (formData.tip === 'text') {
      formDataToSend.append('yazi', formData.yazi);
    }
    
    if (formData.gorsel) {
      formDataToSend.append('gorsel', formData.gorsel);
    }

    try {
      const response = await fetch('http://localhost:3001/api/koleksiyonlar/icerik', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        alert('İçerik başarıyla eklendi! 🎉');
        loadIcerikler(seciliKoleksiyon);
        resetForm();
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      console.error('İçerik ekleme hatası:', error);
      alert('İçerik eklenirken hata oluştu');
    }
  };

  // İçerik güncelle
  const updateIcerik = async () => {
    const token = getToken();
    if (!token) {
      alert('Lütfen giriş yapın');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('tip', formData.tip);
    formDataToSend.append('baslik', formData.baslik);
    formDataToSend.append('aciklama', formData.aciklama);
    
    if (formData.tip === 'text') {
      formDataToSend.append('yazi', formData.yazi);
    }
    
    if (formData.gorsel) {
      formDataToSend.append('gorsel', formData.gorsel);
    }

    try {
      const response = await fetch(`http://localhost:3001/api/koleksiyonlar/icerik/${editingId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();
      
      if (data.success) {
        alert('İçerik başarıyla güncellendi! 🎉');
        loadIcerikler(seciliKoleksiyon);
        resetForm();
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      console.error('İçerik güncelleme hatası:', error);
      alert('İçerik güncellenirken hata oluştu');
    }
  };

  // İçerik sil
  const deleteIcerik = async (id) => {
    if (!confirm('Bu içeriği silmek istediğinizden emin misiniz?')) return;

    const token = getToken();
    if (!token) {
      alert('Lütfen giriş yapın');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/koleksiyonlar/icerik/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        alert('İçerik başarıyla silindi! 🗑️');
        loadIcerikler(seciliKoleksiyon);
      } else {
        alert('Hata: ' + data.error);
      }
    } catch (error) {
      console.error('İçerik silme hatası:', error);
      alert('İçerik silinirken hata oluştu');
    }
  };

  // Form sıfırla
  const resetForm = () => {
    setFormData({
      tip: 'image',
      baslik: '',
      aciklama: '',
      yazi: '',
      gorsel: null
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Düzenleme için formu doldur
  const startEdit = (icerik) => {
    setFormData({
      tip: icerik.tip,
      baslik: icerik.baslik,
      aciklama: icerik.aciklama || '',
      yazi: icerik.yazi_icerik || '',
      gorsel: null
    });
    setEditingId(icerik.id);
    setShowForm(true);
  };

  // Component yüklendiğinde koleksiyonları getir
  useEffect(() => {
    loadKoleksiyonlar();
  }, []);

  // Koleksiyon değiştiğinde içerikleri yükle
  useEffect(() => {
    if (seciliKoleksiyon) {
      loadIcerikler(seciliKoleksiyon);
    }
  }, [seciliKoleksiyon]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Koleksiyon İçerik Yönetimi
          </h1>
        </div>

        <div className="p-6">
          {/* Koleksiyon Seçici */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Koleksiyon Seçin
            </label>
            <select
              value={seciliKoleksiyon}
              onChange={(e) => setSeciliKoleksiyon(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Koleksiyon seçin...</option>
              {koleksiyonlar.map((koleksiyon) => (
                <option key={koleksiyon.id} value={koleksiyon.slug}>
                  {koleksiyon.isim}
                </option>
              ))}
            </select>
          </div>

          {/* İçerik Ekleme Butonu */}
          {seciliKoleksiyon && (
            <div className="mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Yeni İçerik Ekle
              </button>
            </div>
          )}

          {/* İçerik Ekleme/Düzenleme Formu */}
          {showForm && (
            <div className="bg-gray-50 p-6 rounded-lg mb-6 border-2 border-dashed border-gray-300">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? 'İçerik Düzenle' : 'Yeni İçerik Ekle'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* İçerik Tipi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İçerik Tipi *
                  </label>
                  <select
                    value={formData.tip}
                    onChange={(e) => setFormData({...formData, tip: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="image">Görsel</option>
                    <option value="text">Yazı</option>
                  </select>
                </div>

                {/* Başlık */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    value={formData.baslik}
                    onChange={(e) => setFormData({...formData, baslik: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="İçerik başlığı..."
                  />
                </div>

                {/* Açıklama */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={formData.aciklama}
                    onChange={(e) => setFormData({...formData, aciklama: e.target.value})}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="İçerik açıklaması..."
                  />
                </div>

                {/* Yazı İçeriği - Sadece yazı tipi seçiliyse göster */}
                {formData.tip === 'text' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yazı İçeriği *
                    </label>
                    <textarea
                      value={formData.yazi}
                      onChange={(e) => setFormData({...formData, yazi: e.target.value})}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      placeholder="Yazı içeriğinizi buraya yazın..."
                    />
                  </div>
                )}

                {/* Görsel Yükleme */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görsel {formData.tip === 'image' ? '*' : '(Opsiyonel)'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({...formData, gorsel: e.target.files[0]})}
                      className="w-full"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      JPG, PNG, GIF, WEBP, SVG dosyaları yükleyebilirsiniz (Max: 10MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Butonları */}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  İptal
                </button>
                <button
                  onClick={editingId ? updateIcerik : addIcerik}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </div>
          )}

          {/* İçerikler Listesi */}
          {seciliKoleksiyon && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                {koleksiyonlar.find(k => k.slug === seciliKoleksiyon)?.isim} - İçerikler
              </h3>

              {loading ? (
                <div className="text-center py-8">Yükleniyor...</div>
              ) : icerikler.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Bu koleksiyonda henüz içerik yok
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {icerikler.map((icerik) => (
                    <div key={icerik.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      {/* İçerik Önizlemesi */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {icerik.tip === 'image' ? (
                              <Image className="w-4 h-4 text-blue-500" />
                            ) : (
                              <FileText className="w-4 h-4 text-green-500" />
                            )}
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {icerik.tip === 'image' ? 'Görsel' : 'Yazı'}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEdit(icerik)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              title="Düzenle"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteIcerik(icerik.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-semibold text-gray-800 mb-2">{icerik.baslik}</h4>
                        
                        {icerik.aciklama && (
                          <p className="text-sm text-gray-600 mb-2">{icerik.aciklama}</p>
                        )}

                        {/* Görsel Önizlemesi */}
                        {icerik.gorsel_url && (
                          <div className="mb-2">
                            <img
                              src={`http://localhost:3001${icerik.gorsel_url}`}
                              alt={icerik.baslik}
                              className="w-full h-32 object-cover rounded"
                            />
                          </div>
                        )}

                        {/* Yazı İçeriği Önizlemesi */}
                        {icerik.tip === 'text' && icerik.yazi_icerik && (
                          <div className="bg-gray-50 p-2 rounded text-sm text-gray-700">
                            {icerik.yazi_icerik.length > 100 
                              ? icerik.yazi_icerik.substring(0, 100) + '...' 
                              : icerik.yazi_icerik}
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(icerik.created_at).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminIcerikYonetimi;