const pool = require('../config/db');

exports.verifyCard = async (req, res) => {
  try {
    const cardInput = req.params.cardNumber || req.query.card || req.query.token;

    if (!cardInput) {
      return res.status(400).json({
        success: false,
        valid: false,
        message: 'Parameter nomor kartu atau token QR tidak disediakan.'
      });
    }

    const [rows] = await pool.query(
      `SELECT p.*, k.nama_kelompok 
       FROM petani p 
       LEFT JOIN kelompok_tani k ON p.kelompok_tani_id = k.id 
       WHERE p.nomor_kartu = ? OR p.qr_code_token = ? OR p.nik = ?`,
      [cardInput, cardInput, cardInput]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: true,
        valid: false,
        message: 'Kartu Tani tidak ditemukan dalam database Dinas Pertanian Biak Numfor.'
      });
    }

    const farmer = rows[0];
    const isValid = farmer.status_kartu === 'aktif' && farmer.status_verifikasi === 'ditetapkan';

    return res.json({
      success: true,
      valid: isValid,
      status_kartu: farmer.status_kartu,
      status_verifikasi: farmer.status_verifikasi,
      message: isValid
        ? 'KARTU TANI AKTIF & VALID. Berhak mendapatkan subsidi transportasi angkut hasil panen DAMRI Otsus.'
        : `AKSES DITOLAK: Kartu dalam status ${farmer.status_kartu.toUpperCase()} (Verifikasi: ${farmer.status_verifikasi.toUpperCase()}).`,
      data: {
        id: farmer.id,
        nomor_kartu: farmer.nomor_kartu,
        nama_lengkap: farmer.nama_lengkap,
        nik: farmer.nik,
        distrik: farmer.distrik,
        kampung: farmer.kampung,
        kelompok_tani: farmer.nama_kelompok || '-',
        komoditas_utama: farmer.komoditas_utama,
        luas_lahan: farmer.luas_lahan,
        foto: farmer.foto
      }
    });
  } catch (err) {
    console.error('API verifyCard error:', err);
    return res.status(500).json({ success: false, message: 'Kesalahan internal server saat verifikasi kartu.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const [districtStats] = await pool.query(`
      SELECT distrik, COUNT(*) as count 
      FROM petani 
      GROUP BY distrik 
      ORDER BY count DESC
    `);

    const [monthlyTrips] = await pool.query(`
      SELECT DATE_FORMAT(tanggal_penggunaan, '%Y-%m') as bulan, COUNT(*) as trips, SUM(volume_kg) as volume_kg
      FROM transportasi_damri
      GROUP BY bulan
      ORDER BY bulan ASC
    `);

    const [commodityStats] = await pool.query(`
      SELECT komoditas, SUM(volume_kg) as total_kg 
      FROM transportasi_damri 
      GROUP BY komoditas 
      ORDER BY total_kg DESC 
      LIMIT 8
    `);

    return res.json({
      success: true,
      data: {
        districts: districtStats,
        trips: monthlyTrips,
        commodities: commodityStats
      }
    });
  } catch (err) {
    console.error('API getStats error:', err);
    return res.status(500).json({ success: false, message: 'Gagal mengambil statistik.' });
  }
};
