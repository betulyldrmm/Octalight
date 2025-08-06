const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Orta katmanlar
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Veritabanı bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'koleksiyon'
});

// Görsel yükleme ayarı (multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });


// ✅ 1. Koleksiyonları getir (Dropdown için)
app.get('/api/koleksiyonlar', (req, res) => {
  const sql = "SELECT id, isim, slug FROM koleksiyonlar";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Veritabanı hatası", details: err });
    res.json(results);
  });
});


// ✅ 2. Ürün ekle (koleksiyon_id varsa kullanır, yoksa sadece slug ile ekler)
app.post('/api/urunler', upload.single('gorsel'), (req, res) => {
  const { koleksiyon_id, isim, aciklama, koleksiyon_slug } = req.body;
  const gorsel = req.file ? req.file.filename : null;

  const koleksiyonIdToInsert = koleksiyon_id && koleksiyon_id !== '' ? koleksiyon_id : null;

  const sql = koleksiyonIdToInsert
    ? `INSERT INTO urunler (koleksiyon_id, isim, aciklama, resim_url, koleksiyon_slug)
       VALUES (?, ?, ?, ?, ?)`
    : `INSERT INTO urunler (isim, aciklama, resim_url, koleksiyon_slug)
       VALUES (?, ?, ?, ?)`;

  const values = koleksiyonIdToInsert
    ? [koleksiyonIdToInsert, isim, aciklama, gorsel, koleksiyon_slug]
    : [isim, aciklama, gorsel, koleksiyon_slug];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Ürün ekleme hatası:", err);
      return res.status(500).json({ error: "Ürün ekleme hatası", details: err });
    }

    res.json({ success: true, id: result.insertId });
  });
});


// ✅ 3. Koleksiyon ekle (görselle birlikte)
app.post('/api/koleksiyonlar', upload.single('gorsel'), (req, res) => {
  const { isim, aciklama, slug } = req.body;
  const gorsel = req.file ? req.file.filename : null;

  const sql = `INSERT INTO koleksiyonlar (isim, aciklama, gorsel, slug)
               VALUES (?, ?, ?, ?)`;

  db.query(sql, [isim, aciklama, gorsel, slug], (err, result) => {
    if (err) return res.status(500).json({ error: "Koleksiyon ekleme hatası", details: err });
    res.json({ success: true, id: result.insertId });
  });
});


// ✅ 4. Ürünleri listele
app.get('/api/urunler', (req, res) => {
  const sql = `
    SELECT u.*, k.isim as koleksiyon_adi 
    FROM urunler u 
    LEFT JOIN koleksiyonlar k ON u.koleksiyon_id = k.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});


// ✅ Server başlat
app.listen(3001, () => {
  console.log("✅ Sunucu çalışıyor: http://localhost:3001");
});
