import React, { useState } from 'react';

const KoleksiyonEkle = () => {
  const [form, setForm] = useState({
    isim: '',
    aciklama: '',
    slug: ''
  });

  const [gorsel, setGorsel] = useState(null);

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
    formData.append('slug', form.slug);
    if (gorsel) {
      formData.append('gorsel', gorsel);
    }

    try {
      const response = await fetch('http://localhost:3001/api/koleksiyonlar', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        alert('Koleksiyon başarıyla eklendi!');
        setForm({ isim: '', aciklama: '', slug: '' });
        setGorsel(null);
      } else {
        alert(data.error || 'Ekleme başarısız!');
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
  margin: '120px auto 40px', // 👈 burada marginTop: 120px önemli
  position: 'relative',
  zIndex: 1,
}}>

      <h2>Yeni Koleksiyon Ekle</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="isim"
          placeholder="Koleksiyon Adı"
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
        <input
          type="text"
          name="slug"
          placeholder="Slug (örn: golden)"
          value={form.slug}
          onChange={handleChange}
          style={inputStyle}
          required
        />
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
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default KoleksiyonEkle;
