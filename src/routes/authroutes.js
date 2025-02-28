const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');  // Şimdilik kullanmıyoruz, ileride şifre hashleme ekleyebilirsin.
const db = require('../config/db');

const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir' });
    }

    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
        }

        const user = results[0];
        // Şifre kontrolü: (Güvenli hale getirmek için gelecekte bcrypt kullan)
        if (password !== user.password_hash) {
            return res.status(401).json({ error: 'Geçersiz şifre' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.json({ message: 'Giriş başarılı', token });
    });
});

module.exports = router;
