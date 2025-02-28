const express = require('express');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');
const db = require('../config/db');

const router = express.Router();

// ✅ 1. Tüm bakım kayıtlarını PDF olarak indirme (Türkçe karakter desteği eklendi)
router.get('/bakimlar/pdf', verifyToken, authorizeRole(["Admin"]), (req, res) => {
    const sql = `
        SELECT bakimlar.id, users.username AS musteri, c.username AS calisan, bakimlar.tarih, bakimlar.aciklama
        FROM bakimlar
                 JOIN users ON bakimlar.musteri_id = users.id
                 JOIN users AS c ON bakimlar.calisan_id = c.id
        ORDER BY bakimlar.tarih DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Veritabanı hatası:", err);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }

        // 📌 PDF oluştur
        const doc = new PDFDocument();
        const fontPath = path.join(__dirname, '../fonts/Roboto-Regular.ttf'); // 📌 Türkçe karakter desteği için font ekledik
        if (fs.existsSync(fontPath)) {
            doc.font(fontPath);
        } else {
            console.error("⚠️ Font dosyası bulunamadı! Varsayılan font kullanılıyor.");
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="bakim_kayitlari.pdf"');
        doc.pipe(res);

        doc.fontSize(16).text("Bakım Kayıtları Raporu", { align: "center" });
        doc.moveDown();

        results.forEach((bakim, index) => {
            doc.fontSize(12).text(`Bakım ID: ${bakim.id}`);
            doc.text(`Müşteri: ${bakim.musteri}`);
            doc.text(`Çalışan: ${bakim.calisan}`);
            doc.text(`Tarih: ${new Date(bakim.tarih).toLocaleString("tr-TR")}`); // 📌 Tarihi Türkçe formatta göster
            doc.text(`Açıklama: ${bakim.aciklama}`);
            doc.moveDown();
            if (index < results.length - 1) doc.moveDown();
        });

        doc.end();
    });
});

module.exports = router;

