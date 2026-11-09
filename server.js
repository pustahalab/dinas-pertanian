const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { expressViewEngine } = require('./src/utils/viewEngine');
const sessionMiddleware = require('./src/middlewares/session');

// Import routes
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const farmerRoutes = require('./src/routes/farmerRoutes');
const cardRoutes = require('./src/routes/cardRoutes');
const transportRoutes = require('./src/routes/transportRoutes');
const aidRoutes = require('./src/routes/aidRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const reportRoutes = require('./src/routes/reportRoutes');
const apiRoutes = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine
app.engine('ejs', expressViewEngine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionMiddleware);

// Global view variables helper
app.use((req, res, next) => {
  res.locals.appName = process.env.APP_NAME || 'SIM-KARTANI BIAK NUMFOR';
  res.locals.formatDate = (date) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (e) {
      return String(date);
    }
  };
  res.locals.formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return Number(num).toLocaleString('id-ID');
  };
  next();
});

// Register routes
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/farmers', farmerRoutes);
app.use('/cards', cardRoutes);
app.use('/transport', transportRoutes);
app.use('/aids', aidRoutes);
app.use('/groups', groupRoutes);
app.use('/reports', reportRoutes);
app.use('/api', apiRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('auth/login', {
    title: 'Halaman Tidak Ditemukan - 404',
    flashError: `Halaman [${req.originalUrl}] tidak ditemukan.`
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).send(`
    <div style="font-family: sans-serif; padding: 40px; text-align: center;">
      <h2 style="color: #b91c1c;">Terjadi Kesalahan Server</h2>
      <p style="color: #4b5563;">${err.message}</p>
      <a href="/dashboard" style="display: inline-block; margin-top: 15px; padding: 10px 20px; background: #059669; color: white; text-decoration: none; border-radius: 8px;">Kembali ke Dashboard</a>
    </div>
  `);
});

// Start listening
app.listen(PORT, () => {
  console.log('================================================================');
  console.log(`🚀 SIM-KARTANI BIAK NUMFOR BERJALAN DI: http://localhost:${PORT}`);
  console.log(`🌾 Sistem Manajemen Kartu Tani OAP & Transportasi DAMRI`);
  console.log(`📍 Dinas Pertanian dan Ketahanan Pangan Kabupaten Biak Numfor`);
  console.log('================================================================');
});
