import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/auth'); // Giriş yapılmadıysa yönlendir
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/auth');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', marginTop: '100px' }}>

      <h1>Admin Paneli</h1>
      <p>Hoş geldin! Buradan koleksiyon ve ürün ekleyebilirsin.</p>

      <div style={{ marginTop: '30px' }}>
        <button
          onClick={() => navigate('/admin/urun-ekle')}
          style={buttonStyle}
        >
          Ürün Ekle
        </button>
        <button
          onClick={() => navigate('/admin/koleksiyon-ekle')}
          style={buttonStyle}
        >
          Koleksiyon Ekle
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{ ...buttonStyle, backgroundColor: '#dc3545', marginTop: '40px' }}
      >
        Çıkış Yap
      </button>
    </div>
  );
};

const buttonStyle = {
  padding: '12px 24px',
  margin: '0 10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default AdminPanel;
