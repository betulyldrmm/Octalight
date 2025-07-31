import React, { useState } from 'react';

const Auth = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        alert('Giriş başarılı!');
      } else {
        alert(data.error || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Bağlantı hatası');
    }
  };

  if (isLoggedIn) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Hoş Geldiniz!</h2>
        <p>Başarıyla giriş yaptınız.</p>
        <button onClick={() => {
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }}>
          Çıkış Yap
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '0 auto',
      backgroundColor: '#fff',
      color: '#000',
      borderRadius: '8px',
      marginTop: '40px'
    }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Girişi</h2>
      
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Kullanıcı Adı:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Şifre:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            required
          />
        </div>
        
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Giriş Yap
        </button>
      </form>
      
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: '#666' }}>
        Test için: admin / admin123
      </p>
    </div>
  );
};

export default Auth;