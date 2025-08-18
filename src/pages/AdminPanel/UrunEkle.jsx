import React, { useState, useEffect } from 'react';

const UrunEkle = () => {
  const [form, setForm] = useState({
    isim: '',
    aciklama: '',
    koleksiyon_slug: '',
  });

  const [gorsel, setGorsel] = useState(null);
  const [koleksiyonlar, setKoleksiyonlar] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/koleksiyonlar')
      .then(res => res.json())
      .then(data => {
        const sabitKoleksiyonlar = [
          { slug: 'golden', isim: 'Golden Hour' },
          { slug: 'nest', isim: 'Nest' },
          { slug: 'pearls', isim: 'Pearls' },
          { slug: 'ironmite', isim: 'Ironmite' },
        ];
        const birlesmis = [...sabitKoleksiyonlar, ...data];
        setKoleksiyonlar(birlesmis);
      })
      .catch(err => console.error('Koleksiyonlar alınamadı:', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setGorsel(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('isim', form.isim);
    formData.append('aciklama', form.aciklama);
    formData.append('koleksiyon_slug', form.koleksiyon_slug);
    if (gorsel) {
      formData.append('gorsel', gorsel);
    }

    try {
      const response = await fetch('http://localhost:3001/api/urunler', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Ürün başarıyla eklendi!');
        setForm({ isim: '', aciklama: '', koleksiyon_slug: '' });
        setGorsel(null);
      } else {
        alert(data.error || 'Ürün eklenemedi!');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Sunucuya bağlanırken hata oluştu.');
    }
  };

  return (
    <div style={{
      padding: '40px',
      maxWidth: '600px',
      margin: '120px auto 40px',
      position: 'relative',
      zIndex: 1,
    }}>
      <h2>Yeni Ürün Ekle</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="isim"
          placeholder="Ürün Adı"
          value={form.isim}
          onChange={handleChange}
          style={inputStyle}
          required
        />
        <input
          type="text"
          name="aciklama"
          placeholder="Açıklama"
          value={form.aciklama}
          onChange={handleChange}
          style={inputStyle}
          required
        />

        <select
          name="koleksiyon_slug"
          value={form.koleksiyon_slug}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">Koleksiyon Seç</option>
          {koleksiyonlar.map((k, index) => (
            <option key={index} value={k.slug}>
              {k.isim}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ marginBottom: '15px' }}
          required
        />

        <button type="submit" style={buttonStyle}>Ekle</button>
      </form>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '4px'
};

const buttonStyle = {
  padding: '12px 20px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default UrunEkle;