const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'koleksiyon-secret-key-2025';

// Upload klasörünü oluştur
const uploadDir = 'uploads/koleksiyonlar';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// İçerik klasörü oluştur
const icerikDir = 'uploads/icerik';
if (!fs.existsSync(icerikDir)) {
  fs.mkdirSync(icerikDir, { recursive: true });
}

// Multer konfigürasyonu - Dynamic destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // İçerik ekleme isteği için farklı klasör
    if (req.path.includes('/icerik')) {
      cb(null, icerikDir);
    } else {
      cb(null, uploadDir);
    }
  },
  filename: function (req, file, cb) {
    // Dosya adını unique yapmak için timestamp ekle
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Sadece resim dosyalarına izin ver
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yükleyebilirsiniz! (jpeg, jpg, png, gif, webp, svg)'));
    }
  }
});

// Middleware'ler - JSON payload size limitini artır
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static files için uploads klasörünü serve et
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logger
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body keys:', Object.keys(req.body));
    if (req.files) console.log('Files:', Object.keys(req.files));
  }
  next();
});

// Veritabanı bağlantısı
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'koleksiyondb',
  port: 3307,
  acquireTimeout: 60000,
  timeout: 60000,
  charset: 'utf8mb4'
});

// Bağlantıyı canlı tut
setInterval(() => {
  db.query('SELECT 1', (err) => {
    if (err) {
      console.error('❌ Keep-alive sorgu hatası:', err);
    }
  });
}, 300000); // 5 dakika

// Veritabanı bağlan
db.connect((err) => {
  if (err) {
    console.error('❌ Veritabanı bağlantı hatası:', err);
    process.exit(1);
  } else {
    console.log('✅ Veritabanına bağlanıldı');
    createUsersTable();
  }
});

// Users tablosu oluştur
function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      full_name VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  db.query(sql, (err) => {
    if (err) {
      console.error('❌ Tablo oluşturma hatası:', err);
    } else {
      console.log('✅ Users tablosu hazır');
      createDefaultAdmin();
    }
  });
}

// Koleksiyonlar tablosunu oluştur
function createKoleksiyonlarTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS koleksiyonlar (
      id INT AUTO_INCREMENT PRIMARY KEY,
      isim VARCHAR(255) NOT NULL,
      aciklama TEXT,
      slug VARCHAR(255) UNIQUE NOT NULL,
      gorsel_url VARCHAR(500),
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_slug (slug),
      INDEX idx_created_by (created_by)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  db.query(sql, (err) => {
    if (err) {
      console.error('❌ Koleksiyonlar tablosu oluşturma hatası:', err);
    } else {
      console.log('✅ Koleksiyonlar tablosu hazır');
      createKoleksiyonIcerigiTable();
    }
  });
}

// Koleksiyon içeriği tablosunu oluştur
function createKoleksiyonIcerigiTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS koleksiyon_icerik (
      id INT AUTO_INCREMENT PRIMARY KEY,
      koleksiyon_slug VARCHAR(255) NOT NULL,
      tip ENUM('image', 'text') NOT NULL,
      baslik VARCHAR(255) NOT NULL,
      aciklama TEXT,
      gorsel_url VARCHAR(500),
      yazi_icerik TEXT,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_koleksiyon_slug (koleksiyon_slug),
      INDEX idx_tip (tip),
      INDEX idx_created_by (created_by)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  db.query(sql, (err) => {
    if (err) {
      console.error('❌ Koleksiyon içerik tablosu oluşturma hatası:', err);
    } else {
      console.log('✅ Koleksiyon içerik tablosu hazır');
      createUrunlerTable();
    }
  });
}

// Ürünler tablosunu oluştur
function createUrunlerTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS urunler (
      id INT AUTO_INCREMENT PRIMARY KEY,
      isim VARCHAR(255) NOT NULL,
      aciklama TEXT,
      koleksiyon_slug VARCHAR(255) NOT NULL,
      gorsel_url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_koleksiyon_slug (koleksiyon_slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;
  
  db.query(sql, (err) => {
    if (err) {
      console.error('❌ Ürünler tablosu oluşturma hatası:', err);
    } else {
      console.log('✅ Ürünler tablosu hazır');
    }
  });
}

// Admin oluştur
function createDefaultAdmin() {
  const checkSql = 'SELECT id FROM users WHERE role = ? LIMIT 1';
  
  db.query(checkSql, ['admin'], (err, results) => {
    if (err) {
      console.error('❌ Admin kontrol hatası:', err);
      return;
    }
    
    if (results.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      const insertSql = 'INSERT INTO users (username, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)';
      
      db.query(insertSql, ['admin', 'Admin User', 'admin@example.com', hashedPassword, 'admin'], (err) => {
        if (err) {
          console.error('❌ Admin oluşturma hatası:', err);
        } else {
          console.log('✅ Admin kullanıcısı oluşturuldu (admin/admin123)');
        }
      });
    } else {
      console.log('✅ Admin kullanıcısı mevcut');
    }
    
    // Admin oluşturulduktan sonra koleksiyonlar tablosunu oluştur
    createKoleksiyonlarTable();
  });
}

// Token doğrulama middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token bulunamadı - Lütfen giriş yapın'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Token doğrulama hatası:', err);
      return res.status(403).json({
        success: false,
        error: 'Geçersiz veya süresi dolmuş token - Lütfen tekrar giriş yapın'
      });
    }
    req.user = user;
    console.log('✅ Token doğrulandı - Kullanıcı:', user.username);
    next();
  });
};

// ========== ROUTES - DOĞRU SIRALAMA ==========

// Ana sayfa
app.get('/', (req, res) => {
  res.json({
    message: '✅ Koleksiyon API Server çalışıyor!',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    endpoints: {
      auth: [
        'POST /api/register - Kayıt ol',
        'POST /api/login - Giriş yap',
        'GET /api/profile - Profil (auth gerekli)'
      ],
      koleksiyonlar: [
        'GET /api/koleksiyonlar - Koleksiyonları listele',
        'GET /api/koleksiyonlar/:slug - Tekil koleksiyon getir',
        'POST /api/koleksiyonlar/bulk - Koleksiyon toplu ekle (auth gerekli)',
        'DELETE /api/koleksiyonlar/:slug - Koleksiyon sil (auth gerekli)'
      ],
      icerik: [
        'GET /api/koleksiyonlar/:slug/icerik - Koleksiyon içeriğini getir',
        'POST /api/koleksiyonlar/:slug/icerik - İçerik ekle (auth gerekli)',
        'PUT /api/koleksiyonlar/icerik/:id - İçerik güncelle (auth gerekli)',
        'DELETE /api/koleksiyonlar/icerik/:id - İçerik sil (auth gerekli)'
      ],
      urunler: [
        'GET /api/urunler - Ürünleri listele',
        'GET /api/urunler/:id - Tekil ürün getir',
        'POST /api/urunler - Ürün ekle',
        'PUT /api/urunler/:id - Ürün güncelle',
        'DELETE /api/urunler/:id - Ürün sil'
      ]
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: '✅ Test başarılı!',
    timestamp: new Date().toISOString(),
    database: 'Bağlı',
    uploads: 'Aktif'
  });
});

// ========== AUTH ROUTES ==========

// Kayıt endpoint
app.post('/api/register', (req, res) => {
  const { username, email, password, fullName } = req.body;

  // Validasyon
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Kullanıcı adı, email ve şifre zorunludur'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Şifre en az 6 karakter olmalıdır'
    });
  }

  // Email format kontrolü
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      error: 'Geçerli email adresi girin'
    });
  }

  // Kullanıcı var mı kontrol
  const checkSql = 'SELECT id FROM users WHERE username = ? OR email = ?';
  db.query(checkSql, [username, email], (err, results) => {
    if (err) {
      console.error('❌ Kullanıcı kontrol hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }

    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Bu kullanıcı adı veya email zaten kullanılıyor'
      });
    }

    // Şifreyi hashle ve kaydet
    const hashedPassword = bcrypt.hashSync(password, 10);
    const insertSql = 'INSERT INTO users (username, full_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)';

    db.query(insertSql, [username, fullName || null, email, hashedPassword, 'user'], (err, result) => {
      if (err) {
        console.error('❌ Kayıt hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'Kayıt sırasında hata oluştu'
        });
      }

      console.log('✅ Yeni kullanıcı kaydedildi:', username);
      res.status(201).json({
        success: true,
        message: 'Hesap başarıyla oluşturuldu!',
        userId: result.insertId
      });
    });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: 'Kullanıcı adı ve şifre zorunludur'
    });
  }

  // Kullanıcıyı bul
  const findSql = 'SELECT id, username, full_name, email, password_hash, role FROM users WHERE username = ?';
  db.query(findSql, [username], (err, results) => {
    if (err) {
      console.error('❌ Login sorgu hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Hatalı kullanıcı adı veya şifre'
      });
    }

    const user = results[0];

    // Şifre kontrol
    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Hatalı kullanıcı adı veya şifre'
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

    console.log('✅ Giriş başarılı:', username);
    res.json({
      success: true,
      message: 'Giriş başarılı',
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// Profil endpoint
app.get('/api/profile', authenticateToken, (req, res) => {
  const sql = 'SELECT id, username, full_name, email, role, created_at FROM users WHERE id = ?';
  db.query(sql, [req.user.userId], (err, results) => {
    if (err) {
      console.error('❌ Profil hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    res.json({
      success: true,
      user: results[0]
    });
  });
});

// ========== KOLEKSİYON ROUTES - DOĞRU SIRALAMA ==========

// 1. Koleksiyonları toplu ekle (SPESİFİK - ÜSTTE)
app.post('/api/koleksiyonlar/bulk', authenticateToken, (req, res) => {
  // Mevcut bulk ekleme kodunuz...
  console.log('📦 Bulk koleksiyon ekleme isteği geldi');
  // ... bulk ekleme kodu
});

// 2. İçerik ekle (SPESİFİK - :slug/icerik route'u)
app.post('/api/koleksiyonlar/:slug/icerik', authenticateToken, (req, res) => {
  console.log('➕ Yeni içerik ekleme isteği geldi:', req.params.slug);
  
  const uploadMiddleware = upload.single('gorsel');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ İçerik ekleme upload hatası:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    const { slug } = req.params;
    const { tip, baslik, aciklama, yazi } = req.body;

    console.log('📝 Ekleme verileri:', { slug, tip, baslik, aciklama: aciklama ? 'Var' : 'Yok' });
    console.log('📂 Yüklenen dosya:', req.file ? req.file.filename : 'Yok');

    // Validasyon
    if (!tip || !baslik) {
      return res.status(400).json({
        success: false,
        error: 'Tip ve başlık zorunludur'
      });
    }

    // Tip kontrolü
    if (!['image', 'text'].includes(tip)) {
      return res.status(400).json({
        success: false,
        error: 'Geçersiz içerik tipi. Sadece "image" veya "text" kabul edilir'
      });
    }

    // İçerik tipine göre validasyon
    if (tip === 'text' && (!yazi || yazi.trim() === '')) {
      return res.status(400).json({
        success: false,
        error: 'Yazı tipi için içerik gerekli'
      });
    }

    // Önce koleksiyonun var olup olmadığını kontrol et
    const checkCollectionSql = 'SELECT id FROM koleksiyonlar WHERE slug = ?';
    db.query(checkCollectionSql, [slug], (err, results) => {
      if (err) {
        console.error('❌ Koleksiyon kontrol hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'Koleksiyon kontrolü yapılırken hata oluştu'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Koleksiyon bulunamadı'
        });
      }

      // Görsel URL'i ayarla
      let gorselUrl = null;
      if (req.file) {
        gorselUrl = `/uploads/icerik/${req.file.filename}`;
        console.log('📷 Görsel URL:', gorselUrl);
      }

      // İçeriği veritabanına ekle
      const insertSql = `
        INSERT INTO koleksiyon_icerik 
        (koleksiyon_slug, tip, baslik, aciklama, gorsel_url, yazi_icerik, created_by, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `;
      
      const values = [
        slug,
        tip,
        baslik.trim(),
        aciklama ? aciklama.trim() : null,
        gorselUrl,
        tip === 'text' && yazi ? yazi.trim() : null,
        req.user.userId
      ];

      console.log('💾 Ekleme parametreleri:', values);
      
      db.query(insertSql, values, (err, result) => {
        if (err) {
          console.error('❌ İçerik ekleme hatası:', err);
          return res.status(500).json({
            success: false,
            error: 'İçerik eklenirken hata oluştu: ' + err.message
          });
        }

        const yeniIcerikId = result.insertId;
        console.log('✅ Yeni içerik eklendi - ID:', yeniIcerikId);
        
        res.status(201).json({
          success: true,
          message: 'İçerik başarıyla eklendi',
          icerik: {
            id: yeniIcerikId,
            koleksiyon_slug: slug,
            tip,
            baslik: baslik.trim(),
            aciklama: aciklama ? aciklama.trim() : null,
            gorsel_url: gorselUrl,
            yazi_icerik: tip === 'text' && yazi ? yazi.trim() : null,
            created_by: req.user.userId
          }
        });
      });
    });
  });
});

// 3. İçerik güncelle (SPESİFİK - icerik/:id route'u)
app.put('/api/koleksiyonlar/icerik/:id', authenticateToken, (req, res) => {
  console.log('✏️ İçerik güncelleme isteği geldi:', req.params.id);
  
  const uploadMiddleware = upload.single('gorsel');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ İçerik güncelleme upload hatası:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    const { id } = req.params;
    const { tip, baslik, aciklama, yazi } = req.body;

    // Validasyon
    if (!tip || !baslik) {
      return res.status(400).json({
        success: false,
        error: 'Tip ve başlık zorunludur'
      });
    }

    // Önce mevcut içeriği bul
    const findSql = 'SELECT * FROM koleksiyon_icerik WHERE id = ?';
    db.query(findSql, [id], (err, results) => {
      if (err) {
        console.error('❌ İçerik bulma hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'İçerik bulunurken hata oluştu'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'İçerik bulunamadı'
        });
      }

      const mevcutIcerik = results[0];

      // Kullanıcı yetki kontrolü
      if (req.user.role !== 'admin' && mevcutIcerik.created_by !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: 'Bu içeriği düzenleme yetkiniz yok'
        });
      }

      let gorselUrl = mevcutIcerik.gorsel_url;

      // Yeni görsel yüklendiyse
      if (req.file) {
        gorselUrl = `/uploads/icerik/${req.file.filename}`;
        
        // Eski dosyayı sil
        if (mevcutIcerik.gorsel_url) {
          const eskiDosyaPath = path.join(__dirname, mevcutIcerik.gorsel_url);
          if (fs.existsSync(eskiDosyaPath)) {
            try {
              fs.unlinkSync(eskiDosyaPath);
              console.log('✅ Eski görsel dosyası silindi');
            } catch (fileErr) {
              console.error('❌ Eski dosya silme hatası:', fileErr);
            }
          }
        }
      }

      const updateSql = `
        UPDATE koleksiyon_icerik 
        SET tip = ?, baslik = ?, aciklama = ?, gorsel_url = ?, yazi_icerik = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `;
      
      db.query(updateSql, [
        tip,
        baslik.trim(),
        aciklama ? aciklama.trim() : null,
        gorselUrl,
        tip === 'text' && yazi ? yazi.trim() : null,
        id
      ], (err, result) => {
        if (err) {
          console.error('❌ İçerik güncelleme hatası:', err);
          return res.status(500).json({
            success: false,
            error: 'İçerik güncellenirken hata oluştu'
          });
        }

        res.json({
          success: true,
          message: 'İçerik başarıyla güncellendi',
          icerik: {
            id: parseInt(id),
            tip,
            baslik: baslik.trim(),
            aciklama: aciklama ? aciklama.trim() : null,
            gorsel_url: gorselUrl,
            yazi_icerik: tip === 'text' && yazi ? yazi.trim() : null
          }
        });
      });
    });
  });
});

// 4. İçerik sil (SPESİFİK - icerik/:id route'u)
app.delete('/api/koleksiyonlar/icerik/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  console.log('🗑️ İçerik silme isteği:', id);
  
  // Önce içeriği bul
  const findSql = 'SELECT * FROM koleksiyon_icerik WHERE id = ?';
  db.query(findSql, [id], (err, results) => {
    if (err) {
      console.error('❌ İçerik bulma hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'İçerik bulunurken hata oluştu'
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'İçerik bulunamadı'
      });
    }
    
    const icerik = results[0];
    
    // Kullanıcı yetki kontrolü
    if (req.user.role !== 'admin' && icerik.created_by !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Bu içeriği silme yetkiniz yok'
      });
    }
    
    // İçeriği sil
    const deleteSql = 'DELETE FROM koleksiyon_icerik WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error('❌ İçerik silme hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'İçerik silinirken hata oluştu'
        });
      }
      
      // Görsel dosyasını sil
      if (icerik.gorsel_url) {
        const filePath = path.join(__dirname, icerik.gorsel_url);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('✅ İçerik dosyası silindi:', filePath);
          } catch (fileErr) {
            console.error('❌ Dosya silme hatası:', fileErr);
          }
        }
      }
      
      console.log('✅ İçerik silindi:', id);
      res.json({
        success: true,
        message: 'İçerik başarıyla silindi'
      });
    });
  });
});

