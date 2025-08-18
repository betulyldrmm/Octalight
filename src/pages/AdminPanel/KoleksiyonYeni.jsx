import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const KoleksiyonYeni = () => {
  const { slug } = useParams();
  const [koleksiyon, setKoleksiyon] = useState(null);
  const [icerikler, setIcerikler] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIcerik, setSelectedIcerik] = useState(null);

  useEffect(() => {
    fetchKoleksiyonData();
    fetchIcerikler();
    
    // Admin panelinden içerik güncellendiğinde otomatik yenile
    const handleContentUpdate = (event) => {
      if (event.detail?.koleksiyonSlug === slug) {
        console.log('İçerik güncellendi, sayfa yenileniyor...');
        fetchIcerikler();
      }
    };

    window.addEventListener('contentUpdated', handleContentUpdate);
    
    // Component unmount olduğunda event listener'ı temizle
    return () => {
      window.removeEventListener('contentUpdated', handleContentUpdate);
    };
  }, [slug]);

  const fetchKoleksiyonData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      console.log(`🔍 Koleksiyon verisi getiriliyor: GET /api/koleksiyonlar/${slug}`);
      console.log('🔑 Token var mı:', !!token);
      
      const response = await fetch(`http://localhost:3001/api/koleksiyonlar/${slug}`, {
        headers
      });
      
      console.log('📡 Koleksiyon API yanıt durumu:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Koleksiyon verisi:', data);
        setKoleksiyon(data.koleksiyon);
      } else {
        console.error('❌ Koleksiyon yüklenemedi:', response.status);
      }
    } catch (error) {
      console.error('💥 Koleksiyon yüklenirken hata:', error);
    }
  };

  const fetchIcerikler = async () => {
    try {
      console.log(`🔍 İçerikler getiriliyor: GET /api/koleksiyonlar/${slug}/icerik`);
      
      // ⚠️ HATA DÜZELTİLDİ: Token eklendi
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      console.log('🔑 İçerik API için token var mı:', !!token);
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };
      
      const response = await fetch(`http://localhost:3001/api/koleksiyonlar/${slug}/icerik`, {
        headers // ✅ Headers eklendi
      });
      
      console.log('📡 İçerik API yanıt durumu:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 İçerik API yanıtı:', data);
        console.log('📄 Gelen içerik array:', data.icerik);
        
        setIcerikler(data.icerik || []);
        console.log(`✅ ${data.icerik?.length || 0} içerik yüklendi`);
      } else {
        console.error('❌ İçerikler yüklenemedi:', response.status);
        const errorText = await response.text();
        console.error('❌ Hata detayı:', errorText);
        toast.error('İçerikler yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('💥 İçerikler yüklenirken hata:', error);
      toast.error('İçerikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Manuel yenileme fonksiyonu
  const handleRefresh = () => {
    setLoading(true);
    fetchIcerikler();
  };

  const handleIcerikClick = (icerik) => {
    setSelectedIcerik(icerik);
  };

  const closeModal = () => {
    setSelectedIcerik(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/koleksiyonlar" 
            className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Koleksiyonlara Dön
          </Link>
          
          {koleksiyon && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{koleksiyon.baslik}</h1>
              <p className="text-gray-600 mb-4">{koleksiyon.aciklama}</p>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <span>📅 {new Date(koleksiyon.created_at).toLocaleDateString('tr-TR')}</span>
                <span>👤 {koleksiyon.created_by_username}</span>
                <span>📊 {icerikler.length} İçerik</span>
              </div>
            </div>
          )}
        </div>

        {/* İçerik Ekle Butonu ve Yenile Butonu */}
        <div className="mb-6 flex gap-4">
          <Link
            to={`/koleksiyonlar/${slug}/icerik-ekle`}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 inline-flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            İçerik Ekle
          </Link>
          
          <button
            onClick={handleRefresh}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 inline-flex items-center"
            disabled={loading}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'Yenileniyor...' : 'Yenile'}
          </button>
        </div>

        {/* Debug Bilgisi - Geliştirme sırasında kullanın */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">Debug Bilgisi:</h4>
          <p className="text-blue-700 text-sm">
            Koleksiyon Slug: <code>{slug}</code> | 
            İçerik Sayısı: <strong>{icerikler.length}</strong> | 
            Token Var: <strong>{!!(localStorage.getItem('token') || sessionStorage.getItem('token')) ? 'Evet' : 'Hayır'}</strong> |
            Son Güncelleme: {new Date().toLocaleTimeString()}
          </p>
          {icerikler.length > 0 && (
            <details className="mt-2">
              <summary className="text-blue-700 cursor-pointer">İçerik Detayları</summary>
              <pre className="text-xs bg-white p-2 mt-1 rounded overflow-auto max-h-32">
                {JSON.stringify(icerikler, null, 2)}
              </pre>
            </details>
          )}
        </div>

        {/* İçerikler */}
        {icerikler.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Henüz İçerik Yok</h3>
            <p className="text-gray-600 mb-6">Bu koleksiyonda henüz hiç içerik bulunmuyor.</p>
            <Link
              to={`/koleksiyonlar/${slug}/icerik-ekle`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              İlk İçeriği Ekle
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {icerikler.map((icerik) => (
              <div
                key={icerik.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                onClick={() => handleIcerikClick(icerik)}
              >
                {/* İçerik Görseli/Önizlemesi */}
                <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  {icerik.tip === 'image' && icerik.gorsel_url ? (
                    <img
                      src={`http://localhost:3001${icerik.gorsel_url}`}
                      alt={icerik.baslik}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('❌ Görsel yüklenemedi:', icerik.gorsel_url);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : icerik.tip === 'text' ? (
                    <div className="text-center p-4">
                      <div className="text-4xl mb-2">📝</div>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {icerik.yazi_icerik ? icerik.yazi_icerik.substring(0, 100) + '...' : 'Yazı içeriği'}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-gray-500">İçerik</p>
                    </div>
                  )}
                  
                  {/* Hata durumunda gösterilecek fallback */}
                  <div className="hidden text-center">
                    <div className="text-4xl mb-2">❌</div>
                    <p className="text-gray-500 text-sm">Görsel yüklenemedi</p>
                  </div>
                </div>

                {/* İçerik Bilgileri */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{icerik.baslik}</h3>
                  {icerik.aciklama && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{icerik.aciklama}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      icerik.tip === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {icerik.tip === 'image' ? '🖼️ Görsel' : '📝 Yazı'}
                    </span>
                    <span>{new Date(icerik.created_at).toLocaleDateString('tr-TR')}</span>
                  </div>
                  
                  {/* Debug bilgisi - geliştirme için */}
                  <div className="mt-2 text-xs text-gray-400">
                    ID: {icerik.id} | Tip: {icerik.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* İçerik Detay Modal */}
        {selectedIcerik && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedIcerik.baslik}</h2>
                    {selectedIcerik.aciklama && (
                      <p className="text-gray-600">{selectedIcerik.aciklama}</p>
                    )}
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* İçerik */}
                <div className="mb-6">
                  {selectedIcerik.tip === 'image' && selectedIcerik.gorsel_url ? (
                    <img
                      src={`http://localhost:3001${selectedIcerik.gorsel_url}`}
                      alt={selectedIcerik.baslik}
                      className="w-full h-auto rounded-lg"
                      onError={(e) => {
                        console.error('❌ Modal görsel yüklenemedi:', selectedIcerik.gorsel_url);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                  ) : selectedIcerik.tip === 'text' && selectedIcerik.yazi_icerik ? (
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                        {selectedIcerik.yazi_icerik}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                      İçerik bulunamadı
                    </div>
                  )}
                  
                  {/* Görsel hata durumu */}
                  <div className="hidden bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                    Görsel yüklenemedi
                  </div>
                </div>

                {/* Meta Bilgiler */}
                <div className="border-t pt-4 text-sm text-gray-500">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Tip:</span> {selectedIcerik.tip === 'image' ? 'Görsel' : 'Yazı'}
                    </div>
                    <div>
                      <span className="font-medium">Oluşturan:</span> {selectedIcerik.created_by_username}
                    </div>
                    <div>
                      <span className="font-medium">Tarih:</span> {new Date(selectedIcerik.created_at).toLocaleString('tr-TR')}
                    </div>
                    <div>
                      <span className="font-medium">ID:</span> {selectedIcerik.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KoleksiyonYeni;