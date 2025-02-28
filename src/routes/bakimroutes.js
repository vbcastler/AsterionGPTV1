const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// ✅ 1. Çalışanların bakım eklemesi için API (Sadece Çalışan erişebilir)
router.post('/ekle', verifyToken, authorizeRole(["Calisan"]), (req, res) => {
    console.log("İstek Alındı!");
    console.log("Headers:", req.headers);
    console.log("Gelen Body:", req.body);

    const { musteri_id, aciklama } = req.body;
    const calisan_id = req.user.id; // JWT'den çalışan ID'sini al

    if (!musteri_id || !aciklama) {
        return res.status(400).json({ error: "Müşteri ID ve açıklama gereklidir" });
    }

    const sql = "INSERT INTO bakimlar (musteri_id, calisan_id, aciklama) VALUES (?, ?, ?)";
    db.query(sql, [musteri_id, calisan_id, aciklama], (err, result) => {
        if (err) {
            console.error("Veritabanı hatası:", err);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }
        res.json({ message: "Bakım kaydı başarıyla eklendi!", bakim_id: result.insertId });
    });
});

// ✅ 2. Müşterinin kendi bakım bilgilerini görmesi (Sadece Müşteri erişebilir)
router.get('/guncel', verifyToken, authorizeRole(["Musteri"]), (req, res) => {
    const musteri_id = req.user.id; // JWT'den müşteri ID'sini al

    const sql = "SELECT * FROM bakimlar WHERE musteri_id = ? ORDER BY tarih DESC LIMIT 1";
    db.query(sql, [musteri_id], (err, results) => {
        if (err) {
            console.error("Veritabanı hatası:", err);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }
        if (results.length === 0) {
            return res.json({ message: "Henüz bakım kaydı bulunmamaktadır." });
        }
        res.json(results[0]);
    });
});

module.exports = router;