// 5. İçerikleri getir (SPESİFİK - :slug/icerik GET route'u)
app.get('/api/koleksiyonlar/:slug/icerik', (req, res) => {
  const { slug } = req.params;
  console.log('📋 İçerik listesi istendi:', slug);
  
  const sql = `
    SELECT ki.*, u.username as created_by_username 
    FROM koleksiyon_icerik ki
    LEFT JOIN users u ON ki.created_by = u.id 
    WHERE ki.koleksiyon_slug = ? 
    ORDER BY ki.created_at DESC
  `;
  
  db.query(sql, [slug], (err, results) => {
    if (err) {
      console.error('❌ İçerik listesi hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'İçerik yüklenirken hata oluştu'
      });
    }

    console.log(`📊 ${results.length} içerik bulundu`);
    res.json({
      success: true,
      icerik: results,
      // Frontend uyumluluğu için iki format da
      icerikler: results
    });
  });
});

// 6. Koleksiyonları listele (GENEL)
app.get('/api/koleksiyonlar', (req, res) => {
  console.log('📋 Koleksiyonlar listesi istendi');
  
  const sql = `
    SELECT k.*, u.username as created_by_username 
    FROM koleksiyonlar k 
    LEFT JOIN users u ON k.created_by = u.id 
    ORDER BY k.created_at DESC
  `;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Koleksiyonlar listesi hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Koleksiyonlar yüklenirken hata oluştu'
      });
    }

    console.log(`📊 ${results.length} koleksiyon bulundu`);

    const koleksiyonlar = results.map(k => ({
      ...k,
      gorselUrl: k.gorsel_url
    }));

    res.json({
      success: true,
      koleksiyonlar: koleksiyonlar
    });
  });
});

// 7. Koleksiyon güncelle (SPESİFİK - :slug PUT route'u)
app.put('/api/koleksiyonlar/:slug', authenticateToken, (req, res) => {
  // Mevcut güncelleme kodunuz...
});

// 8. Koleksiyon sil (SPESİFİK - :slug DELETE route'u)
app.delete('/api/koleksiyonlar/:slug', authenticateToken, (req, res) => {
  // Mevcut silme kodunuz...
});

// 9. Tekil koleksiyon getir (EN SONDA - GENEL :slug route'u)
app.get('/api/koleksiyonlar/:slug', (req, res) => {
  const { slug } = req.params;
  console.log('🔍 Koleksiyon detay istendi:', slug);
  
  const sql = `
    SELECT k.*, u.username as created_by_username 
    FROM koleksiyonlar k 
    LEFT JOIN users u ON k.created_by = u.id 
    WHERE k.slug = ?
  `;
  
  db.query(sql, [slug], (err, results) => {
    if (err) {
      console.error('❌ Koleksiyon detay hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Koleksiyon yüklenirken hata oluştu'
      });
    }

    if (results.length === 0) {
      console.log('❌ Koleksiyon bulunamadı:', slug);
      return res.status(404).json({
        success: false,
        error: 'Koleksiyon bulunamadı'
      });
    }

    console.log('✅ Koleksiyon bulundu:', results[0].isim);
    res.json({
      success: true,
      koleksiyon: {
        ...results[0],
        gorselUrl: results[0].gorsel_url
      }
    });
  });
});
// ========== ÜRÜN ROUTES ==========

// Ürün ekleme endpoint'i
app.post('/api/urunler', (req, res) => {
  console.log('🛍️ Ürün ekleme isteği geldi');
  
  const uploadMiddleware = upload.single('gorsel');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ Ürün upload hatası:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    const { isim, aciklama, koleksiyon_slug } = req.body;

    console.log('📝 Ürün verileri:', { isim, aciklama, koleksiyon_slug });
    console.log('📂 Dosya:', req.file ? req.file.filename : 'Yok');

    // Validasyon
    if (!isim || !aciklama || !koleksiyon_slug) {
      return res.status(400).json({
        success: false,
        error: 'İsim, açıklama ve koleksiyon seçimi zorunludur'
      });
    }

    // Görsel URL'i oluştur
    let gorselUrl = null;
    if (req.file) {
      gorselUrl = `/uploads/koleksiyonlar/${req.file.filename}`;
    }

    // Veritabanına kaydet
    const sql = 'INSERT INTO urunler (isim, aciklama, koleksiyon_slug, gorsel_url) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [isim.trim(), aciklama.trim(), koleksiyon_slug, gorselUrl], (err, result) => {
      if (err) {
        console.error('❌ Ürün kaydetme hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'Ürün kaydedilirken hata oluştu'
        });
      }

      console.log('✅ Yeni ürün eklendi:', isim);
      res.status(201).json({
        success: true,
        message: 'Ürün başarıyla eklendi',
        urun: {
          id: result.insertId,
          isim,
          aciklama,
          koleksiyon_slug,
          gorsel_url: gorselUrl
        }
      });
    });
  });
});

