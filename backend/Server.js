const express = require('express');
const cors = require('cors');

const app = express();

// CORS ayarları
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Sahte kullanıcı verisi
let users = [];

// Test endpoint'i
app.get('/', (req, res) => {
  res.json({ message: 'Sunucu çalışıyor!' });
});

// Kayıt endpoint'i
app.post('/api/register', (req, res) => {
  console.log('Register isteği alındı:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email ve şifre gerekli.' });
  }
  
  const userExists = users.find(user => user.email === email);
  if (userExists) {
    return res.status(400).json({ message: 'Bu email ile kayıtlı bir kullanıcı zaten var.' });
  }

  users.push({ email, password });
  console.log('Kullanıcı kaydedildi:', { email });
  return res.status(201).json({ message: 'Kayıt başarılı!' });
});

// Giriş endpoint'i
app.post('/api/login', (req, res) => {
  console.log('Login isteği alındı:', req.body);
  
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Geçersiz email veya şifre.' });
  }

  return res.status(200).json({ 
    token: 'fake-jwt-token',
    message: 'Giriş başarılı!'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
  console.log(`Test için: http://localhost:${PORT}`);
});