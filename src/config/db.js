const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Bağlantıyı test et
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Veritabanına bağlanılamadı:', err.message);
    } else {
        console.log('✅ Veritabanı bağlantısı başarılı!');
        connection.release();
    }
});

module.exports = pool;