// Koleksiyon bilgilerini çekme endpoint'i (eğer yoksa)
app.get('/api/koleksiyonlar/:slug', (req, res) => {
  console.log('📄 Koleksiyon bilgisi çekme:', req.params.slug);
  
  const { slug } = req.params;
  
  const sql = 'SELECT * FROM koleksiyonlar WHERE slug = ?';
  
  db.query(sql, [slug], (err, results) => {
    if (err) {
      console.error('❌ Koleksiyon çekme hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Koleksiyon çekilirken hata oluştu'
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Koleksiyon bulunamadı'
      });
    }
    
    console.log('✅ Koleksiyon bulundu:', results[0].isim);
    
    res.json({
      success: true,
      koleksiyon: results[0]
    });
  });
});

// Koleksiyon içeriğini getir
app.get('/api/koleksiyonlar/:slug/icerik', (req, res) => {
  const { slug } = req.params;
  console.log('📋 İçerik listesi istendi:', slug);
  
  const sql = `
    SELECT ki.*, u.username as created_by_username 
    FROM koleksiyon_icerik ki
    LEFT JOIN users u ON ki.created_by = u.id 
    WHERE ki.koleksiyon_slug = ? 
    ORDER BY ki.created_at DESC
  `;
  
  db.query(sql, [slug], (err, results) => {
    if (err) {
      console.error('❌ İçerik listesi hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'İçerik yüklenirken hata oluştu'
      });
    }

    console.log(`📊 ${results.length} içerik bulundu`);
    res.json({
      success: true,
      icerik: results
    });
  });
});

// İçerik sil
app.delete('/api/koleksiyonlar/icerik/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  console.log('🗑️ İçerik silme isteği:', id);
  
  // Önce içeriği bul
  const findSql = 'SELECT * FROM koleksiyon_icerik WHERE id = ?';
  db.query(findSql, [id], (err, results) => {
    if (err) {
      console.error('❌ İçerik bulma hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'İçerik bulunurken hata oluştu'
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'İçerik bulunamadı'
      });
    }
    
    const icerik = results[0];
    
    // Kullanıcı yetki kontrolü
    if (req.user.role !== 'admin' && icerik.created_by !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: 'Bu içeriği silme yetkiniz yok'
      });
    }
    
    // İçeriği sil
    const deleteSql = 'DELETE FROM koleksiyon_icerik WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error('❌ İçerik silme hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'İçerik silinirken hata oluştu'
        });
      }
      
      // Görsel dosyasını sil
      if (icerik.gorsel_url) {
        const filePath = path.join(__dirname, icerik.gorsel_url);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('✅ İçerik dosyası silindi:', filePath);
          } catch (fileErr) {
            console.error('❌ Dosya silme hatası:', fileErr);
          }
        }
      }
      
      console.log('✅ İçerik silindi:', id);
      res.json({
        success: true,
        message: 'İçerik başarıyla silindi'
      });
    });
  });
});

// ========== ÜRÜN ROUTES ==========

// Ürün ekleme endpoint'i
app.post('/api/urunler', (req, res) => {
  console.log('🛍️ Ürün ekleme isteği geldi');
  
  const uploadMiddleware = upload.single('gorsel');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ Ürün upload hatası:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    const { isim, aciklama, koleksiyon_slug } = req.body;

    console.log('📝 Ürün verileri:', { isim, aciklama, koleksiyon_slug });
    console.log('📂 Dosya:', req.file ? req.file.filename : 'Yok');

    // Validasyon
    if (!isim || !aciklama || !koleksiyon_slug) {
      return res.status(400).json({
        success: false,
        error: 'İsim, açıklama ve koleksiyon seçimi zorunludur'
      });
    }

    // Görsel URL'i oluştur
    let gorselUrl = null;
    if (req.file) {
      gorselUrl = `/uploads/koleksiyonlar/${req.file.filename}`;
    }

    // Veritabanına kaydet
    const sql = 'INSERT INTO urunler (isim, aciklama, koleksiyon_slug, gorsel_url) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [isim.trim(), aciklama.trim(), koleksiyon_slug, gorselUrl], (err, result) => {
      if (err) {
        console.error('❌ Ürün kaydetme hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'Ürün kaydedilirken hata oluştu'
        });
      }

      console.log('✅ Yeni ürün eklendi:', isim);
      res.status(201).json({
        success: true,
        message: 'Ürün başarıyla eklendi',
        urun: {
          id: result.insertId,
          isim,
          aciklama,
          koleksiyon_slug,
          gorsel_url: gorselUrl
        }
      });
    });
  });
});

