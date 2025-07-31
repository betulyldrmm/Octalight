const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

// Database connection
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'TasarımDb'
};

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    const [products] = await connection.execute(`
      SELECT p.*, c.name as category_name,
             GROUP_CONCAT(pi.image_url) as images
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.is_active = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);
    
    // Images string'ini array'e çevir
    const productsWithImages = products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));
    
    await connection.end();
    res.json(productsWithImages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ürünler getirilirken hata oluştu' });
  }
});

// Kategoriye göre ürünleri getir
router.get('/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    const [products] = await connection.execute(`
      SELECT p.*, c.name as category_name,
             GROUP_CONCAT(pi.image_url) as images
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE c.slug = ? AND p.is_active = 1
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `, [slug]);
    
    const productsWithImages = products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));
    
    await connection.end();
    res.json(productsWithImages);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ürünler getirilirken hata oluştu' });
  }
});

// Yeni ürün ekle
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    const connection = await mysql.createConnection(dbConfig);
    
    // Ürünü ekle
    const [result] = await connection.execute(
      'INSERT INTO products (name, description, price, category_id) VALUES (?, ?, ?, ?)',
      [name, description, price, category_id]
    );
    
    const productId = result.insertId;
    
    // Resimleri ekle
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const imageUrl = `/uploads/${req.files[i].filename}`;
        const isMain = i === 0; // İlk resim ana resim
        
        await connection.execute(
          'INSERT INTO product_images (product_id, image_url, is_main) VALUES (?, ?, ?)',
          [productId, imageUrl, isMain]
        );
      }
    }
    
    await connection.end();
    res.json({ message: 'Ürün başarıyla eklendi', productId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ürün eklenirken hata oluştu' });
  }
});

// Ürün sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    
    // Ürünü pasif yap (silme yerine)
    await connection.execute(
      'UPDATE products SET is_active = 0 WHERE id = ?',
      [id]
    );
    
    await connection.end();
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ürün silinirken hata oluştu' });
  }
});

module.exports = router;