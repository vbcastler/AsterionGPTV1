const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userroutes');
const bakimRoutes = require('./routes/bakimRoutes');
const app = express();
const adminRoutes = require('./routes/adminRoutes');


app.use('/api/admin', adminRoutes);
app.use(cors());
app.use(express.json()); // JSON body'leri parse etmek için
app.use(express.static('public'));

// Route'ları ekleyelim
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bakim', bakimRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