// Ürünleri listele
app.get('/api/urunler', (req, res) => {
  const { koleksiyon_slug } = req.query;
  console.log('📋 Ürünler listesi istendi, koleksiyon:', koleksiyon_slug || 'Tümü');
  
  let sql = 'SELECT * FROM urunler';
  let params = [];
  
  if (koleksiyon_slug) {
    sql += ' WHERE koleksiyon_slug = ?';
    params.push(koleksiyon_slug);
  }
  
  sql += ' ORDER BY created_at DESC';
  
  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('❌ Ürünler listesi hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Ürünler yüklenirken hata oluştu'
      });
    }

    console.log(`📊 ${results.length} ürün bulundu`);
    res.json({
      success: true,
      urunler: results
    });
  });
});

// Tekil ürün getir
app.get('/api/urunler/:id', (req, res) => {
  const { id } = req.params;
  console.log('🔍 Ürün detay istendi:', id);
  
  const sql = 'SELECT * FROM urunler WHERE id = ?';
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('❌ Ürün detay hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Ürün yüklenirken hata oluştu'
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ürün bulunamadı'
      });
    }

    console.log('✅ Ürün bulundu:', results[0].isim);
    res.json({
      success: true,
      urun: results[0]
    });
  });
});

// Bu kodu backend kodunuzun KOLEKSİYON ROUTES bölümüne ekleyin
// Koleksiyon güncelleme endpoint'i - Koleksiyon silme endpoint'inden ÖNCE ekleyin
// Koleksiyon güncelleme endpoint'i
app.put('/api/koleksiyonlar/:slug', authenticateToken, (req, res) => {
  console.log('✏️ Koleksiyon güncelleme isteği geldi:', req.params.slug);
  
  const uploadMiddleware = upload.single('gorsel');
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      console.error('❌ Koleksiyon güncelleme upload hatası:', err);
      return res.status(400).json({
        success: false,
        error: err.message
      });
    }

    const { slug } = req.params;
    const { isim, aciklama } = req.body;

    console.log('📝 Güncelleme verileri:', { slug, isim, aciklama });
    console.log('📂 Yeni dosya:', req.file ? req.file.filename : 'Yok');

    // Validasyon
    if (!isim || !aciklama) {
      return res.status(400).json({
        success: false,
        error: 'İsim ve açıklama zorunludur'
      });
    }

    // Önce mevcut koleksiyonu bul
    const findSql = 'SELECT * FROM koleksiyonlar WHERE slug = ?';
    db.query(findSql, [slug], (err, results) => {
      if (err) {
        console.error('❌ Koleksiyon bulma hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'Koleksiyon bulunurken hata oluştu'
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'Koleksiyon bulunamadı'
        });
      }

      const mevcutKoleksiyon = results[0];

      // Kullanıcı yetki kontrolü
      if (req.user.role !== 'admin' && mevcutKoleksiyon.created_by !== req.user.userId) {
        return res.status(403).json({
          success: false,
          error: 'Bu koleksiyonu düzenleme yetkiniz yok'
        });
      }

      console.log('✅ Mevcut koleksiyon bulundu:', mevcutKoleksiyon.isim);

      // Görsel URL'i ayarla
      let gorselUrl = mevcutKoleksiyon.gorsel_url; // Mevcut görseli koru

      // Yeni görsel yüklendiyse
      if (req.file) {
        gorselUrl = `/uploads/koleksiyonlar/${req.file.filename}`;
        console.log('📷 Yeni görsel URL:', gorselUrl);
        
        // Eski dosyayı sil
        if (mevcutKoleksiyon.gorsel_url) {
          const eskiDosyaPath = path.join(__dirname, mevcutKoleksiyon.gorsel_url);
          if (fs.existsSync(eskiDosyaPath)) {
            try {
              fs.unlinkSync(eskiDosyaPath);
              console.log('✅ Eski görsel dosyası silindi:', eskiDosyaPath);
            } catch (fileErr) {
              console.error('❌ Eski dosya silme hatası:', fileErr);
            }
          }
        }
      }

      // Koleksiyonu güncelle
      const updateSql = `
        UPDATE koleksiyonlar 
        SET isim = ?, aciklama = ?, gorsel_url = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE slug = ?
      `;
      
      const values = [
        isim.trim(),
        aciklama.trim(),
        gorselUrl,
        slug
      ];

      console.log('💾 Güncelleme parametreleri:', values);
      
      db.query(updateSql, values, (err, result) => {
        if (err) {
          console.error('❌ Koleksiyon güncelleme hatası:', err);
          return res.status(500).json({
            success: false,
            error: 'Koleksiyon güncellenirken hata oluştu: ' + err.message
          });
        }

        console.log('✅ Koleksiyon güncellendi - Slug:', slug);
        res.json({
          success: true,
          message: 'Koleksiyon başarıyla güncellendi! 🎉',
          koleksiyon: {
            id: mevcutKoleksiyon.id,
            isim: isim.trim(),
            aciklama: aciklama.trim(),
            slug: slug,
            gorsel_url: gorselUrl,
            gorselUrl: gorselUrl, // Frontend uyumluluğu için
            created_by: mevcutKoleksiyon.created_by
          }
        });
      });
    });
  });
});

