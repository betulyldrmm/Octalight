import React, { useState } from 'react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

   const url = isLogin ? 'http://localhost:5000/api/login' : 'http://localhost:5000/api/register';


    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(isLogin ? 'Giriş başarılı!' : 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        if (isLogin) {
          localStorage.setItem('token', data.token);
        }
      } else {
        setMessage(data.message || 'Bir hata oluştu!');
      }
    } catch (error) {
      setMessage('Sunucuya bağlanırken hata oluştu.');
    }
  };

  return (
    <div style={{ background:'gray',maxWidth: 400, margin: '200px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>{isLogin ? 'Giriş Yap' : 'Kayıt Ol'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 8, fontSize: 16 }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, fontSize: 16, cursor: 'pointer' }}>
          {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>
      {message && <p style={{ marginTop: 15 }}>{message}</p>}
      <p style={{ marginTop: 20, textAlign: 'center' }}>
        {isLogin ? 'Hesabın yok mu? ' : 'Zaten hesabın var mı? '}
        <button
          onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
          style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isLogin ? 'Kayıt Ol' : 'Giriş Yap'}
        </button>
      </p>
    </div>
  );
}

export default AuthPage;
