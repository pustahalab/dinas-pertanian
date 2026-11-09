const pool = require('../config/db');
const QRCode = require('qrcode');

exports.preview = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kelompok 
       FROM petani p 
       LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id 
       WHERE p.id = ?`,
      [id]
    );

    if (rows.length === 0) {
      req.flash('error', 'Petani tidak ditemukan.');
      return res.redirect('/farmers');
    }

    const farmer = rows[0];

    // Generate QR Code data URL dynamically so it always renders crisp
    const qrPayload = JSON.stringify({
      nomor_kartu: farmer.nomor_kartu,
      nama: farmer.nama_lengkap,
      nik: farmer.nik,
      distrik: farmer.distrik,
      kampung: farmer.kampung,
      status: farmer.status_kartu === 'aktif' ? 'VALID' : 'NON-AKTIF',
      token: farmer.qr_code_token
    });

    const qrDataUrl = await QRCode.toDataURL(qrPayload, {
      width: 280,
      margin: 1,
      color: { dark: '#064e3b', light: '#ffffff' }
    });

    res.render('cards/preview', {
      title: `Kartu Tani OAP: ${farmer.nama_lengkap} - SIM-KARTANI`,
      farmer,
      qrDataUrl
    });
  } catch (err) {
    console.error('Card preview error:', err);
    res.status(500).send('Terjadi kesalahan memuat kartu.');
  }
};

exports.printBatch = async (req, res) => {
  try {
    const { distrik, limit = 12 } = req.query;

    let whereSql = 'WHERE p.status_verifikasi = "ditetapkan"';
    let params = [];

    if (distrik && distrik !== 'all') {
      whereSql += ' AND p.distrik = ?';
      params.push(distrik);
    }

    const [farmers] = await pool.query(
      `SELECT p.*, k.nama_kelompok 
       FROM petani p 
       LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id 
       ${whereSql} 
       ORDER BY p.id ASC 
       LIMIT ?`,
      [...params, parseInt(limit, 10)]
    );

    // Pre-generate QR data URLs for each card
    for (const f of farmers) {
      const qrPayload = JSON.stringify({
        nomor_kartu: f.nomor_kartu,
        nama: f.nama_lengkap,
        distrik: f.distrik,
        kampung: f.kampung,
        status: f.status_kartu === 'aktif' ? 'VALID' : 'NON-AKTIF',
        token: f.qr_code_token
      });
      f.qrDataUrl = await QRCode.toDataURL(qrPayload, {
        width: 200,
        margin: 1,
        color: { dark: '#064e3b', light: '#ffffff' }
      });
    }

    const [districts] = await pool.query('SELECT DISTINCT nama_distrik FROM distrik ORDER BY nama_distrik ASC');

    res.render('cards/print_batch', {
      title: 'Cetak Lembar Kartu Tani OAP - SIM-KARTANI',
      farmers,
      districts,
      selectedDistrik: distrik || 'all',
      limit
    });
  } catch (err) {
    console.error('Card print batch error:', err);
    res.status(500).send('Terjadi kesalahan memuat lembar cetak.');
  }
};