// Ürün silme endpoint'i
app.delete('/api/urunler/:id', (req, res) => {
  const { id } = req.params;
  
  console.log(`🗑️ Ürün silme isteği: ${id}`);
  
  // Önce ürünü bul ve dosya yolunu al
  const findSql = 'SELECT * FROM urunler WHERE id = ?';
  db.query(findSql, [id], (err, results) => {
    if (err) {
      console.error('❌ Ürün bulma hatası:', err);
      return res.status(500).json({
        success: false,
        error: 'Ürün bulunurken hata oluştu'
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ürün bulunamadı'
      });
    }
    
    const urun = results[0];
    
    // Ürünü sil
    const deleteSql = 'DELETE FROM urunler WHERE id = ?';
    db.query(deleteSql, [id], (err, result) => {
      if (err) {
        console.error('❌ Ürün silme hatası:', err);
        return res.status(500).json({
          success: false,
          error: 'Ürün silinirken hata oluştu'
        });
      }
      
      // Görsel dosyasını sil
      if (urun.gorsel_url) {
        const filePath = path.join(__dirname, urun.gorsel_url);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
            console.log('✅ Görsel dosyası silindi:', filePath);
          } catch (fileErr) {
            console.error('❌ Dosya silme hatası:', fileErr);
          }
        }
      }
      
      console.log('✅ Ürün silindi:', id);
      res.json({
        success: true,
        message: 'Ürün başarıyla silindi'
      });
    });
  });
});

// Hata yakalama middleware
app.use((error, req, res, next) => {
  console.error('❌ Beklenmeyen hata:', error);
  res.status(500).json({
    success: false,
    error: 'Sunucu hatası oluştu: ' + error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log('❌ 404 - Endpoint bulunamadı:', req.method, req.originalUrl);
  res.status(404).json({
    success: false,
    error: `Endpoint bulunamadı: ${req.method} ${req.originalUrl}`,
    availableEndpoints: [
      'GET /',
      'GET /api/test',
      'POST /api/login',
      'POST /api/register',
      'GET /api/koleksiyonlar',
      'POST /api/koleksiyonlar/bulk',
      'POST /api/koleksiyonlar/icerik'
    ]
  });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server kapatılıyor...');
  db.end(() => {
    console.log('✅ Veritabanı bağlantısı kapatıldı');
    process.exit(0);
  });
});

// Server başlat
app.listen(PORT, () => {
  console.log('🚀=============================================🚀');
  console.log(`🌟 Koleksiyon API Server ${PORT} portunda başlatıldı!`);
  console.log(`🌐 Ana sayfa: http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`📂 Uploads: /uploads klasörü aktif`);
  console.log(`🔐 JWT Token süresi: 24 saat`);
  console.log(`👤 Admin: admin / admin123`);
  console.log('📝 Tüm istekler loglanıyor');
  console.log('🚀=============================================🚀');
});