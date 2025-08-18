// users.js - Backend API dosyası
const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = 3001; // Backend portu
const JWT_SECRET = 'your-secret-key-change-this'; // Bu anahtarı değiştirin

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite'ın çalıştığı port
  credentials: true
}));
app.use(express.json());

// Test endpoint'i
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend çalışıyor!',
    timestamp: new Date().toISOString()
  });
});

// MySQL bağlantı ayarları
const dbConfig = {
  host: 'localhost',
  user: 'root', // Genellikle root
  password: '', // XAMPP'te genelde boş, WAMP'te de boş
  database: 'koleksiyondb',
  port: 3306 // MySQL portu genelde 3306
};

// Veritabanı bağlantısı test et
async function testConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Veritabanına başarıyla bağlanıldı!');
    await connection.end();
  } catch (error) {
    console.error('❌ Veritabanı bağlantı hatası:', error.message);
    console.log('💡 Çözüm önerileri:');
    console.log('   - XAMPP/WAMP MySQL servisinin çalıştığından emin olun');
    console.log('   - phpMyAdmin\'de koleksiyondb veritabanının var olduğunu kontrol edin');
    console.log('   - MySQL şifrenizi kontrol edin (genelde boş olur)');
  }
}

// Users tablosunu oluştur
async function createUsersTable() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('✅ Users tablosu oluşturuldu/kontrol edildi');
    
    // Varsayılan admin kullanıcısı oluştur
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const insertAdminQuery = `
      INSERT IGNORE INTO users (username, email, password, role) 
      VALUES ('admin', 'admin@example.com', ?, 'admin')
    `;
    
    await connection.execute(insertAdminQuery, [hashedPassword]);
    console.log('✅ Varsayılan admin kullanıcısı oluşturuldu');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Tablo oluşturma hatası:', error.message);
  }
}

// Kayıt olma endpoint'i
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tüm alanlar zorunludur' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Şifre en az 6 karakter olmalıdır' 
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Kullanıcı var mı kontrol et
    const [existingUsers] = await connection.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?', 
      [username, email]
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return res.status(400).json({ 
        success: false, 
        message: 'Bu kullanıcı adı veya email zaten kullanılıyor' 
      });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı ekle
    const [result] = await connection.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, 'admin']
    );

    await connection.end();

    res.status(201).json({
      success: true,
      message: 'Hesap başarıyla oluşturuldu',
      userId: result.insertId
    });

  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
});

// Giriş yapma endpoint'i
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kullanıcı adı ve şifre zorunludur' 
      });
    }

    const connection = await mysql.createConnection(dbConfig);
    
    // Kullanıcıyı bul
    const [users] = await connection.execute(
      'SELECT id, username, email, password, role FROM users WHERE username = ?', 
      [username]
    );

    if (users.length === 0) {
      await connection.end();
      return res.status(401).json({ 
        success: false, 
        message: 'Hatalı kullanıcı adı veya şifre' 
      });
    }

    const user = users[0];

    // Şifreyi kontrol et
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await connection.end();
      return res.status(401).json({ 
        success: false, 
        message: 'Hatalı kullanıcı adı veya şifre' 
      });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { 
        userId: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await connection.end();

    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
});

// Token doğrulama middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Yetki token\'ı bulunamadı' 
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false, 
        message: 'Geçersiz token' 
      });
    }
    req.user = user;
    next();
  });
};

// Korumalı route örneği - kullanıcı bilgilerini al
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [users] = await connection.execute(
      'SELECT id, username, email, role, created_at FROM users WHERE id = ?', 
      [req.user.userId]
    );

    await connection.end();

    if (users.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Kullanıcı bulunamadı' 
      });
    }

    res.json({
      success: true,
      user: users[0]
    });

  } catch (error) {
    console.error('Profil alma hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sunucu hatası' 
    });
  }
});

// Sunucuyu başlat
app.listen(PORT, async () => {
  console.log(`🚀 Server ${PORT} portunda çalışıyor`);
  console.log(`📊 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/register - Kayıt ol`);
  console.log(`   POST http://localhost:${PORT}/api/login - Giriş yap`);
  console.log(`   GET  http://localhost:${PORT}/api/profile - Profil bilgisi`);
  
  await testConnection();
  await createUsersTable();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 Server kapatılıyor...');
  process.exit(0);
});