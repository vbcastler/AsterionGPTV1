const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// ✅ Tüm kullanıcıları listeleme (Sadece Admin erişebilir)
router.get('/all-users', verifyToken, authorizeRole(["Admin"]), (req, res) => {
    db.query('SELECT id, username, role FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Veritabanı hatası' });
        }
        res.json(results);
    });
});

module.exports = router;
